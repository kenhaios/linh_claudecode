import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../shared/types/auth';
import authAPI from '../../services/authAPI';

// Use shared User interface

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Registration state
  registrationStep: 'info' | 'verification' | 'completed';
  pendingVerification: {
    identifier: string;
    type: 'email' | 'phone';
  } | null;
  
  // Password reset state
  resetPasswordToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationStep: 'info',
  pendingVerification: null,
  resetPasswordToken: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    userData: {
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
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Đăng ký thất bại');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: {
      identifier: string;
      password: string;
      rememberMe?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Đăng nhập thất bại');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (
    otpData: {
      identifier: string;
      otp: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Xác thực OTP thất bại');
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authAPI.refreshToken(refreshToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Làm mới token thất bại');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    profileData: Partial<IUser>,
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Cập nhật thông tin thất bại');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Đổi mật khẩu thất bại');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (
    identifier: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.forgotPassword(identifier);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Gửi yêu cầu đặt lại mật khẩu thất bại');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    resetData: {
      token: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Đặt lại mật khẩu thất bại');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.registrationStep = 'info';
      state.pendingVerification = null;
      state.resetPasswordToken = null;
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    
    // Set tokens (for when tokens are received from external sources)
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    
    // Update user profile locally
    updateUserProfile: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // Update token balance
    updateTokenBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.tokenBalance = action.payload;
      }
    },
    
    // Set registration step
    setRegistrationStep: (state, action: PayloadAction<'info' | 'verification' | 'completed'>) => {
      state.registrationStep = action.payload;
    },
    
    // Set pending verification
    setPendingVerification: (state, action: PayloadAction<{ identifier: string; type: 'email' | 'phone' } | null>) => {
      state.pendingVerification = action.payload;
    },
    
    // Initialize auth state from stored tokens
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        
        // Set verification status
        if (action.payload.verificationRequired.email || action.payload.verificationRequired.phone) {
          state.registrationStep = 'verification';
          state.pendingVerification = {
            identifier: action.payload.user.email || action.payload.user.phone || '',
            type: action.payload.verificationRequired.email ? 'email' : 'phone',
          };
        } else {
          state.registrationStep = 'completed';
        }
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.registrationStep = 'completed';
        state.pendingVerification = null;
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Refresh token
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        
        // Update tokens in localStorage
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        // If refresh fails, logout user
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
    
    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        // Password changed successfully, tokens will be refreshed automatically
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetPasswordToken = action.payload.token;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetPasswordToken = null;
        // User will need to login again after password reset
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  logout,
  setTokens,
  updateUserProfile,
  updateTokenBalance,
  setRegistrationStep,
  setPendingVerification,
  initializeAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;