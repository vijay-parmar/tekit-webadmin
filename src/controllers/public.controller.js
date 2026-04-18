const blogService = require('../services/blog.service');
const jobService = require('../services/job.service');
const { successResponse } = require('../utils/response');

/**
 * GET /api/public/blogs
 * Publicly list blogs with search & pagination
 */
const listPublicBlogs = async (req, res, next) => {
  try {
    const result = await blogService.listBlogs(req.query);
    return successResponse(res, 'Blogs fetched.', result.data, 200, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/public/jobs
 * Publicly list jobs with search & pagination
 */
const listPublicJobs = async (req, res, next) => {
  try {
    const result = await jobService.listJobs(req.query);
    return successResponse(res, 'Jobs fetched.', result.data, 200, result.meta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listPublicBlogs,
  listPublicJobs,
};
