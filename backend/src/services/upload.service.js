import fs from 'fs';
import path from 'path';
import AppError from '../utils/AppError.js';

/**
 * Service to handle file upload operations and lifecycle management
 */

/**
 * Delete a file asynchronously from the uploads folder
 * @param {string} filePath - Path to the file to delete
 */
export const deleteFile = async (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error(`Error deleting file at ${filePath}:`, error.message);
  }
};

/**
 * Validate that a file is present, has the correct extension, and fits size limits
 * @param {Object} file - The file object from express/multer
 * @param {Object} [options={}] - Custom validation options
 * @param {number} [options.maxSize] - Max allowed file size in bytes
 */
export const validateFile = (file, options = {}) => {
  if (!file) {
    throw new AppError('No file uploaded. Please upload a CSV file.', 400);
  }

  // Validate extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') {
    throw new AppError('Invalid file type. Only .csv files are accepted.', 400);
  }

  // Validate size (default to 10MB)
  const maxSize = options.maxSize || 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new AppError(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB.`, 400);
  }

  return true;
};
