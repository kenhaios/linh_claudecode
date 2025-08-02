// Global test setup for Ha Linh Vietnamese Astrology Backend
import { MongoMemoryServer } from 'mongodb-memory-server';
import Redis from 'ioredis';

export default async function globalSetup() {
  // Set Vietnamese timezone
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  
  // Start in-memory MongoDB for tests
  const mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'ha-linh-test',
      port: 27018
    }
  });
  
  const mongoUri = mongod.getUri();
  process.env.MONGODB_URI = mongoUri;
  
  // Store mongod instance for teardown
  (global as any).__MONGOD__ = mongod;
  
  // Start Redis for cache testing (use different port)
  const redis = new Redis({
    host: 'localhost',
    port: 6380,
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });
  
  try {
    await redis.connect();
    process.env.REDIS_URL = 'redis://localhost:6380';
    (global as any).__REDIS__ = redis;
  } catch (error) {
    console.warn('Redis not available for tests, using mock');
    process.env.REDIS_URL = 'redis://mock';
  }
  
  console.log('🚀 Vietnamese astrology test environment initialized');
}