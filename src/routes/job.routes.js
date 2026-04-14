/**
 * Job Routes
 * GET    /api/jobs
 * GET    /api/jobs/:id
 * POST   /api/jobs
 * PUT    /api/jobs/:id
 * DELETE /api/jobs/:id
 */
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authenticate = require('../middlewares/authenticate');
const { requirePermission } = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createJobSchema, updateJobSchema, listJobSchema } = require('../validators/job.validator');

// All routes require login
router.use(authenticate);

router.get(
  '/',
  requirePermission('jobs', 'view'),
  validate(listJobSchema, 'query'),
  jobController.listJobs
);

router.get(
  '/:id',
  requirePermission('jobs', 'view'),
  jobController.getJob
);

router.post(
  '/',
  requirePermission('jobs', 'create'),
  validate(createJobSchema),
  jobController.createJob
);

router.put(
  '/:id',
  requirePermission('jobs', 'edit'),
  validate(updateJobSchema),
  jobController.updateJob
);

router.delete(
  '/:id',
  requirePermission('jobs', 'delete'),
  jobController.deleteJob
);

module.exports = router;
