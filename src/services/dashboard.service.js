/**
 * Dashboard Service
 * Aggregates statistics and recent records for the dashboard.
 */
const { Op } = require('sequelize');
const { Blog, Job, Category, User } = require('../models');

/**
 * Get aggregate statistics:
 * - total blogs, jobs, categories, locations (distinct)
 */
const getStats = async () => {
  const [totalBlogs, totalJobs, totalCategories, totalLocations] = await Promise.all([
    Blog.count({ paranoid: true }),
    Job.count({ paranoid: true }),
    Category.count({ paranoid: true }),
    // Count distinct non-null locations in jobs table
    Job.count({
      distinct: true,
      col: 'location',
      where: { location: { [Op.not]: null } },
    }),
  ]);

  return { totalBlogs, totalJobs, totalCategories, totalLocations };
};

/**
 * Get recent blog posts
 * @param {number} limit - Number of records (default 5)
 */
const getRecentBlogs = async (limit = 5) => {
  return Blog.findAll({
    limit,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'title', 'slug', 'author', 'date', 'status', 'featured_image_url', 'created_at'],
    include: [
      {
        association: 'category',
        attributes: ['id', 'name'],
        required: false,
      },
    ],
  });
};

/**
 * Get recent job postings
 * @param {number} limit - Number of records (default 5)
 */
const getRecentJobs = async (limit = 5) => {
  return Job.findAll({
    limit,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'title', 'location', 'job_type', 'experience', 'status', 'created_at'],
  });
};

module.exports = { getStats, getRecentBlogs, getRecentJobs };
