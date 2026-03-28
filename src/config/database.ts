import prisma from '../lib/prisma';
import { logger } from '../lib/logger';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

export const connectDatabase = async (retries = MAX_RETRIES): Promise<void> => {
  try {
    logger.info(`🔌 Connecting to database (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES})...`);
    
    // Log the database host (without credentials)
    const dbUrl = process.env.DATABASE_URL || '';
    const hostMatch = dbUrl.match(/@([^:]+)/);
    logger.info(`📊 Database host: ${hostMatch ? hostMatch[1] : 'unknown'}`);
    
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    
    // Test the connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    logger.info('✅ Database query test successful');
  } catch (error) {
    logger.error(`❌ Database connection failed (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`);
    logger.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    
    if (retries > 1) {
      logger.info(`🔄 Retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDatabase(retries - 1);
    }
    
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected');
  } catch (error) {
    logger.error('❌ Error disconnecting database:', error);
  }
};
