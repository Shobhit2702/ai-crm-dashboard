import fs from 'fs';
import { parseCSVFile, getCSVPreview } from '../services/csv.service.js';
import AppError from '../utils/AppError.js';

/**
 * Controller to handle CSV file uploads and parsing
 */
export const uploadCSVFile = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const filePath = req.file.path;

  try {
    const isPreview = req.query.preview !== 'false'; // Default to preview for safety/performance
    const limit = parseInt(req.query.limit || '50', 10);

    let parsedResult;

    if (isPreview) {
      parsedResult = await getCSVPreview(filePath, limit);
    } else {
      parsedResult = await parseCSVFile(filePath);
    }

    res.status(200).json({
      success: true,
      message: isPreview ? 'CSV preview parsed successfully' : 'CSV parsed successfully',
      file: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      },
      meta: parsedResult.meta,
      data: parsedResult.data,
      errors: parsedResult.errors
    });
  } catch (error) {
    next(error);
  } finally {
    // Delete file immediately after parsing to maintain statelessness
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting temporary file ${filePath}:`, err.message);
        }
      });
    }
  }
};
