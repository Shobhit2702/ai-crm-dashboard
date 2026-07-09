/**
 * Reusable prompt builder for mapping parsed CSV records to CRM schema.
 */

const CRM_FIELDS = [
  'created_at',
  'name',
  'email',
  'country_code',
  'mobile_without_country_code',
  'company',
  'city',
  'state',
  'country',
  'lead_owner',
  'crm_status',
  'crm_note',
  'data_source',
  'possession_time',
  'description'
];

const ALLOWED_CRM_STATUS = [
  'GOOD_LEAD_FOLLOW_UP',
  'DID_NOT_CONNECT',
  'BAD_LEAD',
  'SALE_DONE'
];

const ALLOWED_DATA_SOURCE = [
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots'
];

/**
 * Builds the prompt for Gemini API to map CSV rows to CRM fields.
 * 
 * @param {Array<Object>} records - The parsed CSV records (array of objects with arbitrary keys).
 * @returns {string} The constructed prompt.
 */
export const buildCrmMappingPrompt = (records) => {
  return `
You are an expert CRM data integration system. Your task is to intelligently map arbitrary parsed CSV records into a standardized CRM schema.

Target CRM Fields:
- created_at: The timestamp of when the lead was created. If not present in the record, default to the current date/time or leave it blank.
- name: Contact's full name.
- email: Contact's email address.
- country_code: International phone country code (e.g. "+1", "+91"). If the country code is part of the phone number in the source record, extract it.
- mobile_without_country_code: Mobile/phone number excluding the country code. If the country code is mixed, extract and separate it from this field.
- company: Company name.
- city: City.
- state: State.
- country: Country name or code.
- lead_owner: Lead owner or manager.
- crm_status: Current status of the lead. MUST map to one of these exact values: ${ALLOWED_CRM_STATUS.join(', ')}. If not clearly mapping to any of these, leave blank.
- crm_note: Notes, comments, or transaction logs.
- data_source: Lead data source. MUST map to one of these exact values: ${ALLOWED_DATA_SOURCE.join(', ')}. If not clearly mapping to any of these, leave blank.
- possession_time: Possession timeline or details.
- description: General description, remarks, or extra details.

CRITICAL MAPPING RULES:
1. If no confident mapping exists for a field, leave it blank (use empty string "").
2. SKIP/EXCLUDE any records that contain NEITHER an email nor any mobile/phone number (i.e. if both email and mobile/phone are missing/empty, do NOT include that record in the output array).
3. Do not generate explanations or text. Your response must be ONLY a valid JSON array of mapped objects. Do not wrap the JSON output in markdown blocks (e.g. do NOT use \`\`\`json ... \`\`\`).

Input CSV Records:
${JSON.stringify(records, null, 2)}
`.trim();
};
