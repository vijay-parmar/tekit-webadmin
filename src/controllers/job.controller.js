/**
 * Job Controller
 * HTTP layer for Job Posting management.
 */
const jobService = require('../services/job.service');
const { successResponse } = require('../utils/response');

/**
 * GET /api/jobs
 */
const listJobs = async (req, res, next) => {
  try {
    const result = await jobService.listJobs(req.query);
    return successResponse(res, 'Jobs fetched.', result.data, 200, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id
 */
const getJob = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return successResponse(res, 'Job fetched.', job);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs
 */
const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body, req.user.id);
    return successResponse(res, 'Job posting created successfully.', job, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/jobs/:id
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body, req.user.id);
    return successResponse(res, 'Job posting updated successfully.', job);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/jobs/:id
 */
const deleteJob = async (req, res, next) => {
  try {
    const result = await jobService.deleteJob(req.params.id);
    return successResponse(res, 'Job posting deleted successfully.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = { listJobs, getJob, createJob, updateJob, deleteJob };
