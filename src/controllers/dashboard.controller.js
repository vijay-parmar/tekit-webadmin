/**
 * Dashboard Controller
 * Handles HTTP layer for dashboard overview endpoints.
 */
const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/response');

/**
 * GET /api/dashboard/stats
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    return successResponse(res, 'Dashboard stats fetched.', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/recent-blogs
 */
const getRecentBlogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const blogs = await dashboardService.getRecentBlogs(limit);
    return successResponse(res, 'Recent blogs fetched.', blogs);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/recent-jobs
 */
const getRecentJobs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const jobs = await dashboardService.getRecentJobs(limit);
    return successResponse(res, 'Recent jobs fetched.', jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getRecentBlogs, getRecentJobs };
