// Unit tests for authentication with Vietnamese features
import request from 'supertest';
import { app } from '../../src/app';
import { UserModel } from '../../src/models/User';
import jwt from 'jsonwebtoken';

describe('Vietnamese Authentication System', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register user with Vietnamese phone number', async () => {
      const userData = {
        name: 'Nguyễn Văn Test',
        email: 'test@example.com',
        phone: '+84901234567',
        password: 'StrongPass123!',
        preferences: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('Nguyễn Văn Test');
      expect(response.body.data.user.preferences.language).toBe('vi');
      expect(response.body.data.token).toBeDefined();
    });

    it('should validate Vietnamese phone number format', async () => {
      const userData = {
        name: 'Test User',
        phone: '123456789', // Invalid Vietnamese format
        password: 'StrongPass123!',
        preferences: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('phone');
    });

    it('should handle Vietnamese characters in name', async () => {
      const userData = {
        name: 'Trần Thị Hương Giang',
        email: 'huonggiang@example.com',
        password: 'StrongPass123!',
        preferences: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data.user.name).toBe('Trần Thị Hương Giang');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      const user = new UserModel({
        name: 'Lê Văn Test',
        email: 'levan@example.com',
        phone: '+84987654321',
        password: 'hashedpassword',
        preferences: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }
      });
      await user.save();
    });

    it('should login with Vietnamese phone number', async () => {
      const loginData = {
        identifier: '+84987654321',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.phone).toBe('+84987654321');
      expect(response.body.data.token).toBeDefined();
    });

    it('should login with email', async () => {
      const loginData = {
        identifier: 'levan@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('levan@example.com');
    });
  });

  describe('JWT Token Management', () => {
    it('should generate token with Vietnamese timezone', async () => {
      const payload = {
        userId: 'test-id',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi'
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1h'
      });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.timezone).toBe('Asia/Ho_Chi_Minh');
      expect(decoded.language).toBe('vi');
    });
  });

  describe('Middleware Protection', () => {
    it('should protect routes requiring authentication', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('authentication');
    });

    it('should allow access with valid token', async () => {
      const user = new UserModel({
        name: 'Protected Test',
        email: 'protected@example.com',
        preferences: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }
      });
      await user.save();

      const token = jwt.sign(
        { userId: user._id, language: 'vi' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('Protected Test');
    });
  });
});