// Test setup for Ha Linh Vietnamese Astrology Backend
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Redis from 'ioredis';

// Load test environment variables
config({ path: '.env.test' });

// Set Vietnamese timezone for tests
process.env.TZ = 'Asia/Ho_Chi_Minh';

// Mock Vietnamese external services
jest.mock('../src/services/vietnamese/momoService', () => ({
  verifyWebhook: jest.fn(),
  createPayment: jest.fn(),
  checkTransactionStatus: jest.fn()
}));

jest.mock('../src/services/vietnamese/vnpayService', () => ({
  verifyWebhook: jest.fn(),
  createPayment: jest.fn(),
  checkTransactionStatus: jest.fn()
}));

jest.mock('../src/services/vietnamese/zalopayService', () => ({
  verifyWebhook: jest.fn(),
  createPayment: jest.fn(),
  checkTransactionStatus: jest.fn()
}));

jest.mock('../src/services/vietnamese/smsService', () => ({
  sendOTP: jest.fn(),
  verifyOTP: jest.fn()
}));

jest.mock('../src/services/openai/chatService', () => ({
  generateAstrologyResponse: jest.fn(),
  analyzeChart: jest.fn()
}));

// Mock Vietnamese lunar calendar service
jest.mock('../src/services/vietnamese/lunarCalendarService', () => ({
  solarToLunar: jest.fn(),
  lunarToSolar: jest.fn(),
  getTraditionalHour: jest.fn(),
  calculateCanChi: jest.fn()
}));

// Global test utilities
global.testDb = null;
global.testRedis = null;

// Vietnamese test data generators
global.generateVietnameseUser = () => ({
  name: 'Nguyễn Văn Test',
  email: 'test@example.com',
  phone: '+84901234567',
  preferences: {
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  }
});

global.generateVietnameseBirthData = () => ({
  name: 'Trần Thị Hạnh',
  gender: 'nữ',
  solarDate: new Date('1990-03-15'),
  timeOfBirth: {
    hour: 14,
    minute: 30,
    traditionalHour: 'mùi'
  },
  placeOfBirth: {
    province: 'Hà Nội',
    district: 'Ba Đình',
    coordinates: {
      latitude: 21.0285,
      longitude: 105.8542
    }
  }
});

global.generateVietnameseChart = () => ({
  userId: 'test-user-id',
  birthData: global.generateVietnameseBirthData(),
  chartData: {
    houses: Array.from({ length: 12 }, (_, i) => ({
      index: i + 1,
      name: `Cung ${i + 1}`,
      mainStars: [],
      supportStars: [],
      element: 'kim'
    })),
    lunarDate: {
      year: 1990,
      month: 2,
      day: 18,
      isLeapMonth: false
    }
  },
  createdAt: new Date()
});

// Console suppression for cleaner test output
const originalConsole = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
    return;
  }
  originalConsole.apply(console, args);
};

beforeAll(async () => {
  // Increase timeout for Vietnamese external service tests
  jest.setTimeout(30000);
});

afterAll(() => {
  // Restore console
  console.error = originalConsole;
});