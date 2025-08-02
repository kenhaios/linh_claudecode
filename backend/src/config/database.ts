import mongoose from 'mongoose';
import { config, isDevelopment, isTest } from './environment';
import { logger } from '../utils/logger';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const uri = isTest() ? config.MONGODB_TEST_URI : config.MONGODB_URI;
  
  const options: mongoose.ConnectOptions = {
    // Connection settings
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close connections after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    
    // Buffering settings
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
    
    // Monitoring
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    
    // Vietnamese-specific database settings
    appName: 'HaLinh-TuVi-Backend',
  };

  return { uri, options };
};

class Database {
  private static instance: Database;
  private connection?: mongoose.Connection;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.connection?.readyState === 1) {
        logger.info('Database already connected');
        return;
      }

      const { uri, options } = getDatabaseConfig();
      
      logger.info('Connecting to MongoDB...', {
        uri: uri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials in logs
        environment: config.NODE_ENV,
      });

      await mongoose.connect(uri, options);
      this.connection = mongoose.connection;

      this.setupEventListeners();
      
      logger.info('Successfully connected to MongoDB', {
        host: this.connection.host,
        port: this.connection.port,
        name: this.connection.name,
      });

      // Setup indexes in development
      if (isDevelopment()) {
        await this.createIndexes();
      }

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');
      }
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnection(): mongoose.Connection | undefined {
    return this.connection;
  }

  public isConnected(): boolean {
    return this.connection?.readyState === 1;
  }

  private setupEventListeners(): void {
    if (!this.connection) return;

    this.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });

    this.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    this.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    this.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  private async createIndexes(): Promise<void> {
    try {
      logger.info('Creating database indexes...');

      // User indexes
      await mongoose.connection.collection('users').createIndex(
        { email: 1 }, 
        { unique: true, sparse: true }
      );
      await mongoose.connection.collection('users').createIndex(
        { phone: 1 }, 
        { unique: true, sparse: true }
      );
      await mongoose.connection.collection('users').createIndex(
        { createdAt: 1 }
      );

      // Astrology chart indexes
      await mongoose.connection.collection('astrologycharts').createIndex(
        { userId: 1, createdAt: -1 }
      );
      await mongoose.connection.collection('astrologycharts').createIndex(
        { 'birthData.solarDate': 1 }
      );
      await mongoose.connection.collection('astrologycharts').createIndex(
        { 'birthData.lunarDate.year': 1, 'birthData.lunarDate.month': 1 }
      );

      // Consultation indexes
      await mongoose.connection.collection('consultations').createIndex(
        { userId: 1, createdAt: -1 }
      );
      await mongoose.connection.collection('consultations').createIndex(
        { sessionId: 1 }
      );
      await mongoose.connection.collection('consultations').createIndex(
        { status: 1, expiresAt: 1 }
      );

      // Token transaction indexes
      await mongoose.connection.collection('tokentransactions').createIndex(
        { userId: 1, timestamp: -1 }
      );
      await mongoose.connection.collection('tokentransactions').createIndex(
        { 'reference.type': 1, 'reference.id': 1 }
      );

      // Payment indexes
      await mongoose.connection.collection('payments').createIndex(
        { userId: 1, createdAt: -1 }
      );
      await mongoose.connection.collection('payments').createIndex(
        { providerTransactionId: 1 }
      );
      await mongoose.connection.collection('payments').createIndex(
        { status: 1, createdAt: -1 }
      );

      // TTL indexes for sessions and temporary data
      await mongoose.connection.collection('sessions').createIndex(
        { expiresAt: 1 }, 
        { expireAfterSeconds: 0 }
      );

      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error('Failed to create database indexes:', error);
      // Don't throw here, indexes are not critical for basic functionality
    }
  }

  // Health check method
  public async healthCheck(): Promise<{
    status: string;
    readyState: number;
    host?: string;
    port?: number;
    name?: string;
  }> {
    const readyState = this.connection?.readyState || 0;
    const readyStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return {
      status: readyStates[readyState] || 'unknown',
      readyState,
      host: this.connection?.host,
      port: this.connection?.port,
      name: this.connection?.name,
    };
  }
}

// Export singleton instance
export const database = Database.getInstance();

// Helper function for graceful shutdown
export const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}. Gracefully shutting down database connection...`);
  await database.disconnect();
  logger.info('Database connection closed.');
};

export default database;