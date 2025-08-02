import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { createVietnameseError, AppError } from './errorHandler';
import { logger, vietnameseLogger } from '../utils/logger';
import { JwtService, IJwtPayload } from '../services/auth/jwtService';
import { User, IUserDocument } from '../models/User';

// Extend Request interface to include user and Vietnamese context
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      vietnameseContext?: {
        language: string;
        timezone: string;
        isVietnameseUser: boolean;
      };
    }
  }
}

// JWT payload interface
interface JWTPayload {
  id: string;
  email?: string;
  phone?: string;
  tokenVersion: number;
  role?: string;
  iat: number;
  exp: number;
}

// Token pair interface
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Generate JWT tokens using Vietnamese JWT service
export const generateTokens = async (user: IUserDocument, deviceInfo?: any): Promise<{
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: Date;
  refreshTokenExpires: Date;
}> => {
  return await JwtService.generateTokenPair(user, deviceInfo);
};

// Verify JWT token
export const verifyToken = (token: string, secret: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'halinh-tuvi',
      audience: 'halinh-users',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createVietnameseError.unauthorized('Token đã hết hạn');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createVietnameseError.unauthorized('Token không hợp lệ');
    } else {
      throw createVietnameseError.unauthorized('Lỗi xác thực token');
    }
  }
};

// Extract token from request
const extractToken = (req: Request): string | null => {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies (for web browsers)
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  // Check query parameter (for WebSocket connections)
  if (req.query && req.query.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return null;
};

// Main authentication middleware for Vietnamese users
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw createVietnameseError.unauthorized('Vui lòng đăng nhập để tiếp tục');
    }

    // Verify token using JWT service
    let payload: IJwtPayload;
    try {
      payload = await JwtService.verifyAccessToken(token);
    } catch (error) {
      throw createVietnameseError.unauthorized(error.message || 'Token không hợp lệ');
    }

    // Validate Vietnamese token claims
    if (!JwtService.validateVietnameseTokenClaims(payload)) {
      throw createVietnameseError.unauthorized('Token thiếu thông tin người dùng Việt Nam');
    }

    // Find user in database
    const user = await User.findById(payload.userId);
    
    if (!user) {
      throw createVietnameseError.unauthorized('Người dùng không tồn tại');
    }

    // Check if user account is active
    if (!user.isActive) {
      throw createVietnameseError.unauthorized('Tài khoản đã bị khóa');
    }

    // Check if user account is locked
    if (user.isLocked) {
      throw createVietnameseError.unauthorized('Tài khoản tạm thời bị khóa do quá nhiều lần đăng nhập sai');
    }

    // Add user and Vietnamese context to request
    req.user = user;
    req.vietnameseContext = {
      language: payload.language,
      timezone: payload.timezone,
      isVietnameseUser: payload.timezone === 'Asia/Ho_Chi_Minh'
    };

    // Update last activity (Vietnamese timezone)
    user.lastLogin = new Date();
    await user.save();

    // Log successful authentication
    vietnameseLogger.authSuccess(user._id.toString(), 'jwt', req.ip);

    next();
  } catch (error) {
    // Log failed authentication
    const identifier = req.body?.email || req.body?.phone || 'unknown';
    vietnameseLogger.authFailure(identifier, 'jwt', (error as Error).message, req.ip);
    
    next(error);
  }
};

// Optional authentication (doesn't throw error if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyToken(token, config.JWT_SECRET);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        phone: decoded.phone,
        tokenVersion: decoded.tokenVersion,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // For optional auth, we continue even if token is invalid
    next();
  }
};

// Authorization middleware (check roles)
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw createVietnameseError.unauthorized('Vui lòng đăng nhập để tiếp tục');
    }

    if (!roles.includes(req.user.role || 'user')) {
      throw createVietnameseError.forbidden('Bạn không có quyền thực hiện thao tác này');
    }

    next();
  };
};

// Check if user owns resource
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw createVietnameseError.unauthorized('Vui lòng đăng nhập để tiếp tục');
    }

    // Get resource user ID from request params, body, or resource object
    let resourceUserId: string | undefined;

    if (req.params[resourceUserIdField]) {
      resourceUserId = req.params[resourceUserIdField];
    } else if (req.body[resourceUserIdField]) {
      resourceUserId = req.body[resourceUserIdField];
    } else if (res.locals.resource && res.locals.resource[resourceUserIdField]) {
      resourceUserId = res.locals.resource[resourceUserIdField];
    }

    if (!resourceUserId) {
      throw createVietnameseError.badRequest('Không thể xác định quyền sở hữu tài nguyên');
    }

    // Admin can access all resources
    if (req.user.role === 'admin') {
      return next();
    }

    // Check ownership
    if (req.user.id !== resourceUserId) {
      throw createVietnameseError.forbidden('Bạn chỉ có thể truy cập tài nguyên của mình');
    }

    next();
  };
};

// Refresh token middleware
export const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      throw createVietnameseError.unauthorized('Refresh token không được cung cấp');
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, config.JWT_REFRESH_SECRET);

    // TODO: Check if user exists and token version matches
    
    // Generate new token pair
    const tokens = generateTokens({
      id: decoded.id,
      tokenVersion: decoded.tokenVersion,
    });

    res.json({
      success: true,
      data: tokens,
      message: 'Token được làm mới thành công',
    });
  } catch (error) {
    next(error);
  }
};

// Logout middleware
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // TODO: Add token to blacklist if using a blacklist strategy
    // TODO: Increment user's token version to invalidate all tokens

    logger.info('User logged out', {
      userId: req.user?.id,
      ip: req.ip,
    });

    res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    next(error);
  }
};

// Rate limiting for authentication attempts
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = req.body?.email || req.body?.phone || req.ip;
    const now = Date.now();

    const userAttempts = attempts.get(identifier);

    if (userAttempts) {
      if (now > userAttempts.resetTime) {
        // Reset the attempts
        attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      } else if (userAttempts.count >= maxAttempts) {
        throw createVietnameseError.unauthorized(
          `Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${Math.ceil((userAttempts.resetTime - now) / 60000)} phút`
        );
      } else {
        userAttempts.count++;
      }
    } else {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
    }

    next();
  };
};

// Socket.io authentication helper
export const authenticateSocket = (token: string): JWTPayload => {
  return verifyToken(token, config.JWT_SECRET);
};

// Vietnamese phone number validation
export const validateVietnamesePhone = (phone: string): boolean => {
  // Vietnamese phone number pattern: +84 or 0 followed by 9 digits
  const phoneRegex = /^(\+84|0)[3-9]\d{8}$/;
  return phoneRegex.test(phone);
};

// Vietnamese email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default authenticate;