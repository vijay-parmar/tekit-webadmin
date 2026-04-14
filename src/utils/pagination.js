/**
 * Pagination Helper
 * Parses query params and builds Sequelize limit/offset options.
 */
const config = require('../config/config');

/**
 * Parse and validate pagination query params
 * @param {Object} query - Express req.query
 * @returns {{ page, limit, offset }}
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    config.pagination.maxPageSize,
    Math.max(1, parseInt(query.limit, 10) || config.pagination.defaultPageSize)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

module.exports = { getPagination };
