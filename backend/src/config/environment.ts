import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  // Server Configuration
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;

  // Database Configuration
  MONGODB_URI: string;
  MONGODB_TEST_URI: string;

  // Redis Configuration
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  REDIS_DB: number;

  // JWT Configuration
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // OpenAI Configuration
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  OPENAI_MAX_TOKENS: number;
  OPENAI_TEMPERATURE: number;

  // Email Configuration
  EMAIL_SERVICE: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_CLIENT_ID: string;
  EMAIL_CLIENT_SECRET: string;
  EMAIL_REFRESH_TOKEN: string;
  EMAIL_FROM_NAME: string;
  EMAIL_FROM_ADDRESS: string;

  // Vietnamese SMS Configuration
  SMS_PROVIDER: string;
  SMS_API_KEY: string;
  SMS_API_SECRET: string;
  SMS_SENDER_NAME: string;

  // Payment Configuration
  MOMO_PARTNER_CODE: string;
  MOMO_ACCESS_KEY: string;
  MOMO_SECRET_KEY: string;
  MOMO_ENDPOINT: string;
  MOMO_REDIRECT_URL: string;
  MOMO_IPN_URL: string;

  VNPAY_TMN_CODE: string;
  VNPAY_HASH_SECRET: string;
  VNPAY_URL: string;
  VNPAY_RETURN_URL: string;
  VNPAY_IPN_URL: string;

  ZALOPAY_APP_ID: string;
  ZALOPAY_KEY1: string;
  ZALOPAY_KEY2: string;
  ZALOPAY_ENDPOINT: string;
  ZALOPAY_CALLBACK_URL: string;

  // Security Configuration
  BCRYPT_SALT_ROUNDS: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS: boolean;

  // CORS Configuration
  CORS_ORIGIN: string;
  CORS_CREDENTIALS: boolean;

  // File Upload Configuration
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  UPLOAD_DIR: string;

  // Logging Configuration
  LOG_LEVEL: string;
  LOG_FILE: string;
  LOG_MAX_SIZE: string;
  LOG_MAX_FILES: number;

  // Vietnamese Localization
  DEFAULT_TIMEZONE: string;
  DEFAULT_LOCALE: string;
  DEFAULT_CURRENCY: string;

  // Token Pricing Configuration (VND)
  TOKEN_PRICE_BASIC: number;
  TOKEN_PRICE_PREMIUM: number;
  TOKEN_PRICE_VIP: number;

  // AI Consultation Pricing (Tokens)
  CONSULTATION_LOVE_COST: number;
  CONSULTATION_CAREER_COST: number;
  CONSULTATION_MAJOR_PERIOD_COST: number;
  CONSULTATION_MINOR_PERIOD_COST: number;
  CONSULTATION_HEALTH_COST: number;
  CONSULTATION_WEALTH_COST: number;
  CONSULTATION_OVERVIEW_COST: number;

  // Cache Configuration (seconds)
  CHART_CACHE_TTL: number;
  AI_RESPONSE_CACHE_TTL: number;
  LUNAR_CALENDAR_CACHE_TTL: number;
}

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'OPENAI_API_KEY',
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: EnvironmentConfig = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  API_VERSION: process.env.API_VERSION || 'v1',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI!,
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ha-linh-test',

  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',
  OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  OPENAI_TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),

  // Email Configuration
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_CLIENT_ID: process.env.EMAIL_CLIENT_ID || '',
  EMAIL_CLIENT_SECRET: process.env.EMAIL_CLIENT_SECRET || '',
  EMAIL_REFRESH_TOKEN: process.env.EMAIL_REFRESH_TOKEN || '',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Ha Linh Tử Vi',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'noreply@halinh-tuvi.com',

  // Vietnamese SMS Configuration
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'stringee',
  SMS_API_KEY: process.env.SMS_API_KEY || '',
  SMS_API_SECRET: process.env.SMS_API_SECRET || '',
  SMS_SENDER_NAME: process.env.SMS_SENDER_NAME || 'HaLinh',

  // Payment Configuration
  MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE || '',
  MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY || '',
  MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY || '',
  MOMO_ENDPOINT: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api',
  MOMO_REDIRECT_URL: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment/momo/callback',
  MOMO_IPN_URL: process.env.MOMO_IPN_URL || 'http://localhost:3001/api/payments/webhook/momo',

  VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE || '',
  VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET || '',
  VNPAY_URL: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/callback',
  VNPAY_IPN_URL: process.env.VNPAY_IPN_URL || 'http://localhost:3001/api/payments/webhook/vnpay',

  ZALOPAY_APP_ID: process.env.ZALOPAY_APP_ID || '',
  ZALOPAY_KEY1: process.env.ZALOPAY_KEY1 || '',
  ZALOPAY_KEY2: process.env.ZALOPAY_KEY2 || '',
  ZALOPAY_ENDPOINT: process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create',
  ZALOPAY_CALLBACK_URL: process.env.ZALOPAY_CALLBACK_URL || 'http://localhost:3001/api/payments/webhook/zalopay',

  // Security Configuration
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true',

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',

  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',

  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',
  LOG_MAX_SIZE: process.env.LOG_MAX_SIZE || '10m',
  LOG_MAX_FILES: parseInt(process.env.LOG_MAX_FILES || '5', 10),

  // Vietnamese Localization
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'Asia/Ho_Chi_Minh',
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'vi_VN',
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'VND',

  // Token Pricing Configuration (VND)
  TOKEN_PRICE_BASIC: parseInt(process.env.TOKEN_PRICE_BASIC || '50000', 10),
  TOKEN_PRICE_PREMIUM: parseInt(process.env.TOKEN_PRICE_PREMIUM || '120000', 10),
  TOKEN_PRICE_VIP: parseInt(process.env.TOKEN_PRICE_VIP || '180000', 10),

  // AI Consultation Pricing (Tokens)
  CONSULTATION_LOVE_COST: parseInt(process.env.CONSULTATION_LOVE_COST || '10', 10),
  CONSULTATION_CAREER_COST: parseInt(process.env.CONSULTATION_CAREER_COST || '15', 10),
  CONSULTATION_MAJOR_PERIOD_COST: parseInt(process.env.CONSULTATION_MAJOR_PERIOD_COST || '20', 10),
  CONSULTATION_MINOR_PERIOD_COST: parseInt(process.env.CONSULTATION_MINOR_PERIOD_COST || '15', 10),
  CONSULTATION_HEALTH_COST: parseInt(process.env.CONSULTATION_HEALTH_COST || '12', 10),
  CONSULTATION_WEALTH_COST: parseInt(process.env.CONSULTATION_WEALTH_COST || '18', 10),
  CONSULTATION_OVERVIEW_COST: parseInt(process.env.CONSULTATION_OVERVIEW_COST || '25', 10),

  // Cache Configuration (seconds)
  CHART_CACHE_TTL: parseInt(process.env.CHART_CACHE_TTL || '86400', 10), // 24 hours
  AI_RESPONSE_CACHE_TTL: parseInt(process.env.AI_RESPONSE_CACHE_TTL || '3600', 10), // 1 hour
  LUNAR_CALENDAR_CACHE_TTL: parseInt(process.env.LUNAR_CALENDAR_CACHE_TTL || '31536000', 10), // 1 year
};

// Helper functions
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';

// Vietnamese-specific helpers
export const getVietnameseTimezone = () => config.DEFAULT_TIMEZONE;
export const getVietnameseLocale = () => config.DEFAULT_LOCALE;
export const getVietnameseCurrency = () => config.DEFAULT_CURRENCY;

export default config;