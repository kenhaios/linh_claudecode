// Auth API service for Ha Linh Vietnamese Astrology Platform
import axios, { AxiosResponse } from 'axios';
import { IUser } from '../../shared/types/auth';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Vietnamese-Timezone': 'Asia/Ho_Chi_Minh',
    'X-Vietnamese-Language': 'vi'
  }
});

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          });
          
          if (response.data.success) {
            const { accessToken, accessTokenExpires } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('accessTokenExpires', accessTokenExpires);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return authAPI(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessTokenExpires');
          localStorage.removeItem('refreshTokenExpires');
          
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// API response interface
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errorCode?: string;
}

// Auth API methods
const authApiMethods = {
  // Register new user
  register: (userData: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    dateOfBirth?: string;
    preferences?: {
      language?: 'vi' | 'en';
      timezone?: string;
      theme?: 'vietnamese-traditional' | 'light' | 'dark';
    };
    location?: {
      province?: string;
      district?: string;
    };
  }): Promise<AxiosResponse<APIResponse<{
    user: IUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpires: string;
      refreshTokenExpires: string;
    };
    verificationRequired: {
      email: boolean;
      phone: boolean;
    };
  }>>> => {
    return authAPI.post('/register', userData);
  },

  // Login user
  login: (credentials: {
    identifier: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AxiosResponse<APIResponse<{
    user: IUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpires: string;
      refreshTokenExpires: string;
    };
    verificationStatus: {
      email: { required: boolean; verified: boolean };
      phone: { required: boolean; verified: boolean };
    };
    welcomeMessage: string;
  }>>> => {
    return authAPI.post('/login', credentials);
  },

  // Logout user
  logout: (data: { refreshToken: string }): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.post('/logout', data);
  },

  // Refresh access token
  refreshToken: (data: { refreshToken: string }): Promise<AxiosResponse<APIResponse<{
    accessToken: string;
    accessTokenExpires: string;
  }>>> => {
    return authAPI.post('/refresh', data);
  },

  // Get user profile
  getProfile: (): Promise<AxiosResponse<APIResponse<{
    user: IUser;
    sessions: Array<{
      tokenVersion: number;
      createdAt: string;
      deviceInfo: any;
      language: string;
      timezone: string;
    }>;
    vietnameseContext: {
      language: string;
      timezone: string;
      isVietnameseUser: boolean;
    };
  }>>> => {
    return authAPI.get('/profile');
  },

  // Update user profile
  updateProfile: (updateData: Partial<IUser>): Promise<AxiosResponse<APIResponse<{
    user: IUser;
  }>>> => {
    return authAPI.put('/profile', updateData);
  },

  // Change password
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.put('/change-password', data);
  },

  // Verify email
  verifyEmail: (data: {
    token: string;
    email: string;
  }): Promise<AxiosResponse<APIResponse<{
    user: IUser;
    bonusTokens: number;
  }>>> => {
    return authAPI.post('/verify-email', data);
  },

  // Verify phone
  verifyPhone: (data: {
    token: string;
    phone: string;
  }): Promise<AxiosResponse<APIResponse<{
    user: IUser;
    bonusTokens: number;
  }>>> => {
    return authAPI.post('/verify-phone', data);
  },

  // Resend verification
  resendVerification: (data: {
    identifier: string;
    type: 'email' | 'phone';
  }): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.post('/resend-verification', data);
  },

  // Request password reset
  requestPasswordReset: (data: {
    identifier: string;
    type: 'email' | 'phone';
  }): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.post('/request-password-reset', data);
  },

  // Reset password
  resetPassword: (data: {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.post('/reset-password', data);
  },

  // Get user sessions
  getSessions: (): Promise<AxiosResponse<APIResponse<{
    sessions: Array<{
      tokenVersion: number;
      createdAt: string;
      deviceInfo: any;
      language: string;
      timezone: string;
      isCurrentSession: boolean;
    }>;
  }>>> => {
    return authAPI.get('/sessions');
  },

  // Revoke session
  revokeSession: (data: { tokenVersion: number }): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.post('/revoke-session', data);
  },

  // Revoke all sessions except current
  revokeAllSessions: (): Promise<AxiosResponse<APIResponse>> => {
    return authAPI.post('/revoke-all-sessions');
  }
};

export default authApiMethods;