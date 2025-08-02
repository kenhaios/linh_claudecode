// User model for Ha Linh Vietnamese Astrology Platform
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../../shared/types/auth';

// Extend IUser interface for Mongoose document
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateTokens(): { accessToken: string; refreshToken: string };
  isEmailVerified(): boolean;
  isPhoneVerified(): boolean;
}

// Vietnamese phone number validation regex
const vietnamesePhoneRegex = /^(\+84|0)[3-9]\d{8}$/;

// Vietnamese name validation (supports Vietnamese characters)
const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂẮẰẴẶẨẪẦẤẨẮẰẴẶẺẼỀẾỂỄỆỈỊỌỎỒỐỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỷỹ\s]+$/;

// User schema with Vietnamese-specific validations
const userSchema = new Schema<IUserDocument>({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true,
    minlength: [2, 'Họ và tên phải có ít nhất 2 ký tự'],
    maxlength: [50, 'Họ và tên không được vượt quá 50 ký tự'],
    validate: {
      validator: function(name: string) {
        return vietnameseNameRegex.test(name);
      },
      message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng (hỗ trợ tiếng Việt)'
    }
  },
  
  email: {
    type: String,
    sparse: true, // Allow multiple null values but unique non-null values
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        if (!email) return true; // Email is optional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Email không hợp lệ'
    }
  },
  
  phone: {
    type: String,
    sparse: true, // Allow multiple null values but unique non-null values
    validate: {
      validator: function(phone: string) {
        if (!phone) return true; // Phone is optional
        return vietnamesePhoneRegex.test(phone);
      },
      message: 'Số điện thoại Việt Nam không hợp lệ (VD: +84901234567 hoặc 0901234567)'
    }
  },
  
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
    validate: {
      validator: function(password: string) {
        // Password must contain at least one uppercase, one lowercase, one number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
      },
      message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số'
    }
  },
  
  // Vietnamese-specific preferences
  preferences: {
    language: {
      type: String,
      enum: ['vi', 'en'],
      default: 'vi',
      required: true
    },
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh',
      required: true
    },
    dateFormat: {
      type: String,
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
      default: 'DD/MM/YYYY'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'vietnamese-traditional'],
      default: 'vietnamese-traditional'
    }
  },
  
  // Profile information
  avatar: {
    type: String,
    default: null
  },
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        if (!date) return true; // Optional field
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return age >= 13 && age <= 120; // Age restrictions
      },
      message: 'Tuổi phải từ 13 đến 120'
    }
  },
  
  // Account status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Token management
  tokenBalance: {
    type: Number,
    default: 0,
    min: [0, 'Số dư token không được âm']
  },
  
  // Security fields
  emailVerificationToken: {
    type: String,
    default: null
  },
  
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  
  phoneVerificationToken: {
    type: String,
    default: null
  },
  
  phoneVerificationExpires: {
    type: Date,
    default: null
  },
  
  passwordResetToken: {
    type: String,
    default: null
  },
  
  passwordResetExpires: {
    type: Date,
    default: null
  },
  
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date,
    deviceInfo: {
      userAgent: String,
      ip: String,
      location: String
    }
  }],
  
  // Login tracking
  lastLogin: {
    type: Date,
    default: null
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date,
    default: null
  },
  
  // Vietnamese location preferences
  location: {
    province: {
      type: String,
      validate: {
        validator: function(province: string) {
          if (!province) return true;
          // Vietnamese provinces validation could be added here
          return province.length >= 2 && province.length <= 50;
        },
        message: 'Tỉnh/Thành phố không hợp lệ'
      }
    },
    district: String,
    ward: String
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.phoneVerificationToken;
      delete ret.passwordResetToken;
      delete ret.refreshTokens;
      return ret;
    }
  }
});

// Indexes for performance and uniqueness
userSchema.index({ email: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { email: { $exists: true, $ne: null } }
});

userSchema.index({ phone: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { phone: { $exists: true, $ne: null } }
});

userSchema.index({ createdAt: 1 });
userSchema.index({ 'preferences.language': 1 });
userSchema.index({ 'location.province': 1 });
userSchema.index({ isActive: 1, isEmailVerified: 1 });

// Virtual for checking if user is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  const user = this as IUserDocument;
  
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  try {
    // Hash password with Vietnamese salt rounds
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Lỗi xác thực mật khẩu');
  }
};

// Method to check if email is verified
userSchema.methods.isEmailVerified = function(): boolean {
  return this.isEmailVerified === true;
};

// Method to check if phone is verified
userSchema.methods.isPhoneVerified = function(): boolean {
  return this.isPhoneVerified === true;
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we've reached max attempts and it's not locked already, lock the account
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Validation to ensure either email or phone is provided
userSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    next(new Error('Phải cung cấp ít nhất một trong hai: email hoặc số điện thoại'));
  } else {
    next();
  }
});

// Create and export the User model
export const User = mongoose.model<IUserDocument>('User', userSchema);