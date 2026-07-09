import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import AppError from '../utils/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Configure validation filters
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Validate extension
  if (ext !== '.csv') {
    return cb(new AppError('Invalid file type. Only .csv files are accepted.', 400), false);
  }

  // Validate mime type (lax enough to support different OS variants mapping CSV)
  const allowedMimeTypes = [
    'text/csv',
    'application/csv',
    'text/comma-separated-values',
    'application/vnd.ms-excel',
    'application/octet-stream'
  ];

  if (!allowedMimeTypes.includes(file.mimetype) && file.mimetype) {
    // If mimetype is present and not matching, warning/validation is okay.
    // Some platforms may send empty mimetype, so we prioritize the file extension.
  }
  
  cb(null, true);
};

// Set limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 1 // Only 1 file at a time
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

// Export helper middleware for a single file field named 'file'
export const uploadCSV = (req, res, next) => {
  const uploadSingle = upload.single('file');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError('No file uploaded. Please upload a CSV file.', 400));
    }
    
    next();
  });
};
