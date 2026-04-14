/**
 * Server Entry Point
 * Connects to DB, syncs models, starts HTTP server.
 */
require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
const config = require('./config/config');
const logger = require('./utils/logger');

// Load all models so associations are registered before sync
require('./models');

const startServer = async () => {
  try {
    // 1. Test database connection
    await connectDB();

    // 2. Sync models — use migrations in production, sync in dev only
    if (config.env === 'development') {
      // alter: true auto-updates schema without dropping tables
      await sequelize.sync({ alter: false });
      logger.info('📦 Sequelize models synced (development mode).');
    }

    // 3. Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 ${config.appName} running on port ${config.port} [${config.env}]`);
      logger.info(`   Health: http://localhost:${config.port}/health`);
      logger.info(`   API:    http://localhost:${config.port}/api`);
    });

    // ─── Graceful Shutdown ────────────────────────────────────────────────────
    const shutdown = async (signal) => {
      logger.info(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await sequelize.close();
          logger.info('✅ Database connection closed.');
          process.exit(0);
        } catch (err) {
          logger.error('❌ Error during shutdown:', err.message);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
    });

    // Uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err.message);
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
