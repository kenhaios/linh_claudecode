import winston from 'winston';
import path from 'path';
import { config, isDevelopment } from '../config/environment';

// Custom log levels for Vietnamese application
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// Custom format for Vietnamese timezone
const vietnameseTimestamp = winston.format.timestamp({
  format: () => {
    return new Date().toLocaleString('vi-VN', {
      timeZone: config.DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },
});

// Custom format for development
const developmentFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  vietnameseTimestamp,
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  })
);

// Custom format for production
const productionFormat = winston.format.combine(
  vietnameseTimestamp,
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logDir = path.dirname(config.LOG_FILE);

const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    level: isDevelopment() ? 'debug' : 'info',
    format: isDevelopment() ? developmentFormat : productionFormat,
    handleExceptions: true,
  }),
];

// File transports for production
if (!isDevelopment()) {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      handleExceptions: true,
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: config.LOG_FILE,
      level: 'info',
      format: productionFormat,
      maxsize: parseInt(config.LOG_MAX_SIZE.replace('m', '')) * 1024 * 1024,
      maxFiles: config.LOG_MAX_FILES,
    }),
    
    // HTTP requests log
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      level: 'http',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    })
  );
}

// Create the logger
export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  levels: logLevels,
  format: productionFormat,
  transports,
  exitOnError: false,
  
  // Exception handling
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880,
      maxFiles: 2,
    }),
  ],
  
  // Rejection handling
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 5242880,
      maxFiles: 2,
    }),
  ],
});

// Vietnamese-specific logging methods
export const vietnameseLogger = {
  // Log authentication events
  authSuccess: (userId: string, method: string, ip?: string) => {
    logger.info('Đăng nhập thành công', {
      userId,
      method,
      ip,
      event: 'auth_success',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  authFailure: (identifier: string, method: string, reason: string, ip?: string) => {
    logger.warn('Đăng nhập thất bại', {
      identifier,
      method,
      reason,
      ip,
      event: 'auth_failure',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  // Log chart generation events
  chartGenerated: (userId: string, chartId: string, method: string, duration: number) => {
    logger.info('Tạo lá số tử vi thành công', {
      userId,
      chartId,
      method,
      duration,
      event: 'chart_generated',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  chartError: (userId: string, error: string, birthData?: any) => {
    logger.error('Lỗi tạo lá số tử vi', {
      userId,
      error,
      birthData,
      event: 'chart_error',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  // Log AI consultation events
  aiConsultationStart: (userId: string, consultationId: string, category: string) => {
    logger.info('Bắt đầu tư vấn AI', {
      userId,
      consultationId,
      category,
      event: 'ai_consultation_start',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  aiConsultationComplete: (userId: string, consultationId: string, tokensUsed: number, duration: number) => {
    logger.info('Hoàn thành tư vấn AI', {
      userId,
      consultationId,
      tokensUsed,
      duration,
      event: 'ai_consultation_complete',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  aiError: (userId: string, consultationId: string, error: string) => {
    logger.error('Lỗi tư vấn AI', {
      userId,
      consultationId,
      error,
      event: 'ai_error',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  // Log payment events
  paymentInitiated: (userId: string, provider: string, amount: number, packageId: string) => {
    logger.info('Khởi tạo thanh toán', {
      userId,
      provider,
      amount,
      packageId,
      event: 'payment_initiated',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  paymentSuccess: (userId: string, provider: string, amount: number, transactionId: string) => {
    logger.info('Thanh toán thành công', {
      userId,
      provider,
      amount,
      transactionId,
      event: 'payment_success',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  paymentFailure: (userId: string, provider: string, amount: number, reason: string) => {
    logger.warn('Thanh toán thất bại', {
      userId,
      provider,
      amount,
      reason,
      event: 'payment_failure',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  // Log token transactions
  tokenTransaction: (userId: string, type: string, amount: number, balanceAfter: number) => {
    logger.info('Giao dịch token', {
      userId,
      type,
      amount,
      balanceAfter,
      event: 'token_transaction',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  // Log system events
  systemStart: (port: number, environment: string) => {
    logger.info('Khởi động hệ thống', {
      port,
      environment,
      version: process.env.npm_package_version,
      nodeVersion: process.version,
      event: 'system_start',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  systemShutdown: (signal: string) => {
    logger.info('Tắt hệ thống', {
      signal,
      uptime: process.uptime(),
      event: 'system_shutdown',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  // Log security events
  rateLimitExceeded: (ip: string, endpoint: string) => {
    logger.warn('Vượt quá giới hạn tần suất', {
      ip,
      endpoint,
      event: 'rate_limit_exceeded',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },

  suspiciousActivity: (userId: string, activity: string, details: any) => {
    logger.warn('Hoạt động đáng ngờ', {
      userId,
      activity,
      details,
      event: 'suspicious_activity',
      timezone: config.DEFAULT_TIMEZONE,
    });
  },
};

// Stream for morgan HTTP logging
export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Error logging helper
export const logError = (error: Error, context?: any) => {
  logger.error(error.message, {
    stack: error.stack,
    name: error.name,
    context,
    timezone: config.DEFAULT_TIMEZONE,
  });
};

// Performance logging helper
export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info(`Performance: ${operation}`, {
    duration,
    metadata,
    event: 'performance',
    timezone: config.DEFAULT_TIMEZONE,
  });
};

export default logger;