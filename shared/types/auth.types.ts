// Shared authentication types for Ha Linh Vietnamese Astrology Application

// User-related types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  tokenBalance: number;
  role: UserRole;
  preferences: UserPreferences;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: VietnameseGender;
  location?: VietnameseLocation;
  bio?: string;
}

export interface UserPreferences {
  language: SupportedLanguage;
  timezone: VietnameseTimezone;
  astrologyMethod: AstrologyMethod;
  dateFormat: DateFormat;
  theme: ThemeMode;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  consultationReminders: boolean;
  tokenLowWarning: boolean;
  marketingEmails: boolean;
}

// Authentication request/response types
export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
  rememberMe?: boolean;
}

export interface VerifyOTPRequest {
  identifier: string;
  otp: string;
  type: OTPType;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Vietnamese-specific enums and types
export type VietnameseGender = 'nam' | 'nữ';

export type SupportedLanguage = 'vi' | 'en';

export type VietnameseTimezone = 'Asia/Ho_Chi_Minh';

export type AstrologyMethod = 'bắc_phái' | 'nam_phái' | 'phổ_biến';

export type DateFormat = 'solar' | 'lunar' | 'both';

export type ThemeMode = 'light' | 'dark' | 'auto';

export type UserRole = 'user' | 'premium' | 'admin' | 'astrologer';

export type OTPType = 'registration' | 'login' | 'password_reset' | 'phone_verification' | 'email_verification';

export interface VietnameseLocation {
  province: VietnameseProvince;
  district?: string;
  ward?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Vietnamese provinces
export type VietnameseProvince = 
  | 'An Giang' | 'Bà Rịa - Vũng Tàu' | 'Bắc Giang' | 'Bắc Kạn' | 'Bạc Liêu' | 'Bắc Ninh'
  | 'Bến Tre' | 'Bình Định' | 'Bình Dương' | 'Bình Phước' | 'Bình Thuận' | 'Cà Mau'
  | 'Cao Bằng' | 'Đắk Lắk' | 'Đắk Nông' | 'Điện Biên' | 'Đồng Nai' | 'Đồng Tháp'
  | 'Gia Lai' | 'Hà Giang' | 'Hà Nam' | 'Hà Tĩnh' | 'Hải Dương' | 'Hậu Giang'
  | 'Hòa Bình' | 'Hưng Yên' | 'Khánh Hòa' | 'Kiên Giang' | 'Kon Tum' | 'Lai Châu'
  | 'Lâm Đồng' | 'Lạng Sơn' | 'Lào Cai' | 'Long An' | 'Nam Định' | 'Nghệ An'
  | 'Ninh Bình' | 'Ninh Thuận' | 'Phú Thọ' | 'Quảng Bình' | 'Quảng Nam' | 'Quảng Ngãi'
  | 'Quảng Ninh' | 'Quảng Trị' | 'Sóc Trăng' | 'Sơn La' | 'Tây Ninh' | 'Thái Bình'
  | 'Thái Nguyên' | 'Thanh Hóa' | 'Thừa Thiên Huế' | 'Tiền Giang' | 'Trà Vinh'
  | 'Tuyên Quang' | 'Vĩnh Long' | 'Vĩnh Phúc' | 'Yên Bái'
  | 'Hà Nội' | 'Hồ Chí Minh' | 'Đà Nẵng' | 'Hải Phòng' | 'Cần Thơ';

// Session management
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  location?: string;
  isActive: boolean;
  lastActivity: string;
  expiresAt: string;
  createdAt: string;
}

export interface DeviceInfo {
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
}

// Error types
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: any;
}

export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'USER_ALREADY_EXISTS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PHONE_ALREADY_EXISTS'
  | 'INVALID_EMAIL'
  | 'INVALID_PHONE'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'OTP_ATTEMPTS_EXCEEDED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'ACCOUNT_NOT_VERIFIED'
  | 'ACCOUNT_SUSPENDED'
  | 'PASSWORD_TOO_WEAK'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TERMS_NOT_ACCEPTED';

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Vietnamese phone number validation
export interface VietnamesePhoneValidation {
  isValid: boolean;
  formatted: string;
  provider?: VietnamesePhoneProvider;
  type: PhoneType;
}

export type VietnamesePhoneProvider = 
  | 'Viettel' | 'Vinaphone' | 'Mobifone' | 'Vietnamobile' | 'Gmobile' | 'Itelecom';

export type PhoneType = 'mobile' | 'landline';

// JWT payload
export interface JWTPayload {
  sub: string; // user id
  email?: string;
  phone?: string;
  role: UserRole;
  tokenVersion: number;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// OAuth types (for future social login)
export interface OAuthProvider {
  name: string;
  clientId: string;
  scope: string[];
  redirectUri: string;
}

export interface OAuthResponse {
  provider: string;
  accessToken: string;
  refreshToken?: string;
  userInfo: OAuthUserInfo;
}

export interface OAuthUserInfo {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  verified: boolean;
}

// Event types for authentication
export interface AuthEvent {
  type: AuthEventType;
  userId: string;
  metadata: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export type AuthEventType = 
  | 'REGISTER'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'PROFILE_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_REACTIVATED';

export default User;