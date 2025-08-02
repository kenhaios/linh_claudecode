import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createVietnameseError } from './errorHandler';

// Custom Joi extensions for Vietnamese validation
const joiExtensions = {
  // Vietnamese phone number validation
  vietnamesePhone: Joi.string().pattern(/^(\+84|0)[3-9]\d{8}$/).messages({
    'string.pattern.base': 'Số điện thoại Việt Nam không hợp lệ. Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx',
  }),

  // Vietnamese name validation (allows Vietnamese characters)
  vietnameseName: Joi.string()
    .pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂĐĨŨƯưăđĩũư\s]+$/)
    .min(2)
    .max(50)
    .messages({
      'string.pattern.base': 'Tên chỉ được chứa chữ cái tiếng Việt và khoảng trắng',
      'string.min': 'Tên phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên không được vượt quá {#limit} ký tự',
    }),

  // Vietnamese lunar date validation
  lunarYear: Joi.string()
    .pattern(/^(Giáp|Ất|Bính|Đinh|Mậu|Kỷ|Canh|Tân|Nhâm|Quý)\s(Tý|Sửu|Dần|Mão|Thìn|Tỵ|Ngọ|Mùi|Thân|Dậu|Tuất|Hợi)$/)
    .messages({
      'string.pattern.base': 'Năm âm lịch không hợp lệ. Ví dụ: Giáp Tý, Ất Sửu, ...',
    }),

  // Vietnamese traditional time periods
  vietnameseHour: Joi.string()
    .valid('Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi')
    .messages({
      'any.only': 'Giờ truyền thống Việt Nam không hợp lệ',
    }),

  // Astrology method validation
  astrologyMethod: Joi.string()
    .valid('bắc_phái', 'nam_phái', 'phổ_biến')
    .messages({
      'any.only': 'Phương pháp tử vi phải là: bắc_phái, nam_phái, hoặc phổ_biến',
    }),

  // Gender validation
  vietnameseGender: Joi.string()
    .valid('nam', 'nữ')
    .messages({
      'any.only': 'Giới tính phải là "nam" hoặc "nữ"',
    }),

  // Consultation category validation
  consultationCategory: Joi.string()
    .valid('tổng_quan', 'sự_nghiệp', 'tình_duyên', 'tài_lộc', 'sức_khỏe', 'gia_đình')
    .messages({
      'any.only': 'Danh mục tư vấn không hợp lệ',
    }),
};

// Common validation schemas
export const commonSchemas = {
  // MongoDB ObjectId
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'ID không hợp lệ',
  }),

  // Email validation
  email: Joi.string().email().messages({
    'string.email': 'Định dạng email không hợp lệ',
  }),

  // Password validation
  password: Joi.string().min(6).max(50).messages({
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'string.max': 'Mật khẩu không được vượt quá {#limit} ký tự',
  }),

  // OTP validation
  otp: Joi.string().pattern(/^\d{6}$/).messages({
    'string.pattern.base': 'Mã OTP phải có 6 chữ số',
  }),

  // Date validation
  date: Joi.date().messages({
    'date.base': 'Ngày tháng không hợp lệ',
  }),

  // Vietnamese province validation
  vietnameseProvince: Joi.string().valid(
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh',
    'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau',
    'Cao Bằng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
    'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang',
    'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
    'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi',
    'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình',
    'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh',
    'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'
  ).messages({
    'any.only': 'Tỉnh/thành phố không hợp lệ',
  }),
};

// Authentication schemas
export const authSchemas = {
  register: Joi.object({
    name: joiExtensions.vietnameseName.required(),
    email: commonSchemas.email.when('phone', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    phone: joiExtensions.vietnamesePhone.when('email', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    password: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Xác nhận mật khẩu không khớp',
    }),
  }).messages({
    'object.missing': 'Phải cung cấp email hoặc số điện thoại',
  }),

  login: Joi.object({
    identifier: Joi.alternatives()
      .try(commonSchemas.email, joiExtensions.vietnamesePhone)
      .required()
      .messages({
        'alternatives.match': 'Email hoặc số điện thoại không hợp lệ',
      }),
    password: commonSchemas.password.required(),
  }),

  verifyOTP: Joi.object({
    identifier: Joi.alternatives()
      .try(commonSchemas.email, joiExtensions.vietnamesePhone)
      .required(),
    otp: commonSchemas.otp.required(),
  }),

  changePassword: Joi.object({
    currentPassword: commonSchemas.password.required(),
    newPassword: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Xác nhận mật khẩu mới không khớp',
    }),
  }),

  forgotPassword: Joi.object({
    identifier: Joi.alternatives()
      .try(commonSchemas.email, joiExtensions.vietnamesePhone)
      .required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Xác nhận mật khẩu không khớp',
    }),
  }),
};

// Chart generation schemas
export const chartSchemas = {
  birthData: Joi.object({
    name: joiExtensions.vietnameseName.required(),
    gender: joiExtensions.vietnameseGender.required(),
    solarDate: commonSchemas.date.required(),
    timeOfBirth: Joi.object({
      hour: Joi.number().integer().min(0).max(23).required(),
      minute: Joi.number().integer().min(0).max(59).required(),
      traditionalHour: joiExtensions.vietnameseHour.optional(),
    }).required(),
    placeOfBirth: Joi.object({
      province: commonSchemas.vietnameseProvince.required(),
      district: Joi.string().optional(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
    }).required(),
    calculationMethod: joiExtensions.astrologyMethod.optional().default('phổ_biến'),
  }),

  updateChart: Joi.object({
    name: joiExtensions.vietnameseName.optional(),
    isPublic: Joi.boolean().optional(),
  }),
};

// Consultation schemas
export const consultationSchemas = {
  createConsultation: Joi.object({
    chartId: commonSchemas.objectId.required(),
    category: joiExtensions.consultationCategory.required(),
    initialMessage: Joi.string().min(1).max(500).optional(),
  }),

  sendMessage: Joi.object({
    consultationId: commonSchemas.objectId.required(),
    message: Joi.string().min(1).max(500).required(),
    messageType: Joi.string().valid('text', 'voice').optional().default('text'),
  }),

  feedback: Joi.object({
    consultationId: commonSchemas.objectId.required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).optional(),
    helpful: Joi.boolean().required(),
    culturallyAppropriate: Joi.boolean().required(),
  }),
};

// Payment schemas
export const paymentSchemas = {
  createPayment: Joi.object({
    packageId: Joi.string().valid('basic', 'premium', 'vip').required(),
    provider: Joi.string().valid('momo', 'vnpay', 'zalopay').required(),
    returnUrl: Joi.string().uri().optional(),
  }),

  webhook: Joi.object({
    // This will be provider-specific and validated in the webhook handlers
  }).unknown(true),
};

// User profile schemas
export const profileSchemas = {
  updateProfile: Joi.object({
    name: joiExtensions.vietnameseName.optional(),
    avatar: Joi.string().uri().optional(),
    dateOfBirth: commonSchemas.date.optional(),
    gender: joiExtensions.vietnameseGender.optional(),
    location: Joi.object({
      province: commonSchemas.vietnameseProvince.optional(),
      district: Joi.string().optional(),
    }).optional(),
    preferences: Joi.object({
      language: Joi.string().valid('vi', 'en').optional(),
      astrologyMethod: joiExtensions.astrologyMethod.optional(),
      dateFormat: Joi.string().valid('solar', 'lunar').optional(),
    }).optional(),
  }),
};

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw createVietnameseError.badRequest(`Dữ liệu không hợp lệ: ${errorMessages.join(', ')}`);
    }

    // Replace the original data with validated and converted data
    req[property] = value;
    next();
  };
};

// Sanitization middleware
export const sanitize = (req: Request, res: Response, next: NextFunction): void => {
  // Remove any potential XSS or injection attempts
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Basic HTML tag removal
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Custom validation helpers
export const validateVietnameseBirthData = (birthData: any): string[] => {
  const errors: string[] = [];

  // Validate birth year range (reasonable range for astrology)
  const birthYear = new Date(birthData.solarDate).getFullYear();
  if (birthYear < 1900 || birthYear > new Date().getFullYear()) {
    errors.push('Năm sinh phải từ 1900 đến hiện tại');
  }

  // Validate time format
  if (birthData.timeOfBirth) {
    const { hour, minute } = birthData.timeOfBirth;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      errors.push('Thời gian sinh không hợp lệ');
    }
  }

  return errors;
};

export const validateTokenAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 100000 && Number.isInteger(amount);
};

export const validateVietnameseDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getFullYear() >= 1900;
};

export default validate;