import express from 'express';
import { query } from 'express-validator';
import { uploadCSVFile } from '../controllers/import.controller.js';
import { uploadCSV } from '../middleware/multer.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

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

export default router;
