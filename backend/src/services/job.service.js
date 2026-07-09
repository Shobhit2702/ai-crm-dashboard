import crypto from 'crypto';

class JobService {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Creates a new job and stores it in memory.
   * @param {number} totalRecords - Total number of records to be processed.
   * @returns {Object} The created job object.
   */
  createJob(totalRecords) {
    const jobId = crypto.randomUUID();
    const job = {
      id: jobId,
      status: 'pending',
      progress: 0,
      totalRecords,
      processedRecords: 0,
      result: null,
      error: null,
      createdAt: new Date()
    };
    this.jobs.set(jobId, job);
    return job;
  }

  /**
   * Retrieves a job by ID.
   * @param {string} jobId - The job identifier.
   * @returns {Object|undefined} The job object or undefined if not found.
   */
  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  /**
   * Updates progress of a running job.
   * @param {string} jobId - The job identifier.
   * @param {number} processedRecords - Count of processed records.
   * @param {string} [status='processing'] - Current status.
   */
  updateJobProgress(jobId, processedRecords, status = 'processing') {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.processedRecords = Math.min(processedRecords, job.totalRecords);
    job.status = status;
    job.progress = job.totalRecords > 0 
      ? Math.round((job.processedRecords / job.totalRecords) * 100) 
      : 100;
    
    this.jobs.set(jobId, job);
  }

  /**
   * Completes a job and sets the final mapped result.
   * @param {string} jobId - The job identifier.
   * @param {Object} result - The mapped records and statistics.
   */
  completeJob(jobId, result) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'completed';
    job.progress = 100;
    job.processedRecords = job.totalRecords;
    job.result = result;
    this.jobs.set(jobId, job);
  }

  /**
   * Fails a job with an error message.
   * @param {string} jobId - The job identifier.
   * @param {string} errorMsg - The error reason.
   */
  failJob(jobId, errorMsg) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'failed';
    job.error = errorMsg;
    this.jobs.set(jobId, job);
  }
}

export default new JobService();
