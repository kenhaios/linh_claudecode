// JWT Service for Ha Linh Vietnamese Astrology Platform
import jwt from 'jsonwebtoken';
import { config } from '../../config/environment';
import { IUserDocument } from '../../models/User';
import { redis } from '../../config/redis';

export interface IJwtPayload {
  userId: string;
  email?: string;
  phone?: string;
  language: string;
  timezone: string;
  tokenVersion: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: Date;
  refreshTokenExpires: Date;
}

export class JwtService {
  private static readonly ACCESS_TOKEN_EXPIRES = '15m'; // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRES = '7d'; // 7 days
  private static readonly REDIS_KEY_PREFIX = 'halinh:token:';
  
  /**
   * Generate access and refresh token pair for Vietnamese user
   */
  static async generateTokenPair(user: IUserDocument, deviceInfo?: any): Promise<ITokenPair> {
    const now = new Date();
    const tokenVersion = Date.now(); // Simple token versioning
    
    // Create JWT payload with Vietnamese context
    const payload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      language: user.preferences.language,
      timezone: user.preferences.timezone,
      tokenVersion
    };
    
    // Generate access token (short-lived)
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES,
      issuer: 'halinh-astrology',
      audience: 'halinh-users',
      subject: user._id.toString()
    });
    
    // Generate refresh token (long-lived)
    const refreshTokenPayload = {
      ...payload,
      type: 'refresh',
      deviceInfo: deviceInfo || {}
    };
    
    const refreshToken = jwt.sign(refreshTokenPayload, config.jwt.refreshSecret, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES,
      issuer: 'halinh-astrology',
      audience: 'halinh-users',
      subject: user._id.toString()
    });
    
    // Calculate expiration times
    const accessTokenExpires = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Store refresh token in Redis for Vietnamese session management
    const redisKey = `${this.REDIS_KEY_PREFIX}${user._id}:${tokenVersion}`;
    await redis.setex(redisKey, 7 * 24 * 60 * 60, JSON.stringify({
      refreshToken,
      deviceInfo: deviceInfo || {},
      createdAt: now.toISOString(),
      userId: user._id.toString(),
      language: user.preferences.language,
      timezone: user.preferences.timezone
    }));
    
    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires
    };
  }
  
  /**
   * Verify access token with Vietnamese context
   */
  static async verifyAccessToken(token: string): Promise<IJwtPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret, {
        issuer: 'halinh-astrology',
        audience: 'halinh-users'
      }) as IJwtPayload;
      
      // Ensure Vietnamese timezone context
      if (!decoded.timezone) {
        decoded.timezone = 'Asia/Ho_Chi_Minh';
      }
      
      if (!decoded.language) {
        decoded.language = 'vi';
      }
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token đã hết hạn');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token không hợp lệ');
      } else {
        throw new Error('Lỗi xác thực token');
      }
    }
  }
  
  /**
   * Verify refresh token with Vietnamese context
   */
  static async verifyRefreshToken(token: string): Promise<IJwtPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret, {
        issuer: 'halinh-astrology',
        audience: 'halinh-users'
      }) as IJwtPayload & { type: string };
      
      if (decoded.type !== 'refresh') {
        throw new Error('Token không phải là refresh token');
      }
      
      // Check if token exists in Redis (Vietnamese session store)
      const redisKey = `${this.REDIS_KEY_PREFIX}${decoded.userId}:${decoded.tokenVersion}`;
      const storedToken = await redis.get(redisKey);
      
      if (!storedToken) {
        throw new Error('Refresh token đã bị thu hồi');
      }
      
      const tokenData = JSON.parse(storedToken);
      if (tokenData.refreshToken !== token) {
        throw new Error('Refresh token không khớp');
      }
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token đã hết hạn');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Refresh token không hợp lệ');
      } else {
        throw error;
      }
    }
  }
  
  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; accessTokenExpires: Date }> {
    try {
      const decoded = await this.verifyRefreshToken(refreshToken);
      
      // Generate new access token with Vietnamese context
      const accessToken = jwt.sign({
        userId: decoded.userId,
        email: decoded.email,
        phone: decoded.phone,
        language: decoded.language,
        timezone: decoded.timezone,
        tokenVersion: decoded.tokenVersion
      }, config.jwt.secret, {
        expiresIn: this.ACCESS_TOKEN_EXPIRES,
        issuer: 'halinh-astrology',
        audience: 'halinh-users',
        subject: decoded.userId
      });
      
      const accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      return {
        accessToken,
        accessTokenExpires
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Revoke refresh token (Vietnamese logout)
   */
  static async revokeRefreshToken(userId: string, tokenVersion?: number): Promise<void> {
    try {
      if (tokenVersion) {
        // Revoke specific token
        const redisKey = `${this.REDIS_KEY_PREFIX}${userId}:${tokenVersion}`;
        await redis.del(redisKey);
      } else {
        // Revoke all tokens for user (Vietnamese global logout)
        const pattern = `${this.REDIS_KEY_PREFIX}${userId}:*`;
        const keys = await redis.keys(pattern);
        
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } catch (error) {
      throw new Error('Lỗi thu hồi token');
    }
  }
  
  /**
   * Get all active sessions for Vietnamese user
   */
  static async getUserSessions(userId: string): Promise<Array<{
    tokenVersion: number;
    createdAt: string;
    deviceInfo: any;
    language: string;
    timezone: string;
  }>> {
    try {
      const pattern = `${this.REDIS_KEY_PREFIX}${userId}:*`;
      const keys = await redis.keys(pattern);
      
      if (keys.length === 0) {
        return [];
      }
      
      const sessions = await redis.mget(keys);
      const result = [];
      
      for (let i = 0; i < keys.length; i++) {
        if (sessions[i]) {
          try {
            const sessionData = JSON.parse(sessions[i]);
            const tokenVersion = parseInt(keys[i].split(':').pop() || '0');
            
            result.push({
              tokenVersion,
              createdAt: sessionData.createdAt,
              deviceInfo: sessionData.deviceInfo,
              language: sessionData.language,
              timezone: sessionData.timezone
            });
          } catch (parseError) {
            // Skip invalid session data
            continue;
          }
        }
      }
      
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw new Error('Lỗi lấy danh sách phiên đăng nhập');
    }
  }
  
  /**
   * Clean expired tokens (Vietnamese maintenance task)
   */
  static async cleanExpiredTokens(): Promise<number> {
    try {
      const pattern = `${this.REDIS_KEY_PREFIX}*`;
      const keys = await redis.keys(pattern);
      let cleaned = 0;
      
      for (const key of keys) {
        const ttl = await redis.ttl(key);
        if (ttl === -1) {
          // Key exists but has no expiration, set it to expire
          await redis.expire(key, 7 * 24 * 60 * 60); // 7 days
        } else if (ttl === -2) {
          // Key doesn't exist, already cleaned
          cleaned++;
        }
      }
      
      return cleaned;
    } catch (error) {
      throw new Error('Lỗi dọn dẹp token hết hạn');
    }
  }
  
  /**
   * Validate Vietnamese token format and claims
   */
  static validateVietnameseTokenClaims(payload: IJwtPayload): boolean {
    // Validate required Vietnamese context
    if (!payload.userId || !payload.language || !payload.timezone) {
      return false;
    }
    
    // Validate Vietnamese language
    if (!['vi', 'en'].includes(payload.language)) {
      return false;
    }
    
    // Validate Vietnamese timezone
    if (payload.timezone !== 'Asia/Ho_Chi_Minh') {
      return false;
    }
    
    // Validate Vietnamese phone format if present
    if (payload.phone && !/^(\+84|0)[3-9]\d{8}$/.test(payload.phone)) {
      return false;
    }
    
    return true;
  }
}