/**
 * Placeholders for Gemini AI Prompts
 */

/**
 * Prompt to map CSV headers to CRM fields
 * @param {Array<string>} csvHeaders
 * @param {Array<string>} crmFields
 */
export const getHeaderMappingPrompt = (csvHeaders, crmFields) => {
  return `
    You are a senior data integration assistant.
    Analyze the following CSV headers:
    ${JSON.stringify(csvHeaders, null, 2)}

    And map them to the most appropriate target CRM fields:
    ${JSON.stringify(crmFields, null, 2)}

    For each CSV header, find the closest matching CRM field.
    Return a structured JSON mapping format.
  `.trim();
};

/**
 * Prompt to suggest CSV data cleaning rules
 * @param {Array<Object>} sampleRows
 */
export const getDataCleaningPrompt = (sampleRows) => {
  return `
    You are a data cleaning expert.
    Analyze these sample rows from a CSV upload:
    ${JSON.stringify(sampleRows, null, 2)}

    Suggest data cleaning and formatting improvements (e.g. invalid phone formats, missing emails, incorrect name casing).
  `.trim();
};
