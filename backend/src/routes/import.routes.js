import express from 'express';
import { query, body } from 'express-validator';
import { 
  uploadCSVFile, 
  mapCSVRecords, 
  importCSVRecords, 
  getImportJobStatus 
} from '../controllers/import.controller.js';
import { uploadCSV } from '../middleware/multer.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// POST /api/import - Main import and mapping route (supports sync & async)
router.post(
  '/',
  [
    body('records')
      .isArray({ min: 1 })
      .withMessage('records parameter must be a non-empty array of CSV rows'),
    body('model')
      .optional()
      .isString()
      .withMessage('model parameter must be a string representing the Gemini model'),
    body('batchSize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('batchSize parameter must be a positive integer'),
    body('runSync')
      .optional()
      .isBoolean()
      .withMessage('runSync parameter must be a boolean')
  ],
  validate,
  importCSVRecords
);

// GET /api/import/status/:jobId - Check progress of background import jobs
router.get(
  '/status/:jobId',
  getImportJobStatus
);

// POST /api/import/upload - Upload file and parse (Legacy/Compatibility)
router.post(
  '/upload',
  uploadCSV,
  [
    query('preview')
      .optional()
      .isBoolean()
      .withMessage('preview parameter must be a boolean (true or false)'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('limit must be an integer between 1 and 1000')
  ],
  validate,
  uploadCSVFile
);

// POST /api/import/map - Direct mapping of parsed records (Legacy/Compatibility)
router.post(
  '/map',
  [
    body('records')
      .isArray({ min: 1 })
      .withMessage('records parameter must be a non-empty array of CSV rows'),
    body('model')
      .optional()
      .isString()
      .withMessage('model parameter must be a string representing the Gemini model'),
    body('batchSize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('batchSize parameter must be a positive integer')
  ],
  validate,
  mapCSVRecords
);

export default router;
