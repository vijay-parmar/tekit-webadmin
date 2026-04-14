/**
 * Sequelize Database Connection & Initialization
 */
const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('../utils/logger');

// Create Sequelize instance
const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  logging: (msg) => {
    if (config.env === 'development') {
      logger.debug(msg);
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    // Use snake_case column names by default
    underscored: true,
    // Add createdAt and updatedAt timestamps
    timestamps: true,
    // Enable paranoid (soft delete) globally – models can override
    paranoid: false,
  },
});

/**
 * Test the database connection
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`✅ MySQL connected: ${config.db.host}:${config.db.port}/${config.db.name}`);
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
