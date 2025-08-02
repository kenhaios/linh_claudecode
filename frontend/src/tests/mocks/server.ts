// MSW server setup for Vietnamese astrology API mocking
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const apiUrl = 'http://localhost:3001/api';

export const handlers = [
  // Authentication endpoints
  rest.post(`${apiUrl}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          user: global.mockVietnameseUser,
          token: 'mock-jwt-token'
        }
      })
    );
  }),

  rest.post(`${apiUrl}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: global.mockVietnameseUser,
          token: 'mock-jwt-token'
        }
      })
    );
  }),

  // User profile endpoints
  rest.get(`${apiUrl}/user/profile`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          error: 'Unauthorized - Không có quyền truy cập'
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: global.mockVietnameseUser
        }
      })
    );
  }),

  // Astrology chart endpoints
  rest.post(`${apiUrl}/charts/generate`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          chart: global.mockVietnameseChart
        }
      })
    );
  }),

  rest.get(`${apiUrl}/charts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          charts: [global.mockVietnameseChart],
          total: 1,
          page: 1,
          totalPages: 1
        }
      })
    );
  }),

  rest.get(`${apiUrl}/charts/:chartId`, (req, res, ctx) => {
    const { chartId } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          chart: { ...global.mockVietnameseChart, id: chartId }
        }
      })
    );
  }),

  // AI consultation endpoints
  rest.post(`${apiUrl}/consultations/ask`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          consultation: global.mockVietnameseConsultation
        }
      })
    );
  }),

  rest.get(`${apiUrl}/consultations`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          consultations: [global.mockVietnameseConsultation],
          total: 1,
          page: 1,
          totalPages: 1
        }
      })
    );
  }),

  // Token management endpoints
  rest.get(`${apiUrl}/tokens/balance`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          balance: 100,
          lastUpdated: new Date().toISOString()
        }
      })
    );
  }),

  rest.post(`${apiUrl}/tokens/purchase`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          paymentUrl: 'https://payment.example.com/mock-payment',
          transactionId: 'mock-transaction-id'
        }
      })
    );
  }),

  // Vietnamese payment provider endpoints
  rest.post(`${apiUrl}/payments/momo/create`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          payUrl: 'https://test-payment.momo.vn/mock',
          orderId: 'MOMO_TEST_ORDER_123'
        }
      })
    );
  }),

  rest.post(`${apiUrl}/payments/vnpay/create`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          paymentUrl: 'https://sandbox.vnpayment.vn/mock',
          transactionId: 'VNPAY_TEST_TXN_123'
        }
      })
    );
  }),

  // Vietnamese provinces API
  rest.get('https://provinces.open-api.vn/api/p', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { code: 1, name: 'Hà Nội' },
        { code: 79, name: 'Thành phố Hồ Chí Minh' },
        { code: 48, name: 'Đà Nẵng' },
        { code: 92, name: 'Cần Thơ' }
      ])
    );
  }),

  rest.get('https://provinces.open-api.vn/api/p/:provinceCode', (req, res, ctx) => {
    const { provinceCode } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        code: provinceCode,
        name: 'Hà Nội',
        districts: [
          { code: 1, name: 'Ba Đình' },
          { code: 2, name: 'Hoàn Kiếm' },
          { code: 3, name: 'Hai Bà Trưng' }
        ]
      })
    );
  }),

  // Error responses
  rest.get(`${apiUrl}/error-test`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: 'Lỗi máy chủ nội bộ'
      })
    );
  })
];

export const server = setupServer(...handlers);