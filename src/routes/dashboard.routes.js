/**
 * Dashboard Routes
 * GET /api/dashboard/stats
 * GET /api/dashboard/recent-blogs
 * GET /api/dashboard/recent-jobs
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/authenticate');

// All dashboard routes require authentication
router.use(authenticate);

// @route  GET /api/dashboard/stats
router.get('/stats', dashboardController.getStats);

// @route  GET /api/dashboard/recent-blogs
router.get('/recent-blogs', dashboardController.getRecentBlogs);

// @route  GET /api/dashboard/recent-jobs
router.get('/recent-jobs', dashboardController.getRecentJobs);

module.exports = router;
