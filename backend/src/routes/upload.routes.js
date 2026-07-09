import express from 'express';
import { uploadCSV } from '../middleware/multer.js';
import { handleUpload } from '../controllers/upload.controller.js';

const router = express.Router();

// Define route for uploading and parsing CSV files
router.post('/upload', uploadCSV, handleUpload);

export default router;
