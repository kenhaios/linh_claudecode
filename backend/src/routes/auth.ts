// Authentication routes for Ha Linh Vietnamese Astrology Platform
import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController';
import { authenticate, optionalAuth, authRateLimit } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param } from 'express-validator';
import { User } from '../models/User';
import { SendEmailService } from '../services/vietnamese/emailService';
import { SendSMSService } from '../services/vietnamese/smsService';
import crypto from 'crypto';

const router = Router();

// Validation rules for Vietnamese users
const vietnamesePhoneValidation = body('phone')
  .optional()
  .matches(/^(\+84|0)[3-9]\d{8}$/)
  .withMessage('Số điện thoại Việt Nam không hợp lệ (VD: +84901234567 hoặc 0901234567)');

const vietnameseNameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Họ và tên phải từ 2-50 ký tự')
  .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂẮẰẴẶẨẪẦẤẨẮẰẴẶẺẼỀẾỂỄỆỈỊỌỎỒỐỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỷỹ\s]+$/)
  .withMessage('Họ và tên chỉ được chứa chữ cái và khoảng trắng (hỗ trợ tiếng Việt)');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số');

const emailValidation = body('email')
  .optional()
  .isEmail()
  .normalizeEmail()
  .withMessage('Email không hợp lệ');

// Custom validation to ensure either email or phone is provided
const emailOrPhoneValidation = body().custom((value, { req }) => {
  if (!req.body.email && !req.body.phone) {
    throw new Error('Phải cung cấp ít nhất một trong hai: email hoặc số điện thoại');
  }
  return true;
});

/**
 * @route   POST /api/auth/register
 * @desc    Register new Vietnamese user
 * @access  Public
 */
router.post(
  '/register',
  authRateLimit(3, 15 * 60 * 1000), // 3 attempts per 15 minutes
  [
    vietnameseNameValidation,
    emailValidation,
    vietnamesePhoneValidation,
    passwordValidation,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        return true;
      }),
    emailOrPhoneValidation,
    body('preferences.language')
      .optional()
      .isIn(['vi', 'en'])
      .withMessage('Ngôn ngữ phải là "vi" hoặc "en"'),
    body('preferences.timezone')
      .optional()
      .equals('Asia/Ho_Chi_Minh')
      .withMessage('Múi giờ phải là Asia/Ho_Chi_Minh'),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Ngày sinh không hợp lệ')
      .custom((value) => {
        if (value) {
          const birthDate = new Date(value);
          const now = new Date();
          const age = now.getFullYear() - birthDate.getFullYear();
          if (age < 13 || age > 120) {
            throw new Error('Tuổi phải từ 13 đến 120');
          }
        }
        return true;
      }),
    body('location.province')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên tỉnh/thành phố không hợp lệ'),
    validateRequest
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login Vietnamese user
 * @access  Public
 */
router.post(
  '/login',
  authRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  [
    body('identifier')
      .notEmpty()
      .withMessage('Email hoặc số điện thoại là bắt buộc')
      .custom((value) => {
        const isEmail = value.includes('@');
        const isPhone = /^(\+84|0)[3-9]\d{8}$/.test(value);
        
        if (!isEmail && !isPhone) {
          throw new Error('Email hoặc số điện thoại không hợp lệ');
        }
        return true;
      }),
    body('password')
      .notEmpty()
      .withMessage('Mật khẩu là bắt buộc'),
    body('rememberMe')
      .optional()
      .isBoolean()
      .withMessage('Remember me phải là boolean'),
    validateRequest
  ],
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout Vietnamese user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  authRateLimit(20, 15 * 60 * 1000), // 20 attempts per 15 minutes
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token là bắt buộc'),
    validateRequest
  ],
  refreshToken
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Họ và tên phải từ 2-50 ký tự')
      .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂẮẰẴẶẨẪẦẤẨẮẰẴẶẺẼỀẾỂỄỆỈỊỌỎỒỐỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỷỹ\s]+$/)
      .withMessage('Họ và tên chỉ được chứa chữ cái và khoảng trắng (hỗ trợ tiếng Việt)'),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Ngày sinh không hợp lệ'),
    body('preferences.language')
      .optional()
      .isIn(['vi', 'en'])
      .withMessage('Ngôn ngữ phải là "vi" hoặc "en"'),
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark', 'vietnamese-traditional'])
      .withMessage('Theme không hợp lệ'),
    body('location.province')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên tỉnh/thành phố không hợp lệ'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar phải là URL hợp lệ'),
    validateRequest
  ],
  updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate,
  authRateLimit(3, 60 * 60 * 1000), // 3 attempts per hour
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Mật khẩu hiện tại là bắt buộc'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Mật khẩu mới phải có ít nhất 8 ký tự')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường và một số'),
    body('confirmNewPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Mật khẩu mới xác nhận không khớp');
        }
        return true;
      }),
    validateRequest
  ],
  changePassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email',
  [
    body('token')
      .notEmpty()
      .withMessage('Token xác thực là bắt buộc'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email không hợp lệ'),
    validateRequest
  ],
  async (req, res, next) => {
    try {
      const { token, email } = req.body;
      
      // Find user with matching email and token
      const user = await User.findOne({
        email: email.toLowerCase(),
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Token xác thực không hợp lệ hoặc đã hết hạn',
          errorCode: 'INVALID_VERIFICATION_TOKEN'
        });
      }

      // Verify email
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      
      // Give welcome bonus tokens
      user.tokenBalance += 10;
      
      await user.save();

      // Send welcome email
      try {
        await SendEmailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      res.json({
        success: true,
        message: 'Email đã được xác thực thành công! Bạn nhận được 10 token chào mừng.',
        data: {
          user: user.toJSON(),
          bonusTokens: 10
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/verify-phone
 * @desc    Verify phone number
 * @access  Public
 */
router.post(
  '/verify-phone',
  [
    body('token')
      .notEmpty()
      .withMessage('Mã OTP là bắt buộc')
      .isLength({ min: 6, max: 6 })
      .withMessage('Mã OTP phải có 6 chữ số'),
    body('phone')
      .matches(/^(\+84|0)[3-9]\d{8}$/)
      .withMessage('Số điện thoại Việt Nam không hợp lệ'),
    validateRequest
  ],
  async (req, res, next) => {
    try {
      const { token, phone } = req.body;
      
      // Find user with matching phone and token
      const user = await User.findOne({
        phone,
        phoneVerificationToken: token,
        phoneVerificationExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Mã OTP không hợp lệ hoặc đã hết hạn',
          errorCode: 'INVALID_PHONE_TOKEN'
        });
      }

      // Verify phone
      user.isPhoneVerified = true;
      user.phoneVerificationToken = undefined;
      user.phoneVerificationExpires = undefined;
      
      // Give welcome bonus tokens
      user.tokenBalance += 5;
      
      await user.save();

      // Send welcome SMS
      try {
        await SendSMSService.sendWelcomeSMS(user.phone, user.name);
      } catch (smsError) {
        console.error('Failed to send welcome SMS:', smsError);
      }

      res.json({
        success: true,
        message: 'Số điện thoại đã được xác thực thành công! Bạn nhận được 5 token chào mừng.',
        data: {
          user: user.toJSON(),
          bonusTokens: 5
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email/SMS
 * @access  Public
 */
router.post(
  '/resend-verification',
  authRateLimit(3, 10 * 60 * 1000), // 3 attempts per 10 minutes
  [
    body('identifier')
      .notEmpty()
      .withMessage('Email hoặc số điện thoại là bắt buộc'),
    body('type')
      .isIn(['email', 'phone'])
      .withMessage('Loại xác thực phải là "email" hoặc "phone"'),
    validateRequest
  ],
  async (req, res, next) => {
    try {
      const { identifier, type } = req.body;
      
      let user;
      if (type === 'email') {
        user = await User.findOne({ email: identifier.toLowerCase() });
      } else {
        user = await User.findOne({ phone: identifier });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Người dùng không tồn tại',
          errorCode: 'USER_NOT_FOUND'
        });
      }

      if (type === 'email') {
        if (user.isEmailVerified) {
          return res.status(400).json({
            success: false,
            error: 'Email đã được xác thực',
            errorCode: 'EMAIL_ALREADY_VERIFIED'
          });
        }

        // Generate new verification token
        const emailToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = emailToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        // Send verification email
        await SendEmailService.sendVerificationEmail(user, emailToken);
      } else {
        if (user.isPhoneVerified) {
          return res.status(400).json({
            success: false,
            error: 'Số điện thoại đã được xác thực',
            errorCode: 'PHONE_ALREADY_VERIFIED'
          });
        }

        // Generate new verification token
        const phoneToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.phoneVerificationToken = phoneToken;
        user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send verification SMS
        await SendSMSService.sendVerificationSMS(user.phone, phoneToken);
      }

      res.json({
        success: true,
        message: `Mã xác thực đã được gửi lại đến ${type === 'email' ? 'email' : 'số điện thoại'} của bạn.`
      });
      
    } catch (error) {
      next(error);
    }
  }
);

export default router;