/**
 * Job Service
 * CRUD + search/pagination business logic for Job Posting module.
 */
const { Op } = require('sequelize');
const { Job } = require('../models');
const { getPagination } = require('../utils/pagination');
const { paginationMeta } = require('../utils/response');

/**
 * List jobs with search, filter & pagination
 */
const listJobs = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  // Full-text like search on title
  if (query.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query.search}%` } },
      { location: { [Op.like]: `%${query.search}%` } },
    ];
  }
  if (query.location) where.location = { [Op.like]: `%${query.location}%` };
  if (query.job_type) where.job_type = query.job_type;
  if (query.status) where.status = query.status;

  const { count, rows } = await Job.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ]
  });

  return {
    data: rows,
    meta: paginationMeta(count, page, limit),
  };
};

/**
 * Get a single job by ID
 */
const getJobById = async (id) => {
  const job = await Job.findByPk(id, {
    include: [
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ]
  });
  if (!job) {
    const err = new Error('Job posting not found.');
    err.statusCode = 404;
    throw err;
  }
  return job;
};

/**
 * Create a new job posting
 */
const createJob = async (data, userId) => {
  return Job.create({ ...data, created_by: userId, updated_by: userId });
};

/**
 * Update a job posting
 */
const updateJob = async (id, data, userId) => {
  const job = await getJobById(id);
  data.updated_by = userId;
  await job.update(data);
  return job.reload({
    include: [
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ]
  });
};

/**
 * Soft delete a job posting
 */
const deleteJob = async (id) => {
  const job = await getJobById(id);
  await job.destroy();
  return { id: job.id };
};

module.exports = { listJobs, getJobById, createJob, updateJob, deleteJob };
