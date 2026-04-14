/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(error) and sends structured responses.
 */
const logger = require('../utils/logger');
const config = require('../config/config');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(422).json({
      success: false,
      message: 'Validation error.',
      errors,
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate entry: '${field}' already exists.`,
    });
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference: related record does not exist.',
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' });
  }

  // Default Internal Server Error
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error.',
    // Only expose stack trace in development
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
