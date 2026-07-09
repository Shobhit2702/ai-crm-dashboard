import Papa from 'papaparse';
import fs from 'fs';
import AppError from '../utils/AppError.js';

// Simple email validation regex matching the frontend pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes row keys to lowercase and trims values to handle casing discrepancies (e.g. Name vs name)
 * @param {Object} row - The raw row from CSV parsing
 * @returns {Object} Normalized row with name, email, company, and location
 */
export const normalizeRow = (row) => {
  const normalized = {};
  Object.keys(row).forEach((key) => {
    const normalizedKey = key.trim().toLowerCase();
    normalized[normalizedKey] = row[key] !== null && row[key] !== undefined ? String(row[key]).trim() : '';
  });
  
  return {
    name: normalized.name || row.Name || row.name || '',
    email: normalized.email || row.Email || row.email || '',
    company: normalized.company || row.Company || row.company || '',
    location: normalized.location || row.Location || row.location || ''
  };
};

/**
 * Validates a single CSV row.
 * Returns the normalized row along with validity status and specific field errors.
 * @param {Object} rawRow - The raw row to validate
 * @returns {Object} Validated row with errors and validity status
 */
export const validateRow = (rawRow) => {
  const normalized = normalizeRow(rawRow);
  const errors = {};

  // Validate Name
  if (!normalized.name) {
    errors.name = 'Name is required';
  }

  // Validate Email
  if (!normalized.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(normalized.email)) {
    errors.email = 'Invalid email format';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    ...normalized,
    isValid,
    errors,
    raw: rawRow
  };
};

/**
 * Parses and processes a CSV file, validating all rows.
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Object>} Object containing preview rows, counts, and columns
 */
export const parseAndValidateCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new AppError('CSV file not found', 404));
    }

    const fileStream = fs.createReadStream(filePath);

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Normalize values to strings first to keep validations predictable
      complete: (results) => {
        const rawData = results.data;
        const columns = results.meta.fields || [];

        // Validate each row
        const validatedRows = rawData.map((row, index) => {
          const validated = validateRow(row);
          return {
            ...validated,
            index // 0-indexed position in file
          };
        });

        const validRowsCount = validatedRows.filter((r) => r.isValid).length;
        const invalidRowsCount = validatedRows.filter((r) => !r.isValid).length;

        resolve({
          preview: validatedRows,
          totalRows: validatedRows.length,
          columns,
          validRows: validRowsCount,
          invalidRows: invalidRowsCount
        });
      },
      error: (error) => {
        reject(new AppError(`Error parsing CSV: ${error.message}`, 400));
      }
    });
  });
};

/**
 * Service to handle basic CSV file parsing using Papa Parse (Legacy support)
 */
export const parseCSVFile = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new AppError('CSV file not found', 404));
    }

    const fileStream = fs.createReadStream(filePath);
    
    const config = {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      ...options,
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
          meta: results.meta
        });
      },
      error: (error) => {
        reject(new AppError(`Error parsing CSV: ${error.message}`, 400));
      }
    };

    Papa.parse(fileStream, config);
  });
};

/**
 * Parse only a preview of the CSV (Legacy support)
 */
export const getCSVPreview = async (filePath, limit = 10) => {
  return parseCSVFile(filePath, { preview: limit });
};
