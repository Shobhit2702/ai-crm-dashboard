import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './src/config/env.js';
import apiRouter from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import AppError from './src/utils/AppError.js';

const app = express();

// Secure API with Helmet headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) setup
const corsOptions = {
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Request logging with Morgan
if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  // Use standard combined format in production
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount combined API routes under /api
app.use('/api', apiRouter);

// Handle unknown API endpoints
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server.`, 404));
});

// Global error handler middleware
app.use(errorHandler);

export default app;
