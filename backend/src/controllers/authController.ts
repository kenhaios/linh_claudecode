// Authentication controller for Ha Linh Vietnamese Astrology Platform
import { Request, Response, NextFunction } from 'express';
import { User, IUserDocument } from '../models/User';
import { JwtService } from '../services/auth/jwtService';
import { createVietnameseError } from '../middleware/errorHandler';
import { vietnameseLogger } from '../utils/logger';
import { generateTokens } from '../middleware/auth';
import crypto from 'crypto';
import { SendEmailService } from '../services/vietnamese/emailService';
import { SendSMSService } from '../services/vietnamese/smsService';

// Interface for registration request
interface IRegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  preferences?: {
    language?: 'vi' | 'en';
    timezone?: string;
    theme?: 'light' | 'dark' | 'vietnamese-traditional';
  };
  location?: {
    province?: string;
    district?: string;
    ward?: string;
  };
}

// Interface for login request
interface ILoginRequest {
  identifier: string; // Can be email or phone
  password: string;
  rememberMe?: boolean;
}

/**
 * Register new Vietnamese user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      dateOfBirth,
      preferences,
      location
    }: IRegisterRequest = req.body;

    // Validate required fields
    if (!name || !password) {
      throw createVietnameseError.badRequest('Họ tên và mật khẩu là bắt buộc');
    }

    // Validate that either email or phone is provided
    if (!email && !phone) {
      throw createVietnameseError.badRequest('Phải cung cấp ít nhất một trong hai: email hoặc số điện thoại');
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw createVietnameseError.badRequest('Mật khẩu xác nhận không khớp');
    }

    // Validate Vietnamese phone format if provided
    if (phone && !/^(\+84|0)[3-9]\d{8}$/.test(phone)) {
      throw createVietnameseError.badRequest('Số điện thoại Việt Nam không hợp lệ');
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createVietnameseError.badRequest('Email không hợp lệ');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        email ? { email: email.toLowerCase() } : {},
        phone ? { phone } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    });

    if (existingUser) {
      if (existingUser.email === email?.toLowerCase()) {
        throw createVietnameseError.conflict('Email đã được sử dụng');
      }
      if (existingUser.phone === phone) {
        throw createVietnameseError.conflict('Số điện thoại đã được sử dụng');
      }
    }

    // Create new user with Vietnamese preferences
    const userData: Partial<IUserDocument> = {
      name: name.trim(),
      email: email?.toLowerCase(),
      phone,
      password,
      preferences: {
        language: preferences?.language || 'vi',
        timezone: preferences?.timezone || 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        theme: preferences?.theme || 'vietnamese-traditional'
      }
    };

    // Add date of birth if provided
    if (dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth);
    }

    // Add location if provided
    if (location) {
      userData.location = location;
    }

    const user = new User(userData);
    await user.save();

    // Generate email verification token if email provided
    if (email) {
      const emailToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = emailToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Send verification email (Vietnamese)
      try {
        await SendEmailService.sendVerificationEmail(user, emailToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email sending fails
      }
    }

    // Generate phone verification token if phone provided
    if (phone) {
      const phoneToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      user.phoneVerificationToken = phoneToken;
      user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send verification SMS (Vietnamese)
      try {
        await SendSMSService.sendVerificationSMS(phone, phoneToken);
      } catch (smsError) {
        console.error('Failed to send verification SMS:', smsError);
        // Don't fail registration if SMS sending fails
      }
    }

    // Generate JWT tokens
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      location: 'Vietnam' // Can be enhanced with IP geolocation
    };

    const tokens = await generateTokens(user, deviceInfo);

    // Log successful registration
    vietnameseLogger.authSuccess(user._id.toString(), 'registration', req.ip);

    // Prepare response data
    const responseData = {
      user: user.toJSON(),
      tokens,
      verificationRequired: {
        email: !!email && !user.isEmailVerified,
        phone: !!phone && !user.isPhoneVerified
      }
    };

    res.status(201).json({
      success: true,
      data: responseData,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email/SMS để xác thực tài khoản.'
    });

  } catch (error) {
    // Log failed registration
    const identifier = req.body?.email || req.body?.phone || 'unknown';
    vietnameseLogger.authFailure(identifier, 'registration', (error as Error).message, req.ip);
    
    next(error);
  }
};

/**
 * Login Vietnamese user
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier, password, rememberMe }: ILoginRequest = req.body;

    // Validate required fields
    if (!identifier || !password) {
      throw createVietnameseError.badRequest('Email/SĐT và mật khẩu là bắt buộc');
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const isPhone = /^(\+84|0)[3-9]\d{8}$/.test(identifier);

    if (!isEmail && !isPhone) {
      throw createVietnameseError.badRequest('Email hoặc số điện thoại không hợp lệ');
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        isEmail ? { email: identifier.toLowerCase() } : {},
        isPhone ? { phone: identifier } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      throw createVietnameseError.unauthorized('Email/SĐT hoặc mật khẩu không đúng');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw createVietnameseError.unauthorized('Tài khoản tạm thời bị khóa do quá nhiều lần đăng nhập sai');
    }

    // Check if account is active
    if (!user.isActive) {
      throw createVietnameseError.unauthorized('Tài khoản đã bị vô hiệu hóa');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      throw createVietnameseError.unauthorized('Email/SĐT hoặc mật khẩu không đúng');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate JWT tokens
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      location: 'Vietnam', // Can be enhanced with IP geolocation
      rememberMe: !!rememberMe
    };

    const tokens = await generateTokens(user, deviceInfo);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log successful login
    vietnameseLogger.authSuccess(user._id.toString(), 'login', req.ip);

    // Check verification status
    const verificationStatus = {
      email: {
        required: !!user.email,
        verified: user.isEmailVerified
      },
      phone: {
        required: !!user.phone,
        verified: user.isPhoneVerified
      }
    };

    // Prepare response data
    const responseData = {
      user: user.toJSON(),
      tokens,
      verificationStatus,
      welcomeMessage: `Chào mừng ${user.name} quay trở lại!`
    };

    res.json({
      success: true,
      data: responseData,
      message: 'Đăng nhập thành công!'
    });

  } catch (error) {
    // Log failed login
    vietnameseLogger.authFailure(req.body?.identifier || 'unknown', 'login', (error as Error).message, req.ip);
    
    next(error);
  }
};

/**
 * Logout Vietnamese user
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      throw createVietnameseError.unauthorized('Chưa đăng nhập');
    }

    // Get refresh token from request
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    
    if (refreshToken) {
      try {
        // Revoke specific refresh token
        const decoded = await JwtService.verifyRefreshToken(refreshToken);
        await JwtService.revokeRefreshToken(user._id.toString(), decoded.tokenVersion);
      } catch (error) {
        // Token might be already invalid, continue with logout
      }
    }

    // Log successful logout
    vietnameseLogger.authSuccess(user._id.toString(), 'logout', req.ip);

    res.json({
      success: true,
      message: 'Đăng xuất thành công!'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createVietnameseError.badRequest('Refresh token là bắt buộc');
    }

    // Refresh access token using JWT service
    const tokenData = await JwtService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: tokenData,
      message: 'Token được làm mới thành công'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      throw createVietnameseError.unauthorized('Chưa đăng nhập');
    }

    // Get user sessions
    const sessions = await JwtService.getUserSessions(user._id.toString());

    const responseData = {
      user: user.toJSON(),
      sessions,
      vietnameseContext: req.vietnameseContext
    };

    res.json({
      success: true,
      data: responseData,
      message: 'Lấy thông tin hồ sơ thành công'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      throw createVietnameseError.unauthorized('Chưa đăng nhập');
    }

    const allowedUpdates = ['name', 'dateOfBirth', 'preferences', 'location', 'avatar'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw createVietnameseError.badRequest('Cập nhật không hợp lệ');
    }

    // Apply updates
    updates.forEach(update => {
      if (req.body[update] !== undefined) {
        user[update] = req.body[update];
      }
    });

    await user.save();

    res.json({
      success: true,
      data: { user: user.toJSON() },
      message: 'Cập nhật hồ sơ thành công'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      throw createVietnameseError.unauthorized('Chưa đăng nhập');
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw createVietnameseError.badRequest('Tất cả các trường mật khẩu là bắt buộc');
    }

    if (newPassword !== confirmNewPassword) {
      throw createVietnameseError.badRequest('Mật khẩu mới không khớp');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      throw createVietnameseError.unauthorized('Mật khẩu hiện tại không đúng');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens to force re-login on all devices
    await JwtService.revokeRefreshToken(user._id.toString());

    // Log password change
    vietnameseLogger.authSuccess(user._id.toString(), 'password_change', req.ip);

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại trên tất cả thiết bị.'
    });

  } catch (error) {
    next(error);
  }
};