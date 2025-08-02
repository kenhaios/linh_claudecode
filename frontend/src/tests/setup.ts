// Test setup for Ha Linh Vietnamese Astrology Frontend
import '@testing-library/jest-dom';
import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Set Vietnamese timezone
process.env.TZ = 'Asia/Ho_Chi_Minh';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for Ant Design components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Ant Design charts
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Socket.io client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: true
  }))
}));

// Mock Vietnamese date/time libraries
vi.mock('moment', () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => '15/03/2023'),
    locale: vi.fn(),
    tz: vi.fn(() => ({
      format: vi.fn(() => '15/03/2023 14:30')
    }))
  })),
  tz: {
    setDefault: vi.fn()
  }
}));

// Mock canvas for chart rendering
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
});

// Vietnamese test data generators
global.mockVietnameseUser = {
  id: 'test-user-id',
  name: 'Nguyễn Văn Test',
  email: 'test@example.com',
  phone: '+84901234567',
  preferences: {
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  },
  tokenBalance: 100,
  createdAt: new Date().toISOString()
};

global.mockVietnameseChart = {
  id: 'test-chart-id',
  userId: 'test-user-id',
  birthData: {
    name: 'Trần Thị Hạnh',
    gender: 'nữ',
    solarDate: new Date('1990-03-15').toISOString(),
    timeOfBirth: {
      hour: 14,
      minute: 30,
      traditionalHour: 'mùi'
    },
    placeOfBirth: {
      province: 'Hà Nội',
      district: 'Ba Đình'
    }
  },
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
  createdAt: new Date().toISOString()
};

global.mockVietnameseConsultation = {
  id: 'test-consultation-id',
  userId: 'test-user-id',
  sessionId: 'test-session-id',
  question: 'Xin hỏi về tình duyên của tôi?',
  aiResponse: 'Dựa vào lá số tử vi của bạn, tình duyên năm nay sẽ có nhiều khởi sắc...',
  category: 'love',
  status: 'completed',
  tokensCost: 10,
  timestamp: new Date().toISOString()
};

// Start MSW server for API mocking
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});