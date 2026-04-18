/**
 * Public Routes
 * GET /api/public/blogs
 * GET /api/public/jobs
 */
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');
const validate = require('../middlewares/validate');
const { listBlogSchema } = require('../validators/blog.validator');
const { listJobSchema } = require('../validators/job.validator');

// These routes do NOT use the authenticate middleware
router.get(
  '/blogs',
  validate(listBlogSchema, 'query'),
  publicController.listPublicBlogs
);

router.get(
  '/jobs',
  validate(listJobSchema, 'query'),
  publicController.listPublicJobs
);

module.exports = router;
