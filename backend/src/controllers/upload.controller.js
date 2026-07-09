import { parseAndValidateCSV } from '../services/csv.service.js';
import { deleteFile, validateFile } from '../services/upload.service.js';

/**
 * Controller to handle file upload and parsing
 */
export const handleUpload = async (req, res, next) => {
  try {
    // 1. Validate file (e.g. exists, extension, size)
    validateFile(req.file);

    // 2. Parse and validate CSV data
    const parseResult = await parseAndValidateCSV(req.file.path);

    // 3. Return JSON response
    res.status(200).json(parseResult);
  } catch (error) {
    next(error);
  } finally {
    // 4. Clean up uploaded file asynchronously to keep storage clean
    if (req.file && req.file.path) {
      await deleteFile(req.file.path);
    }
  }
};
