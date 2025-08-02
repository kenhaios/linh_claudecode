# Phase 3: Authentication System Implementation

## Objective
Implement a comprehensive JWT-based authentication system adapted from the researched open-source template, with Vietnamese market-specific features and security best practices.

## Prerequisites
- Phase 2 foundation setup completed
- Backend and frontend development environments running
- Database connections established

## Tasks to Complete

### 1. Backend Authentication Implementation

#### User Model and Database Schema
Create comprehensive user data models:

**User Model (`src/models/User.ts`)**
```typescript
interface User {
  _id: ObjectId;
  email: string;
  phone?: string;
  password: string;
  profile: {
    name: string;
    gender?: 'male' | 'female';
    birthDate?: Date;
    birthTime?: string;
    avatar?: string;
  };
  authentication: {
    isVerified: boolean;
    emailVerificationToken?: string;
    phoneVerificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;
  };
  tokens: {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
  };
  preferences: {
    language: 'vi' | 'en';
    notifications: boolean;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Authentication Services
Implement core authentication services:

**Auth Service (`src/services/AuthService.ts`)**
- User registration with email/phone validation
- Email and SMS OTP verification
- Login with rate limiting and account locking
- JWT token generation and refresh
- Password reset functionality
- Social authentication preparation (Google, Facebook)

**JWT Service (`src/services/JWTService.ts`)**
- Access token generation (15 minutes expiry)
- Refresh token generation (7 days expiry)
- Token verification and validation
- Token blacklisting for logout
- Secure token storage patterns

#### Authentication Controllers
Create authentication controllers:

**Auth Controller (`src/controllers/AuthController.ts`)**
```typescript
class AuthController {
  // User registration
  async register(req: Request, res: Response): Promise<void>
  
  // Email/Phone verification
  async verifyEmail(req: Request, res: Response): Promise<void>
  async verifyPhone(req: Request, res: Response): Promise<void>
  async resendVerification(req: Request, res: Response): Promise<void>
  
  // Login and logout
  async login(req: Request, res: Response): Promise<void>
  async logout(req: Request, res: Response): Promise<void>
  async refreshToken(req: Request, res: Response): Promise<void>
  
  // Password management
  async forgotPassword(req: Request, res: Response): Promise<void>
  async resetPassword(req: Request, res: Response): Promise<void>
  async changePassword(req: Request, res: Response): Promise<void>
  
  // Profile management
  async getProfile(req: Request, res: Response): Promise<void>
  async updateProfile(req: Request, res: Response): Promise<void>
}
```

#### Authentication Middleware
Implement security middleware:

**Auth Middleware (`src/middleware/auth.ts`)**
- JWT token validation
- Request authentication
- Role-based access control
- Rate limiting per user/IP
- Request logging and monitoring

**Validation Middleware (`src/middleware/validation.ts`)**
- Vietnamese phone number validation
- Email format validation
- Password strength requirements
- Input sanitization
- XSS protection

#### Vietnamese-Specific Features
Implement localization features:

**Vietnamese Phone Validation**
- Support for Vietnamese mobile formats (+84, 03x, 05x, 07x, 08x, 09x)
- Integration with Vietnamese SMS providers
- Proper formatting and validation

**Email Templates**
- Vietnamese language email templates
- Professional astrology-themed design
- OTP verification emails
- Password reset emails
- Welcome emails

### 2. Security Implementation

#### Password Security
- bcrypt hashing with salt rounds (12+)
- Password complexity requirements
- Password history to prevent reuse
- Account lockout after failed attempts

#### Session Security
- Secure JWT implementation
- HttpOnly cookies for refresh tokens
- CSRF protection
- Secure headers (helmet.js)

#### Rate Limiting and Protection
- Login attempt rate limiting
- API rate limiting per user
- IP-based rate limiting
- DDoS protection measures

### 3. Frontend Authentication Implementation

#### Authentication State Management
Set up Redux store for authentication:

**Auth Slice (`src/store/slices/authSlice.ts`)**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}
```

#### Authentication Services
Create frontend authentication services:

**Auth API Service (`src/services/authApi.ts`)**
- Axios interceptors for token attachment
- Automatic token refresh logic
- API error handling
- Request/response logging

#### Authentication Components
Create React authentication components:

**Registration Component (`src/components/auth/Register.tsx`)**
- Multi-step registration form
- Vietnamese phone number input
- Email verification flow
- Password strength indicator
- Terms and conditions

**Login Component (`src/components/auth/Login.tsx`)**
- Email/phone login options
- Remember me functionality
- Forgot password link
- Social login buttons (prepared)
- Vietnamese language support

**Profile Component (`src/components/auth/Profile.tsx`)**
- User profile editing
- Password change form
- Account settings
- Birth information for astrology

#### Protected Routes
Implement route protection:

**Route Guards (`src/components/auth/ProtectedRoute.tsx`)**
- Authentication checking
- Automatic redirect to login
- Loading states
- Error handling

### 4. Validation and Error Handling

#### Backend Validation
Implement comprehensive validation:

**Joi Validation Schemas (`src/validation/authSchemas.ts`)**
- Registration validation
- Login validation
- Profile update validation
- Vietnamese-specific validations

#### Frontend Validation
Implement React Hook Form validation:

**Form Validation (`src/hooks/useFormValidation.ts`)**
- Real-time validation
- Vietnamese error messages
- Custom validation rules
- Form state management

#### Error Handling
Create comprehensive error handling:

**Error Types and Messages**
- Authentication error types
- Vietnamese error messages
- User-friendly error display
- Error logging and reporting

### 5. Testing Implementation

#### Backend Testing
Create comprehensive tests:

**Unit Tests (`tests/unit/auth/`)**
- AuthService unit tests
- JWTService unit tests
- Validation function tests
- Model method tests

**Integration Tests (`tests/integration/auth/`)**
- Registration flow tests
- Login flow tests
- Token refresh tests
- Password reset tests

#### Frontend Testing
Create React component tests:

**Component Tests (`src/components/auth/__tests__/`)**
- Registration form tests
- Login form tests
- Profile component tests
- Protected route tests

### 6. Vietnamese Localization

#### Language Support
Implement Vietnamese language features:

**Translation Files (`src/locales/`)**
- Vietnamese authentication messages
- Error messages in Vietnamese
- Form labels and placeholders
- Success messages

**Date and Time Formatting**
- Vietnamese date formats
- Timezone handling for Vietnam
- Cultural date preferences

### 7. Integration with External Services

#### Email Service Integration
Set up email service:
- SMTP configuration (Gmail, SendGrid, or local provider)
- Email template engine
- Vietnamese email templates
- Delivery tracking

#### SMS Service Integration (Optional)
Prepare SMS integration:
- Vietnamese SMS provider research
- OTP delivery via SMS
- Cost-effective SMS solutions
- Fallback to email if SMS fails

## Deliverables

### 1. Backend Authentication System
- Complete User model with Vietnamese-specific fields
- Full authentication service with JWT implementation
- Secure middleware for request protection
- Comprehensive validation and error handling
- Rate limiting and security measures

### 2. Frontend Authentication Interface
- Complete registration and login forms
- User profile management interface
- Protected route implementation
- Vietnamese language support
- Responsive design for mobile devices

### 3. Security Implementation
- JWT token security best practices
- Password hashing and validation
- Rate limiting and account protection
- CSRF and XSS protection
- Secure session management

### 4. Testing Suite
- Unit tests for all authentication services
- Integration tests for authentication flows
- Frontend component tests
- End-to-end authentication testing

### 5. Documentation
- Authentication API documentation
- Frontend component documentation
- Security implementation guide
- Vietnamese localization guide

## Success Criteria

### Functional Requirements
- [ ] Users can register with email or phone
- [ ] Email/phone verification working
- [ ] Secure login and logout functionality
- [ ] Password reset flow operational
- [ ] Profile management working
- [ ] Vietnamese language support complete

### Security Requirements
- [ ] JWT tokens properly secured
- [ ] Password hashing implemented correctly
- [ ] Rate limiting prevents brute force attacks
- [ ] CSRF and XSS protection active
- [ ] Input validation comprehensive
- [ ] Account lockout working properly

### Performance Requirements
- [ ] Registration process < 3 seconds
- [ ] Login process < 2 seconds
- [ ] Token refresh seamless and fast
- [ ] Form validation responsive
- [ ] Mobile interface smooth

### Vietnamese Market Requirements
- [ ] Vietnamese phone numbers validated correctly
- [ ] Vietnamese email templates professional
- [ ] Cultural preferences respected
- [ ] Local timezone handling correct
- [ ] Vietnamese error messages clear

## Testing Checklist

### Backend API Testing
- [ ] POST /api/auth/register - User registration
- [ ] POST /api/auth/verify-email - Email verification
- [ ] POST /api/auth/verify-phone - Phone verification
- [ ] POST /api/auth/login - User login
- [ ] POST /api/auth/logout - User logout
- [ ] POST /api/auth/refresh - Token refresh
- [ ] POST /api/auth/forgot-password - Password reset request
- [ ] POST /api/auth/reset-password - Password reset completion
- [ ] GET /api/auth/profile - Get user profile
- [ ] PUT /api/auth/profile - Update user profile

### Frontend Component Testing
- [ ] Registration form validation
- [ ] Login form functionality
- [ ] Password strength indicator
- [ ] Profile editing interface
- [ ] Protected route behavior
- [ ] Error message display
- [ ] Loading states
- [ ] Mobile responsiveness

### Integration Testing
- [ ] Complete registration flow
- [ ] Email verification workflow
- [ ] Login and token management
- [ ] Password reset workflow
- [ ] Profile update process
- [ ] Session timeout handling

## Implementation Notes

### Security Considerations
- Use bcrypt with minimum 12 salt rounds
- Implement proper JWT secret rotation
- Set appropriate token expiration times
- Use HTTPS in production
- Implement proper CORS policies
- Add request logging for security monitoring

### Vietnamese-Specific Implementation
- Support multiple Vietnamese phone formats
- Use Vietnamese date formats (dd/mm/yyyy)
- Implement proper Vietnamese character encoding
- Consider Vietnamese cultural naming conventions
- Add support for Vietnamese national ID validation (optional)

### Performance Optimization
- Implement proper database indexing for auth queries
- Use Redis for session storage and rate limiting
- Optimize API response times
- Implement proper caching strategies
- Minimize JWT payload size

### Error Handling Best Practices
- Provide clear, actionable error messages
- Log security events properly
- Implement graceful degradation
- Handle network failures elegantly
- Provide helpful validation feedback

## Dependencies to Install

### Backend Dependencies
```bash
npm install bcryptjs jsonwebtoken joi express-rate-limit
npm install nodemailer mongoose redis helmet cors
npm install express-validator express-session
npm install @types/bcryptjs @types/jsonwebtoken --save-dev
```

### Frontend Dependencies
```bash
npm install react-hook-form @hookform/resolvers yup
npm install @mui/material @mui/icons-material
npm install axios react-router-dom @reduxjs/toolkit react-redux
npm install react-i18next i18next
```

## Estimated Time
3-4 days for complete authentication system implementation