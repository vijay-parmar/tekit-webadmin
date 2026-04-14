/**
 * Morgan HTTP Request Logger Middleware
 * Uses Winston as the stream target.
 */
const morgan = require('morgan');
const logger = require('../utils/logger');
const config = require('../config/config');

// Custom token: response body (optional, useful for debugging)
const morganFormat = config.env === 'production'
  ? 'combined'   // Apache combined log format in production
  : ':method :url :status :response-time ms - :res[content-length]';

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
  // Skip health check endpoints to reduce noise
  skip: (req) => req.url === '/health' || req.url === '/api/health',
});

module.exports = morganMiddleware;
