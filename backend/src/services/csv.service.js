import Papa from 'papaparse';
import fs from 'fs';
import AppError from '../utils/AppError.js';

/**
 * Service to handle CSV file parsing using Papa Parse
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
 * Parse only a preview of the CSV (useful for mapping columns before importing the full dataset)
 * @param {string} filePath - Path to the CSV file
 * @param {number} [limit=10] - Number of rows to parse
 */
export const getCSVPreview = async (filePath, limit = 10) => {
  return parseCSVFile(filePath, { preview: limit });
};
