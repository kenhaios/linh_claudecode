// Global test teardown for Ha Linh Vietnamese Astrology Backend
export default async function globalTeardown() {
  // Stop MongoDB
  const mongod = (global as any).__MONGOD__;
  if (mongod) {
    await mongod.stop();
    console.log('🛑 MongoDB test server stopped');
  }
  
  // Stop Redis
  const redis = (global as any).__REDIS__;
  if (redis && redis.disconnect) {
    await redis.disconnect();
    console.log('🛑 Redis test connection closed');
  }
  
  console.log('✅ Vietnamese astrology test environment cleaned up');
}