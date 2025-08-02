import Redis, { RedisOptions } from 'ioredis';
import { config, isDevelopment } from './environment';
import { logger } from '../utils/logger';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  options: RedisOptions;
}

const getRedisConfig = (): RedisConfig => {
  const options: RedisOptions = {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DB,
    
    // Connection settings
    connectTimeout: 10000,
    commandTimeout: 5000,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    
    // Reconnection settings
    lazyConnect: true,
    keepAlive: 30000,
    
    // Key prefix for Vietnamese application
    keyPrefix: 'halinh:',
    
    // Family: use IPv4
    family: 4,
    
    // Retry strategy
    retryDelayOnClusterDown: 300,
    enableAutoPipelining: true,
  };

  return {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DB,
    options,
  };
};

class RedisManager {
  private static instance: RedisManager;
  private client?: Redis;
  private subscriber?: Redis;
  private publisher?: Redis;

  private constructor() {}

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async connect(): Promise<void> {
    try {
      const { options } = getRedisConfig();

      logger.info('Connecting to Redis...', {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        db: config.REDIS_DB,
      });

      // Main Redis client
      this.client = new Redis(options);
      
      // Separate clients for pub/sub to avoid blocking
      this.subscriber = new Redis({
        ...options,
        keyPrefix: 'halinh:sub:',
      });
      
      this.publisher = new Redis({
        ...options,
        keyPrefix: 'halinh:pub:',
      });

      this.setupEventListeners();

      // Test connection
      await this.client.ping();
      
      logger.info('Successfully connected to Redis', {
        status: this.client.status,
        mode: this.client.mode,
      });

      // Setup cache in development
      if (isDevelopment()) {
        await this.setupDevelopmentCache();
      }

    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      const clients = [this.client, this.subscriber, this.publisher].filter(Boolean);
      
      await Promise.all(
        clients.map(async (client) => {
          if (client) {
            await client.quit();
          }
        })
      );

      logger.info('Disconnected from Redis');
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }

  public getClient(): Redis | undefined {
    return this.client;
  }

  public getSubscriber(): Redis | undefined {
    return this.subscriber;
  }

  public getPublisher(): Redis | undefined {
    return this.publisher;
  }

  public isConnected(): boolean {
    return this.client?.status === 'ready';
  }

  private setupEventListeners(): void {
    // Main client events
    if (this.client) {
      this.client.on('connect', () => {
        logger.info('Redis client connected');
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
      });

      this.client.on('error', (error) => {
        logger.error('Redis client error:', error);
      });

      this.client.on('close', () => {
        logger.warn('Redis client connection closed');
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis client reconnecting...');
      });
    }

    // Subscriber events
    if (this.subscriber) {
      this.subscriber.on('error', (error) => {
        logger.error('Redis subscriber error:', error);
      });
    }

    // Publisher events
    if (this.publisher) {
      this.publisher.on('error', (error) => {
        logger.error('Redis publisher error:', error);
      });
    }

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
    });
  }

  private async setupDevelopmentCache(): Promise<void> {
    try {
      if (!this.client) return;

      logger.info('Setting up development cache...');

      // Set some basic cache keys for development
      await this.client.setex('dev:status', 3600, 'ready');
      await this.client.setex('dev:version', 3600, '1.0.0');

      logger.info('Development cache setup completed');
    } catch (error) {
      logger.error('Failed to setup development cache:', error);
    }
  }

  // Cache utility methods
  public async set(key: string, value: string | object, ttl?: number): Promise<void> {
    if (!this.client) throw new Error('Redis client not initialized');

    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    
    if (ttl) {
      await this.client.setex(key, ttl, serializedValue);
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  public async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error('Redis client not initialized');
    return await this.client.get(key);
  }

  public async getObject<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  public async del(key: string): Promise<number> {
    if (!this.client) throw new Error('Redis client not initialized');
    return await this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.client) throw new Error('Redis client not initialized');
    const result = await this.client.exists(key);
    return result === 1;
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.client) throw new Error('Redis client not initialized');
    const result = await this.client.expire(key, ttl);
    return result === 1;
  }

  // Vietnamese-specific cache methods
  public async cacheChart(chartId: string, chartData: object): Promise<void> {
    await this.set(`chart:${chartId}`, chartData, config.CHART_CACHE_TTL);
  }

  public async getCachedChart<T>(chartId: string): Promise<T | null> {
    return await this.getObject<T>(`chart:${chartId}`);
  }

  public async cacheAIResponse(queryHash: string, response: object): Promise<void> {
    await this.set(`ai:${queryHash}`, response, config.AI_RESPONSE_CACHE_TTL);
  }

  public async getCachedAIResponse<T>(queryHash: string): Promise<T | null> {
    return await this.getObject<T>(`ai:${queryHash}`);
  }

  public async cacheLunarCalendar(year: number, month: number, data: object): Promise<void> {
    await this.set(`lunar:${year}:${month}`, data, config.LUNAR_CALENDAR_CACHE_TTL);
  }

  public async getCachedLunarCalendar<T>(year: number, month: number): Promise<T | null> {
    return await this.getObject<T>(`lunar:${year}:${month}`);
  }

  // Session management
  public async setSession(sessionId: string, sessionData: object, ttl: number = 3600): Promise<void> {
    await this.set(`session:${sessionId}`, sessionData, ttl);
  }

  public async getSession<T>(sessionId: string): Promise<T | null> {
    return await this.getObject<T>(`session:${sessionId}`);
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  // Health check
  public async healthCheck(): Promise<{
    status: string;
    latency: number;
    memory: any;
    keyspace: any;
  }> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    const start = Date.now();
    await this.client.ping();
    const latency = Date.now() - start;

    const info = await this.client.info();
    const lines = info.split('\r\n');
    
    const memory = lines
      .filter(line => line.startsWith('used_memory_human'))
      .map(line => line.split(':')[1])[0];

    const keyspace = lines
      .filter(line => line.startsWith('db0'))
      .map(line => line.split(':')[1])[0];

    return {
      status: this.client.status,
      latency,
      memory,
      keyspace,
    };
  }
}

// Export singleton instance
export const redis = RedisManager.getInstance();

export default redis;