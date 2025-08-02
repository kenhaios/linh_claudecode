# Ha Linh - Vietnamese Astrology AI Website

🇻🇳 **Trang web AI tử vi Việt Nam** | **Vietnamese Astrology AI Platform**

[![Vietnamese](https://img.shields.io/badge/Language-Vietnamese-red.svg)](https://github.com/halinh-project)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

## 🌟 Overview | Tổng quan

Ha Linh is a modern Vietnamese astrology (Tử Vi Đẩu Số) platform that combines traditional Vietnamese fortune-telling with AI-powered consultations. Users can generate their astrology charts, chat with AI for personalized insights, and access authentic Vietnamese astrological wisdom.

**Ha Linh** là nền tảng tử vi Việt Nam hiện đại kết hợp giữa thuật xem số truyền thống và tư vấn AI. Người dùng có thể lập lá số tử vi, trò chuyện với AI để nhận lời khuyên cá nhân hóa và tiếp cận kiến thức tử vi Việt Nam chính thống.

## ✨ Features | Tính năng

### 🔮 Vietnamese Astrology | Tử Vi Việt Nam
- **Chart Generation** | **Lập lá số**: Complete Tử Vi Đẩu Số chart calculation
- **Lunar Calendar** | **Âm lịch**: Solar to lunar date conversion with traditional hours
- **12 Houses System** | **12 Cung**: Traditional Vietnamese astrology house system
- **Star Placement** | **An sao**: Accurate placement of major and minor stars

### 🤖 AI Consultation | Tư vấn AI
- **Real-time Chat** | **Trò chuyện thời gian thực**: Socket.io powered chat interface
- **Vietnamese Language Support** | **Hỗ trợ tiếng Việt**: Native Vietnamese AI responses
- **Contextual Advice** | **Tư vấn theo hoàn cảnh**: Personalized guidance based on charts
- **Multiple Categories** | **Nhiều chủ đề**: Love, career, health, finance consultations

### 💳 Payment & Tokens | Thanh toán & Token
- **Vietnamese Payment Methods** | **Phương thức thanh toán Việt Nam**: MoMo, VNPay, ZaloPay
- **Token System** | **Hệ thống token**: Credit-based consultation pricing
- **Secure Transactions** | **Giao dịch bảo mật**: Encrypted payment processing

### 🛡️ Security & Authentication | Bảo mật & Xác thực
- **JWT Authentication** | **Xác thực JWT**: Secure user sessions
- **Vietnamese Phone/Email** | **SĐT/Email Việt Nam**: Local format validation
- **Rate Limiting** | **Giới hạn tốc độ**: API protection and abuse prevention

## 🏗️ Architecture | Kiến trúc

```
ha-linh-tuvi/
├── 📁 backend/          # Node.js + Express API server
├── 📁 frontend/         # React + TypeScript client
├── 📁 shared/           # Shared TypeScript types
├── 📁 docker/           # Docker configuration
├── 📁 docs/             # Documentation
├── 📁 prompts/          # Development phase prompts
└── 📁 summaries/        # Phase completion summaries
```

## 🚀 Quick Start | Bắt đầu nhanh

### Prerequisites | Yêu cầu
- **Node.js** 18+ 
- **Docker** & **Docker Compose**
- **MongoDB** (via Docker)
- **Redis** (via Docker)

### Installation | Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/your-org/ha-linh-tuvi.git
cd ha-linh-tuvi
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit environment variables
nano backend/.env
nano frontend/.env
```

4. **Start development environment**
```bash
# Start all services with Docker
docker-compose up -d

# Or start individual services
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
npm run dev           # Both backend and frontend
```

5. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MongoDB Express**: http://localhost:8081
- **Redis Commander**: http://localhost:8082

## 🛠️ Development | Phát triển

### Commands | Lệnh

```bash
# Development
npm run dev                 # Start both backend and frontend
npm run dev:backend        # Start backend only
npm run dev:frontend       # Start frontend only

# Building
npm run build              # Build both projects
npm run build:backend      # Build backend only
npm run build:frontend     # Build frontend only

# Code Quality
npm run lint               # ESLint check
npm run lint:fix           # ESLint auto-fix
npm run format             # Prettier format
npm run format:check       # Prettier check
npm run type-check         # TypeScript check

# Testing
npm run test               # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # End-to-end tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Docker
npm run docker:up          # Start Docker services
npm run docker:down        # Stop Docker services
npm run docker:build       # Build Docker images
npm run docker:logs        # View logs
```

### Project Structure | Cấu trúc dự án

#### Backend Structure
```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   ├── astrology/   # Vietnamese astrology services
│   │   ├── openai/      # AI consultation services
│   │   └── vietnamese/  # Vietnamese-specific services
│   └── utils/           # Utility functions
├── tests/               # Test files
└── package.json
```

#### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── store/          # Redux store
│   ├── theme/          # Vietnamese theme
│   ├── utils/          # Utility functions
│   └── tests/          # Test files
├── public/             # Static assets
└── package.json
```

## 🔧 Configuration | Cấu hình

### Environment Variables | Biến môi trường

#### Backend (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/ha-linh-dev
REDIS_URL=redis://localhost:6379

# JWT Settings
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Vietnamese Settings
DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh
DEFAULT_LANGUAGE=vi

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4

# Vietnamese Payment Providers
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key

VNPAY_TMN_CODE=your-vnpay-tmn-code
VNPAY_HASH_SECRET=your-vnpay-hash-secret

ZALOPAY_APP_ID=your-zalopay-app-id
ZALOPAY_KEY1=your-zalopay-key1
ZALOPAY_KEY2=your-zalopay-key2
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_DEFAULT_LANGUAGE=vi
VITE_DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh
```

## 🧪 Testing | Kiểm thử

### Test Structure | Cấu trúc test
```
tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
├── e2e/               # End-to-end tests
├── mocks/             # Mock data and services
└── utils/             # Test utilities
```

### Running Tests | Chạy test
```bash
# All tests
npm run test

# Vietnamese astrology tests
npm run test backend/tests/unit/vietnamese-astrology.test.ts

# Frontend component tests  
npm run test frontend/src/tests/components/

# Coverage report
npm run test:coverage
```

## 🌐 API Documentation | Tài liệu API

### Authentication Endpoints
```
POST /api/auth/register          # User registration
POST /api/auth/login            # User login
POST /api/auth/refresh          # Refresh token
POST /api/auth/logout           # User logout
```

### Astrology Endpoints
```
POST /api/charts/generate       # Generate astrology chart
GET  /api/charts               # Get user's charts
GET  /api/charts/:id           # Get specific chart
DELETE /api/charts/:id         # Delete chart
```

### AI Consultation Endpoints
```
POST /api/consultations/ask     # Ask AI question
GET  /api/consultations        # Get consultation history
GET  /api/consultations/:id    # Get specific consultation
```

### Token & Payment Endpoints
```
GET  /api/tokens/balance        # Get token balance
POST /api/tokens/purchase       # Purchase tokens
GET  /api/payments/history      # Payment history
POST /api/payments/momo         # MoMo payment
POST /api/payments/vnpay        # VNPay payment
POST /api/payments/zalopay      # ZaloPay payment
```

## 🚀 Deployment | Triển khai

### Production Build | Build sản phẩm
```bash
# Build all projects
npm run build

# Build with Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup | Thiết lập môi trường
1. Set up production databases (MongoDB, Redis)
2. Configure environment variables
3. Set up Vietnamese payment provider accounts
4. Configure OpenAI API access
5. Set up SSL certificates
6. Configure domain and DNS

## 🤝 Contributing | Đóng góp

### Development Process | Quy trình phát triển
1. Fork the repository
2. Create feature branch (`git checkout -b feature/vietnamese-feature`)
3. Make changes with proper Vietnamese comments
4. Add tests for Vietnamese functionality
5. Run quality checks (`npm run lint`, `npm run test`)
6. Commit with conventional format (`feat(auth): thêm đăng nhập SĐT`)
7. Push and create Pull Request

### Code Style | Phong cách code
- Follow ESLint and Prettier configurations
- Use Vietnamese comments for cultural features
- Include Vietnamese test cases
- Document Vietnamese-specific functionality

### Vietnamese Cultural Guidelines | Hướng dẫn văn hóa Việt Nam
- Respect traditional astrology practices
- Use authentic Vietnamese terminology
- Consider cultural sensitivities
- Include proper Vietnamese language support

## 📝 License | Giấy phép

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Dự án này được cấp phép theo Giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.

---

## 🆘 Support | Hỗ trợ

- 📧 **Email**: support@halinh.vn
- 🌐 **Website**: https://halinh.vn
- 📱 **Zalo**: https://zalo.me/halinh
- 📞 **Hotline**: +84 (0) 123 456 789

## 👥 Authors | Tác giả

- **Ha Linh Team** - *Initial work* - [HaLinh](https://github.com/halinh-project)

---

<div align="center">
  <p>Made with ❤️ for Vietnamese astrology community</p>
  <p>Được tạo với ❤️ cho cộng đồng tử vi Việt Nam</p>
</div>