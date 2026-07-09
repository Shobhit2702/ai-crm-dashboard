import express from 'express';
import healthRoutes from './health.routes.js';
import importRoutes from './import.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

// Mount routes
router.use('/', healthRoutes);
router.use('/import', importRoutes);
router.use('/', uploadRoutes);

export default router;
