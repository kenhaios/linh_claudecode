# Ha Linh Vietnamese Astrology Website - Technical Architecture

## System Overview

The Ha Linh Vietnamese Astrology AI Website is a comprehensive platform that combines traditional Vietnamese astrology (Tử Vi Đẩu Số) with modern AI consultation services. The system provides accurate chart generation, real-time AI consultations, and integrated payment processing for Vietnamese users.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   React + TS    │◄──►│   Node.js       │◄──►│   Services      │
│   Ant Design    │    │   Express.js    │    │   OpenAI API    │
│   Socket.io     │    │   Socket.io     │    │   Payment APIs  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   MongoDB       │
                       │   Redis Cache   │
                       └─────────────────┘
```

## Technology Stack

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **UI Library**: Ant Design with Vietnamese (vi_VN) locale
- **Chart Visualization**: Recharts + Visx for astrology charts
- **Real-time Communication**: Socket.io-client
- **State Management**: Redux Toolkit with RTK Query
- **Form Handling**: React Hook Form with Ant Design integration
- **Internationalization**: react-i18next
- **Build Tool**: Vite for fast development

### Backend Stack
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with structured middleware
- **Authentication**: JWT tokens with refresh mechanism
- **Real-time**: Socket.io with Redis adapter for clustering
- **Validation**: Joi for input validation
- **Email Service**: Nodemailer with Gmail OAuth2
- **SMS Service**: Vietnamese SMS providers (Stringee, eSMS.vn)

### Database & Storage
- **Primary Database**: MongoDB 6.0+ with Mongoose ODM
- **Cache Layer**: Redis 7.0+ for sessions and real-time data
- **File Storage**: Local storage for development, AWS S3 for production
- **Session Store**: Redis-based session management

### External Services
- **AI Service**: OpenAI GPT-4 for astrology consultations
- **Payment Processing**: 
  - MoMo API for Vietnamese e-wallet
  - VNPay for bank card transactions
  - ZaloPay for Zalo ecosystem integration
- **Email Service**: Gmail SMTP with OAuth2
- **SMS Service**: Vietnamese providers for OTP verification

## Microservices Architecture

### Core Services

#### 1. Authentication Service
```typescript
interface AuthService {
  // User management
  register(userData: UserRegistration): Promise<AuthResult>;
  login(credentials: LoginCredentials): Promise<AuthResult>;
  refreshToken(token: string): Promise<TokenPair>;
  
  // Vietnamese-specific features
  validateVietnamesePhone(phone: string): boolean;
  sendVietnameseSMS(phone: string, otp: string): Promise<void>;
  sendVietnameseEmail(email: string, template: string): Promise<void>;
}
```

#### 2. Astrology Chart Service
```typescript
interface ChartService {
  // Chart generation
  generateChart(birthData: BirthData): Promise<AstrologyChart>;
  validateBirthData(data: BirthData): ValidationResult;
  
  // Vietnamese astrology specific
  convertSolarToLunar(date: Date): LunarDate;
  calculateStarPositions(birthData: BirthData): StarPositions;
  determineTraditionalTime(hour: number): VietnameseHour;
}
```

#### 3. AI Consultation Service
```typescript
interface AIService {
  // Chat management
  processUserMessage(message: ChatMessage): Promise<AIResponse>;
  generateAstrologyPrompt(chart: AstrologyChart, query: string): string;
  
  // Vietnamese context
  analyzeVietnameseAstrology(chart: AstrologyChart): Promise<Analysis>;
  formatVietnameseResponse(response: string): FormattedResponse;
}
```

#### 4. Payment Service
```typescript
interface PaymentService {
  // Vietnamese payment methods
  createMoMoPayment(amount: number, userId: string): Promise<PaymentIntent>;
  createVNPayPayment(amount: number, userId: string): Promise<PaymentIntent>;
  processWebhook(provider: PaymentProvider, payload: any): Promise<void>;
  
  // Token management
  addTokensToUser(userId: string, amount: number): Promise<void>;
  deductTokens(userId: string, amount: number): Promise<boolean>;
}
```

## Database Schema Design

### User Schema
```typescript
interface User {
  _id: ObjectId;
  
  // Authentication
  email?: string;
  phone?: string; // Vietnamese phone format: +84xxxxxxxxx
  hashedPassword: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  tokenVersion: number; // For JWT invalidation
  
  // Profile
  profile: {
    name: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: 'nam' | 'nữ';
    location?: {
      province: string;
      district?: string;
    };
  };
  
  // Vietnamese-specific
  preferences: {
    language: 'vi' | 'en';
    timezone: 'Asia/Ho_Chi_Minh';
    astrologyMethod: 'bắc_phái' | 'nam_phái' | 'phổ_biến';
    dateFormat: 'solar' | 'lunar';
  };
  
  // Business logic
  tokens: {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
    transactions: ObjectId[]; // Reference to TokenTransaction
  };
  
  // System
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  isActive: boolean;
}
```

### Astrology Chart Schema
```typescript
interface AstrologyChart {
  _id: ObjectId;
  userId: ObjectId;
  
  // Birth information
  birthData: {
    solarDate: Date;
    lunarDate: {
      day: number;
      month: number;
      year: string; // Vietnamese year format
      isLeapMonth: boolean;
    };
    timeOfBirth: {
      hour: number;
      minute: number;
      traditionalHour: VietnameseHour; // Tý, Sửu, Dần, etc.
    };
    placeOfBirth: {
      province: string;
      latitude?: number;
      longitude?: number;
    };
    gender: 'nam' | 'nữ';
  };
  
  // Chart calculation results
  chartData: {
    // 12 palaces with Vietnamese names
    palaces: {
      mệnh: Palace;      // Life Palace
      huynh_đệ: Palace;  // Siblings Palace
      phu_thê: Palace;   // Marriage Palace
      tử_tức: Palace;    // Children Palace
      tài_bạch: Palace;  // Wealth Palace
      tật_ách: Palace;   // Health Palace
      thiên_di: Palace;  // Travel Palace
      nô_bộc: Palace;    // Friends Palace
      quan_lộc: Palace;  // Career Palace
      điền_trạch: Palace; // Property Palace
      phúc_đức: Palace;  // Happiness Palace
      phụ_mẫu: Palace;   // Parents Palace
    };
    
    // Star positions
    mainStars: StarPosition[]; // 14 main stars
    supportingStars: StarPosition[]; // Additional stars
    
    // Elements and cycles
    element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
    destiny: string; // Bản mệnh
    configuration: string; // Cục
  };
  
  // Metadata
  calculationMethod: 'bắc_phái' | 'nam_phái' | 'phổ_biến';
  version: string; // Algorithm version for future updates
  accuracy: number; // Confidence score
  
  // System
  createdAt: Date;
  lastViewed: Date;
  viewCount: number;
  isPublic: boolean;
}

interface Palace {
  name: string;
  vietnameseName: string;
  stars: string[];
  elements: string[];
  majorPeriod: number;
  minorPeriod: string;
  energy: 'Dương' | 'Âm' | 'Trung tính';
  significance: string; // Brief description
}

interface StarPosition {
  name: string;
  vietnameseName: string;
  palace: string;
  brightness: 'Miếu' | 'Vượng' | 'Đắc địa' | 'Bình' | 'Hãm' | 'Lạc';
  element: string;
  significance: string;
}
```

### Consultation Schema
```typescript
interface Consultation {
  _id: ObjectId;
  userId: ObjectId;
  chartId: ObjectId;
  
  // Session info
  sessionId: string; // For Socket.io room management
  status: 'active' | 'completed' | 'paused' | 'expired';
  type: 'real_time' | 'async';
  
  // Consultation data
  category: 'tổng_quan' | 'sự_nghiệp' | 'tình_duyên' | 'tài_lộc' | 'sức_khỏe' | 'gia_đình';
  messages: ConsultationMessage[];
  
  // AI context
  aiContext: {
    personalityInsights: string[];
    previousConsultations: ObjectId[];
    currentFocus: string;
    culturalContext: 'traditional' | 'modern' | 'mixed';
  };
  
  // Business
  tokenCost: {
    estimated: number;
    actual: number;
    breakdown: TokenCostBreakdown[];
  };
  
  // Quality metrics
  feedback: {
    rating?: number; // 1-5 stars
    comment?: string;
    helpful: boolean;
    culturallyAppropriate: boolean;
  };
  
  // System
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

interface ConsultationMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  messageType: 'text' | 'chart' | 'insight' | 'question';
  timestamp: Date;
  
  // AI-specific
  aiMetadata?: {
    model: string;
    tokens: number;
    confidence: number;
    processingTime: number;
  };
  
  // User-specific
  userMetadata?: {
    deviceType: 'mobile' | 'desktop';
    inputMethod: 'text' | 'voice';
  };
}
```

### Token Transaction Schema
```typescript
interface TokenTransaction {
  _id: ObjectId;
  userId: ObjectId;
  
  // Transaction details
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'expired';
  amount: number; // Positive for additions, negative for usage
  balanceBefore: number;
  balanceAfter: number;
  
  // Context
  reference: {
    type: 'consultation' | 'payment' | 'admin' | 'promotion';
    id: ObjectId; // Reference to related document
    description: string;
  };
  
  // Payment info (for purchases)
  payment?: {
    provider: 'momo' | 'vnpay' | 'zalopay';
    transactionId: string;
    amount: number; // VND
    exchangeRate: number; // VND per token
    status: 'pending' | 'completed' | 'failed' | 'refunded';
  };
  
  // System
  timestamp: Date;
  expiresAt?: Date; // For promotional tokens
  isReversible: boolean;
}
```

### Payment Schema
```typescript
interface Payment {
  _id: ObjectId;
  userId: ObjectId;
  
  // Payment details
  provider: 'momo' | 'vnpay' | 'zalopay';
  providerTransactionId: string;
  amount: number; // VND
  currency: 'VND';
  
  // Product info
  product: {
    type: 'token_package';
    packageId: string;
    tokenAmount: number;
    bonusTokens: number;
  };
  
  // Status tracking
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  webhookReceived: boolean;
  
  // Vietnamese compliance
  invoice: {
    required: boolean;
    details?: {
      companyName: string;
      taxId: string;
      address: string;
    };
  };
  
  // System
  createdAt: Date;
  completedAt?: Date;
  webhookData?: any; // Raw webhook payload for debugging
}
```

## API Design

### Authentication Endpoints
```typescript
// Vietnamese-adapted authentication
POST /api/auth/register
POST /api/auth/verify-phone
POST /api/auth/verify-email  
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Astrology Endpoints
```typescript
// Chart management
POST /api/charts/generate
GET  /api/charts
GET  /api/charts/:id
PUT  /api/charts/:id
DELETE /api/charts/:id

// Vietnamese calendar utilities
POST /api/charts/convert-date
GET  /api/charts/vietnamese-hours
GET  /api/charts/traditional-calendar/:year/:month
```

### Consultation Endpoints
```typescript
// AI consultation
POST /api/consultations
GET  /api/consultations
GET  /api/consultations/:id
POST /api/consultations/:id/messages
DELETE /api/consultations/:id

// Real-time chat (Socket.io events)
connect -> join consultation room
message -> send user message
ai_response -> receive AI response  
typing -> show AI is processing
disconnect -> leave consultation
```

### Payment Endpoints
```typescript
// Vietnamese payment integration
GET  /api/payments/packages
POST /api/payments/create-intent
POST /api/payments/webhook/momo
POST /api/payments/webhook/vnpay
POST /api/payments/webhook/zalopay
GET  /api/payments/history

// Token management
GET  /api/tokens/balance
GET  /api/tokens/transactions
POST /api/tokens/transfer (admin only)
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Access (30 min) + Refresh (7 days) token pair
- **Token Versioning**: Invalidate all tokens on password change
- **Rate Limiting**: 100 requests/minute per IP, 50 auth attempts/hour per IP
- **Input Validation**: Joi schemas for all inputs with Vietnamese formats
- **CORS Configuration**: Whitelist Vietnamese domains

### Data Protection
- **Password Security**: bcrypt with 12 rounds
- **Birth Data Encryption**: AES-256 encryption for sensitive astrology data
- **Session Security**: Secure HTTP-only cookies with SameSite
- **Database Security**: MongoDB authentication + TLS encryption

### Vietnamese Compliance
- **Data Locality**: Store Vietnamese user data in Vietnamese or ASEAN regions
- **Privacy**: Clear data usage policies in Vietnamese
- **Payment Security**: PCI DSS compliance for Vietnamese payment methods

## Performance Architecture

### Caching Strategy
```typescript
// Redis caching layers
interface CacheStrategy {
  // User sessions (TTL: 30 minutes)
  userSessions: 'redis:sessions:{userId}';
  
  // Chart calculations (TTL: 24 hours)
  chartResults: 'redis:charts:{birthDataHash}';
  
  // AI responses (TTL: 1 hour)
  aiResponses: 'redis:ai:{chartId}:{questionHash}';
  
  // Vietnamese calendar (TTL: 1 year)
  lunarCalendar: 'redis:calendar:{year}:{month}';
}
```

### Database Optimization
- **Indexes**: Compound indexes on userId + createdAt for time-series queries
- **Aggregation Pipeline**: Optimized queries for consultation analytics
- **Connection Pooling**: MongoDB connection pool (min: 5, max: 100)
- **Read Replicas**: Separate read/write operations for scalability

### CDN & Static Assets
- **Vietnamese CDN**: Use Vietnamese or regional CDN providers
- **Asset Optimization**: Image compression, lazy loading for mobile users
- **API Caching**: CloudFlare or local CDN for API responses

## Deployment Architecture

### Development Environment
```yaml
# Docker Compose Development
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - REACT_APP_API_URL=http://localhost:3001
      
  backend:
    build: ./backend
    ports: ["3001:3001"]
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/halinh-dev
      
  mongodb:
    image: mongo:6.0
    ports: ["27017:27017"]
    
  redis:
    image: redis:7.0
    ports: ["6379:6379"]
```

### Production Architecture
```yaml
# Kubernetes Production
kind: Deployment
metadata:
  name: halinh-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: halinh/backend:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Monitoring & Logging
- **Application Monitoring**: New Relic or DataDog for performance
- **Error Tracking**: Sentry for error monitoring and alerting
- **Logging**: Winston structured logging with Vietnamese timezone
- **Health Checks**: Kubernetes health checks for all services

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: All services designed for horizontal scaling
- **Load Balancing**: NGINX or cloud load balancers
- **Database Scaling**: MongoDB sharding by userId hash
- **Cache Scaling**: Redis Cluster for high availability

### Performance Targets
- **Page Load**: < 3 seconds on Vietnamese 4G networks
- **Chart Generation**: < 5 seconds for complex calculations
- **AI Response**: < 10 seconds for astrology consultation
- **Concurrent Users**: Support 1000+ simultaneous consultations

### Vietnamese Network Optimization
- **Regional Servers**: Deploy in Singapore/Vietnam regions
- **Mobile Optimization**: Minimize payload for Vietnamese mobile networks
- **Offline Support**: Service workers for consultation history access

This technical architecture provides a solid foundation for building a scalable, culturally appropriate Vietnamese astrology platform with modern AI integration and robust payment processing capabilities.