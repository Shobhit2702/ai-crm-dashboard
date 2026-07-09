import { ai } from '../config/gemini.js';
import { buildCrmMappingPrompt } from '../prompts/crmPrompt.js';
import AppError from '../utils/AppError.js';

class AIService {
  /**
   * Intelligently maps arbitrary CSV rows to the standard CRM schema using Gemini API.
   * 
   * @param {Array<Object>} records - The parsed CSV records.
   * @param {string} [modelName='gemini-2.5-flash'] - The Gemini model to use.
   * @param {number} [batchSize=20] - Number of records per batch.
   * @param {Function} [onProgress=null] - Callback triggered with processed count.
   * @returns {Promise<Object>} The mapping result stats and records.
   */
  async mapCSVRecords(records, modelName = 'gemini-2.5-flash', batchSize = 20, onProgress = null) {
    if (!ai) {
      throw new AppError(
        'Google Gen AI client is not initialized. Please configure GEMINI_API_KEY in your .env file.',
        500
      );
    }

    if (!Array.isArray(records) || records.length === 0) {
      throw new AppError('Invalid input: records must be a non-empty array.', 400);
    }

    const targetBatchSize = typeof batchSize === 'number' && batchSize > 0 ? batchSize : 20;

    let imported = 0;
    let skipped = 0;
    let failed = 0;
    const finalRecords = [];

    try {
      // Enforce sequential batch processing
      for (let i = 0; i < records.length; i += targetBatchSize) {
        const batch = records.slice(i, i + targetBatchSize);
        console.log(`Processing batch ${Math.floor(i / targetBatchSize) + 1} (${batch.length} records) sequentially...`);

        let attempts = 0;
        const maxAttempts = 2; // Initial attempt + 1 retry
        let batchSuccess = false;
        let mappedResult = null;

        while (attempts < maxAttempts && !batchSuccess) {
          attempts++;
          try {
            const prompt = buildCrmMappingPrompt(batch);

            // Define the target schema structure to enforce structured JSON output from Gemini
            const responseSchema = {
              type: 'ARRAY',
              description: 'Array of mapped CRM records',
              items: {
                type: 'OBJECT',
                properties: {
                  created_at: { type: 'STRING', description: 'ISO timestamp or formatted date when the lead was created, or empty' },
                  name: { type: 'STRING', description: 'Contact name' },
                  email: { type: 'STRING', description: 'Contact email address' },
                  country_code: { type: 'STRING', description: 'International phone country code (e.g. +1, +91)' },
                  mobile_without_country_code: { type: 'STRING', description: 'Phone/mobile number without country code' },
                  company: { type: 'STRING', description: 'Company name' },
                  city: { type: 'STRING', description: 'City name' },
                  state: { type: 'STRING', description: 'State name' },
                  country: { type: 'STRING', description: 'Country name or code' },
                  lead_owner: { type: 'STRING', description: 'Assigned lead owner' },
                  crm_status: { 
                    type: 'STRING', 
                    description: 'CRM status. Allowed values: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE, or empty string.'
                  },
                  crm_note: { type: 'STRING', description: 'Relevant notes or comments' },
                  data_source: { 
                    type: 'STRING', 
                    description: 'Data source. Allowed values: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots, or empty string.'
                  },
                  possession_time: { type: 'STRING', description: 'Possession time details' },
                  description: { type: 'STRING', description: 'General description' }
                }
              }
            };

            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.1 // Use low temperature for deterministic mapping
              }
            });

            if (!response || !response.text) {
              throw new AppError('Empty response received from Gemini API.', 500);
            }

            let responseText = response.text.trim();

            // Fallback cleanup if model wrapped JSON in markdown blocks
            if (responseText.startsWith('```json')) {
              responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (responseText.startsWith('```')) {
              responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            mappedResult = JSON.parse(responseText);

            if (!Array.isArray(mappedResult)) {
              throw new AppError('Gemini API did not return a JSON array as expected.', 500);
            }

            batchSuccess = true;
          } catch (error) {
            console.error(`Attempt ${attempts} failed for batch starting at index ${i}:`, error.message);
            if (attempts >= maxAttempts) {
              console.error(`Batch starting at index ${i} failed permanently after ${maxAttempts} attempts.`);
              failed += batch.length;
            } else {
              // Wait 1 second before retry to reduce pressure on API rates / temporary network blip
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        if (batchSuccess && mappedResult) {
          // Filter and sanitize the records further according to target fields and allowed values
          const allowedStatuses = new Set(['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE']);
          const allowedDataSources = new Set(['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots']);

          const batchImportedRecords = [];
          let batchSkippedCount = 0;

          mappedResult.forEach(row => {
            const sanitized = {};
            
            // Map all fields and default undefined properties to empty strings
            sanitized.created_at = row.created_at || '';
            sanitized.name = row.name || '';
            sanitized.email = row.email || '';
            sanitized.country_code = row.country_code || '';
            sanitized.mobile_without_country_code = row.mobile_without_country_code || '';
            sanitized.company = row.company || '';
            sanitized.city = row.city || '';
            sanitized.state = row.state || '';
            sanitized.country = row.country || '';
            sanitized.lead_owner = row.lead_owner || '';
            
            // Validate crm_status
            sanitized.crm_status = allowedStatuses.has(row.crm_status) ? row.crm_status : '';
            
            sanitized.crm_note = row.crm_note || '';
            
            // Validate data_source
            sanitized.data_source = allowedDataSources.has(row.data_source) ? row.data_source : '';
            
            sanitized.possession_time = row.possession_time || '';
            sanitized.description = row.description || '';

            // Rule: Skip records that contain neither email nor mobile
            const hasEmail = sanitized.email && sanitized.email.trim().length > 0;
            const hasMobile = sanitized.mobile_without_country_code && sanitized.mobile_without_country_code.trim().length > 0;
            
            if (hasEmail || hasMobile) {
              batchImportedRecords.push(sanitized);
            } else {
              batchSkippedCount++;
            }
          });

          // Add difference of input batch size vs mapped results length (missing rows skipped by Gemini)
          const missingCount = Math.max(0, batch.length - mappedResult.length);
          batchSkippedCount += missingCount;

          imported += batchImportedRecords.length;
          skipped += batchSkippedCount;
          finalRecords.push(...batchImportedRecords);
        }

        if (typeof onProgress === 'function') {
          onProgress(Math.min(i + targetBatchSize, records.length));
        }
      }

      return {
        imported,
        skipped,
        failed,
        records: finalRecords
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Gemini mapping failed: ${error.message}`, 500);
    }
  }
}

export default new AIService();
