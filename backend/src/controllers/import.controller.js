import fs from 'fs';
import { parseCSVFile, getCSVPreview } from '../services/csv.service.js';
import aiService from '../services/ai.service.js';
import jobService from '../services/job.service.js';
import { createController } from '../utils/controller.js';
import AppError from '../utils/AppError.js';

/**
 * Controller to handle CSV file uploads and parsing (legacy/compatibility endpoint)
 */
export const uploadCSVFile = createController(async (req, res, next) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const filePath = req.file.path;

  try {
    const isPreview = req.query.preview !== 'false';
    const limit = parseInt(req.query.limit || '50', 10);

    let parsedResult;
    if (isPreview) {
      parsedResult = await getCSVPreview(filePath, limit);
    } else {
      parsedResult = await parseCSVFile(filePath);
    }

    return {
      statusCode: 200,
      message: isPreview ? 'CSV preview parsed successfully' : 'CSV parsed successfully',
      data: {
        file: {
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype
        },
        meta: parsedResult.meta,
        records: parsedResult.data,
        errors: parsedResult.errors
      }
    };
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
});

/**
 * Controller to handle AI-powered mapping of parsed CSV records to CRM schema (synchronous endpoint)
 */
export const mapCSVRecords = createController(async (req, res) => {
  const { records, model, batchSize } = req.body;

  if (!records || !Array.isArray(records)) {
    throw new AppError('Missing or invalid records array in request body', 400);
  }

  const parsedBatchSize = batchSize ? parseInt(batchSize, 10) : undefined;
  const result = await aiService.mapCSVRecords(records, model, parsedBatchSize);

  return {
    statusCode: 200,
    message: 'CSV records mapped to CRM schema successfully',
    data: {
      imported: result.imported,
      skipped: result.skipped,
      failed: result.failed,
      records: result.records
    }
  };
});

/**
 * Controller to handle the main POST /api/import endpoint supporting loading states
 */
export const importCSVRecords = createController(async (req, res) => {
  const { records, model, batchSize, runSync } = req.body;

  if (!records || !Array.isArray(records)) {
    throw new AppError('Missing or invalid records array in request body', 400);
  }

  const parsedBatchSize = batchSize ? parseInt(batchSize, 10) : undefined;
  const isSync = runSync === true;

  if (isSync) {
    // Synchronous execution flow
    const result = await aiService.mapCSVRecords(records, model, parsedBatchSize);
    return {
      statusCode: 200,
      message: 'CSV records mapped to CRM schema successfully',
      data: {
        imported: result.imported,
        skipped: result.skipped,
        failed: result.failed,
        records: result.records
      }
    };
  }

  // Asynchronous background execution flow (supports loading/progress states)
  const job = jobService.createJob(records.length);

  // Trigger mapping asynchronously in the background
  aiService.mapCSVRecords(
    records,
    model,
    parsedBatchSize,
    (processedCount) => {
      jobService.updateJobProgress(job.id, processedCount, 'processing');
    }
  )
  .then((result) => {
    jobService.completeJob(job.id, result);
  })
  .catch((error) => {
    console.error(`Import job ${job.id} failed:`, error.message);
    jobService.failJob(job.id, error.message || 'Error occurred during AI processing');
  });

  // Respond immediately with the job information
  return {
    statusCode: 202, // Accepted
    message: 'Import process started',
    data: {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      totalRecords: job.totalRecords
    }
  };
});

/**
 * Controller to retrieve import job status and results
 */
export const getImportJobStatus = createController(async (req, res) => {
  const { jobId } = req.params;
  const job = jobService.getJob(jobId);

  if (!job) {
    throw new AppError(`Import job with ID ${jobId} not found`, 404);
  }

  return {
    statusCode: 200,
    message: 'Import job status retrieved successfully',
    data: {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      processedRecords: job.processedRecords,
      totalRecords: job.totalRecords,
      result: job.result,
      error: job.error
    }
  };
});
