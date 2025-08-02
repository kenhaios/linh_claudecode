import { Request, Response, NextFunction } from 'express';
import { logger, logError } from '../utils/logger';
import { config, isDevelopment } from '../config/environment';

// Custom error class for application errors
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Vietnamese error messages
export const VietnameseErrors = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Thông tin đăng nhập không chính xác',
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  TOKEN_INVALID: 'Token không hợp lệ',
  
  // User errors
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USER_ALREADY_EXISTS: 'Người dùng đã tồn tại',
  EMAIL_ALREADY_EXISTS: 'Email này đã được sử dụng',
  PHONE_ALREADY_EXISTS: 'Số điện thoại này đã được sử dụng',
  INVALID_EMAIL: 'Định dạng email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  
  // Chart errors
  CHART_NOT_FOUND: 'Không tìm thấy lá số tử vi',
  INVALID_BIRTH_DATA: 'Thông tin ngày sinh không hợp lệ',
  CHART_GENERATION_FAILED: 'Tạo lá số tử vi thất bại',
  LUNAR_CONVERSION_FAILED: 'Chuyển đổi âm lịch thất bại',
  
  // Consultation errors
  CONSULTATION_NOT_FOUND: 'Không tìm thấy phiên tư vấn',
  INSUFFICIENT_TOKENS: 'Không đủ token để thực hiện tư vấn',
  AI_SERVICE_ERROR: 'Dịch vụ AI tạm thời không khả dụng',
  CONSULTATION_EXPIRED: 'Phiên tư vấn đã hết hạn',
  
  // Payment errors
  PAYMENT_FAILED: 'Thanh toán thất bại',
  PAYMENT_NOT_FOUND: 'Không tìm thấy giao dịch',
  INVALID_PAYMENT_AMOUNT: 'Số tiền thanh toán không hợp lệ',
  PAYMENT_ALREADY_PROCESSED: 'Giao dịch đã được xử lý',
  
  // Validation errors
  VALIDATION_ERROR: 'Dữ liệu đầu vào không hợp lệ',
  MISSING_REQUIRED_FIELDS: 'Thiếu thông tin bắt buộc',
  INVALID_DATE_FORMAT: 'Định dạng ngày tháng không hợp lệ',
  INVALID_TIME_FORMAT: 'Định dạng thời gian không hợp lệ',
  
  // System errors
  INTERNAL_SERVER_ERROR: 'Lỗi hệ thống, vui lòng thử lại sau',
  DATABASE_ERROR: 'Lỗi cơ sở dữ liệu',
  REDIS_ERROR: 'Lỗi cache hệ thống',
  EXTERNAL_SERVICE_ERROR: 'Dịch vụ bên ngoài tạm thời không khả dụng',
  
  // File upload errors
  FILE_TOO_LARGE: 'File quá lớn',
  INVALID_FILE_TYPE: 'Loại file không được hỗ trợ',
  FILE_UPLOAD_ERROR: 'Lỗi tải file lên',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Bạn đã thực hiện quá nhiều yêu cầu, vui lòng thử lại sau',
  
  // Vietnamese specific
  INVALID_VIETNAMESE_PHONE: 'Số điện thoại Việt Nam không hợp lệ',
  UNSUPPORTED_LUNAR_YEAR: 'Năm âm lịch không được hỗ trợ',
  INVALID_VIETNAMESE_TIME: 'Giờ Việt Nam không hợp lệ',
};

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    stack?: string;
    details?: any;
  };
}

// Handle specific error types
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(VietnameseErrors.VALIDATION_ERROR, 400, 'INVALID_ID');
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)?.[0];
  let message = VietnameseErrors.USER_ALREADY_EXISTS;
  
  if (err.keyPattern?.email) {
    message = VietnameseErrors.EMAIL_ALREADY_EXISTS;
  } else if (err.keyPattern?.phone) {
    message = VietnameseErrors.PHONE_ALREADY_EXISTS;
  }
  
  return new AppError(message, 400, 'DUPLICATE_FIELD');
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `${VietnameseErrors.VALIDATION_ERROR}: ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

const handleJWTError = (): AppError =>
  new AppError(VietnameseErrors.TOKEN_INVALID, 401, 'JWT_INVALID');

const handleJWTExpiredError = (): AppError =>
  new AppError(VietnameseErrors.TOKEN_EXPIRED, 401, 'JWT_EXPIRED');

// Send error response
const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
      details: err,
    },
  };

  res.status(err.statusCode).json(errorResponse);
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: err.isOperational ? err.message : VietnameseErrors.INTERNAL_SERVER_ERROR,
      code: err.isOperational ? err.code : 'INTERNAL_ERROR',
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    },
  };

  // Don't leak error details in production
  if (!err.isOperational) {
    errorResponse.error.message = VietnameseErrors.INTERNAL_SERVER_ERROR;
    errorResponse.error.statusCode = 500;
  }

  res.status(err.statusCode).json(errorResponse);
};

// Global error handling middleware
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error with Vietnamese context
  logError(err, {
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (isDevelopment()) {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(
    `Không tìm thấy đường dẫn ${req.originalUrl} trên server này`,
    404,
    'NOT_FOUND'
  );
  next(err);
};

// Validation error handler
export const validationError = (message: string, details?: any): AppError => {
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

// Vietnamese-specific error helpers
export const createVietnameseError = {
  unauthorized: (message: string = VietnameseErrors.UNAUTHORIZED) =>
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = VietnameseErrors.FORBIDDEN) =>
    new AppError(message, 403, 'FORBIDDEN'),
  
  notFound: (resource: string = 'Tài nguyên') =>
    new AppError(`${resource} không tìm thấy`, 404, 'NOT_FOUND'),
  
  badRequest: (message: string = VietnameseErrors.VALIDATION_ERROR) =>
    new AppError(message, 400, 'BAD_REQUEST'),
  
  conflict: (message: string = VietnameseErrors.USER_ALREADY_EXISTS) =>
    new AppError(message, 409, 'CONFLICT'),
  
  insufficientTokens: () =>
    new AppError(VietnameseErrors.INSUFFICIENT_TOKENS, 402, 'INSUFFICIENT_TOKENS'),
  
  chartGenerationFailed: (details?: string) =>
    new AppError(
      details ? `${VietnameseErrors.CHART_GENERATION_FAILED}: ${details}` : VietnameseErrors.CHART_GENERATION_FAILED,
      500,
      'CHART_GENERATION_FAILED'
    ),
  
  aiServiceError: (details?: string) =>
    new AppError(
      details ? `${VietnameseErrors.AI_SERVICE_ERROR}: ${details}` : VietnameseErrors.AI_SERVICE_ERROR,
      503,
      'AI_SERVICE_ERROR'
    ),
  
  paymentFailed: (details?: string) =>
    new AppError(
      details ? `${VietnameseErrors.PAYMENT_FAILED}: ${details}` : VietnameseErrors.PAYMENT_FAILED,
      400,
      'PAYMENT_FAILED'
    ),
};

export default globalErrorHandler;