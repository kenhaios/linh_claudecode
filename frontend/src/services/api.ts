import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/store';
import { logout, refreshTokenAsync } from '@/store/slices/authSlice';
import { showErrorMessage } from '@/store/slices/uiSlice';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

class APIService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Vietnamese-Timezone': 'Asia/Ho_Chi_Minh',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata) {
          const endTime = new Date();
          const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
          console.log(`API Request ${response.config.url} took ${duration}ms`);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
          store.dispatch(showErrorMessage('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'));
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh token
            const resultAction = await store.dispatch(refreshTokenAsync());
            
            if (refreshTokenAsync.fulfilled.match(resultAction)) {
              const newToken = resultAction.payload.accessToken;
              
              // Process failed queue
              this.processQueue(null, newToken);
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            } else {
              // Refresh failed, logout user
              this.processQueue(new Error('Token refresh failed'), null);
              store.dispatch(logout());
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            store.dispatch(logout());
            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        if (error.response.status >= 500) {
          store.dispatch(showErrorMessage('Lỗi máy chủ. Vui lòng thử lại sau.'));
        } else if (error.response.status === 429) {
          store.dispatch(showErrorMessage('Quá nhiều yêu cầu. Vui lòng thử lại sau.'));
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete(url, config);
  }

  // File upload method
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }
}

// Create API service instance
const apiService = new APIService();

// Authentication API
export const authAPI = {
  register: (userData: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => apiService.post('/auth/register', userData),

  login: (credentials: {
    identifier: string;
    password: string;
  }) => apiService.post('/auth/login', credentials),

  verifyOTP: (otpData: {
    identifier: string;
    otp: string;
  }) => apiService.post('/auth/verify-otp', otpData),

  refreshToken: (refreshToken: string) => 
    apiService.post('/auth/refresh', { refreshToken }),

  logout: () => apiService.post('/auth/logout'),

  forgotPassword: (identifier: string) => 
    apiService.post('/auth/forgot-password', { identifier }),

  resetPassword: (resetData: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => apiService.post('/auth/reset-password', resetData),

  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => apiService.post('/auth/change-password', passwordData),

  updateProfile: (profileData: any) => 
    apiService.put('/auth/profile', profileData),

  getProfile: () => apiService.get('/auth/profile'),
};

// Charts API
export const chartsAPI = {
  generateChart: (birthData: any) => 
    apiService.post('/charts/generate', birthData),

  getCharts: (page = 1, limit = 10) => 
    apiService.get(`/charts?page=${page}&limit=${limit}`),

  getChart: (id: string) => apiService.get(`/charts/${id}`),

  updateChart: (id: string, data: any) => 
    apiService.put(`/charts/${id}`, data),

  deleteChart: (id: string) => apiService.delete(`/charts/${id}`),

  convertDate: (date: string, fromType: 'solar' | 'lunar', toType: 'solar' | 'lunar') =>
    apiService.post('/charts/convert-date', { date, fromType, toType }),

  getVietnameseHours: () => apiService.get('/charts/vietnamese-hours'),

  getTraditionalCalendar: (year: number, month: number) =>
    apiService.get(`/charts/traditional-calendar/${year}/${month}`),
};

// Consultations API
export const consultationsAPI = {
  createConsultation: (consultationData: {
    chartId: string;
    category: string;
    initialMessage?: string;
  }) => apiService.post('/consultations', consultationData),

  getConsultations: (page = 1, limit = 10) => 
    apiService.get(`/consultations?page=${page}&limit=${limit}`),

  getConsultation: (id: string) => 
    apiService.get(`/consultations/${id}`),

  sendMessage: (id: string, messageData: {
    message: string;
    messageType?: string;
  }) => apiService.post(`/consultations/${id}/messages`, messageData),

  deleteConsultation: (id: string) => 
    apiService.delete(`/consultations/${id}`),

  submitFeedback: (id: string, feedback: {
    rating: number;
    comment?: string;
    helpful: boolean;
    culturallyAppropriate: boolean;
  }) => apiService.post(`/consultations/${id}/feedback`, feedback),
};

// Payments API
export const paymentsAPI = {
  getPackages: () => apiService.get('/payments/packages'),

  createPaymentIntent: (paymentData: {
    packageId: string;
    provider: string;
    returnUrl?: string;
  }) => apiService.post('/payments/create-intent', paymentData),

  getPaymentHistory: (page = 1, limit = 10) => 
    apiService.get(`/payments/history?page=${page}&limit=${limit}`),

  getTokenBalance: () => apiService.get('/tokens/balance'),

  getTokenTransactions: (page = 1, limit = 10) => 
    apiService.get(`/tokens/transactions?page=${page}&limit=${limit}`),
};

// Health check API
export const healthAPI = {
  check: () => apiService.get('/health'),
  
  detailed: () => apiService.get('/health/detailed'),
};

export default apiService;