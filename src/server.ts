import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './lib/logger';

const startServer = async () => {
  try {
    // Log all environment variables
    logger.info('🔧 Environment check:');
    logger.info(`  NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    logger.info(`  PORT: ${process.env.PORT || '3000'}`);
    logger.info(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ NOT SET'}`);
    logger.info(`  JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET'}`);
    logger.info(`  LOG_LEVEL: ${process.env.LOG_LEVEL || 'info'}`);

    // Validate required environment variables
    if (!process.env.JWT_SECRET) {
      logger.error('❌ JWT_SECRET is not set! This is required for authentication.');
      process.exit(1);
    }

    if (!process.env.DATABASE_URL) {
      logger.error('❌ DATABASE_URL is not set! This is required for database connection.');
      process.exit(1);
    }

    // Connect to database
    await connectDatabase();

    const port = parseInt(process.env.PORT || '3000', 10);
    
    const server = app.listen(port, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📍 API URL: http://0.0.0.0:${port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
