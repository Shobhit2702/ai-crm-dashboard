import { env } from '../config/env.js';

/**
 * Global Express Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let status = err.status || 'error';
  let errors = err.errors || [];
  let isOperational = err.isOperational || false;

  // Handle Multer specific errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    status = 'fail';
    isOperational = true;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size is too large. Maximum limit is 50MB.';
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  // Handle express-validator or validation errors that might be formatted differently
  // Log the error for internal tracking
  if (statusCode === 500 && env.isDevelopment) {
    console.error('\x1b[31m%s\x1b[0m', 'Unexpected Programming Error:', err);
  } else if (statusCode === 500) {
    console.error('Unexpected Programming Error:', err.message, err.stack);
  }

  // Send response based on environment
  if (env.isDevelopment) {
    return res.status(statusCode).json({
      success: false,
      status,
      message,
      errors,
      stack: err.stack,
      error: err
    });
  }

  // Production: Do not leak internal stack traces or non-operational messages
  return res.status(statusCode).json({
    success: false,
    status,
    message: isOperational ? message : 'Something went wrong on our end. Please try again later.',
    errors: isOperational ? errors : []
  });
};
