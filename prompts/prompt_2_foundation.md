# Phase 2: Foundation Setup

## Objective
Set up the complete project foundation including development environment, project structure, basic configurations, and essential tooling based on the research from Phase 1.

## Prerequisites
- Phase 1 research and analysis completed
- Architecture decisions documented
- Technology stack finalized

## Tasks to Complete

### 1. Project Structure Initialization

#### Root Project Setup
Create the complete project structure:
```
ha-linh-tuvi/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── types/
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── types/
│   │   ├── assets/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── shared/
│   ├── types/
│   └── utils/
├── docs/
├── prompts/
├── summaries/
├── docker-compose.yml
├── .gitignore
├── README.md
└── CLAUDE.md
```

#### Package Configuration Files
Create and configure:
- Root `package.json` with workspace configuration
- Backend `package.json` with all necessary dependencies
- Frontend `package.json` with React + TypeScript setup
- TypeScript configuration files for both backend and frontend
- ESLint and Prettier configurations
- Environment variable templates

### 2. Backend Foundation Setup

#### Core Dependencies Installation
Install and configure essential backend packages:
```bash
# Core framework
express
cors
helmet
compression

# TypeScript support
typescript
ts-node
@types/node
@types/express

# Database and ODM
mongoose
redis
ioredis

# Authentication and security
jsonwebtoken
bcryptjs
joi
express-rate-limit

# Real-time communication
socket.io

# Logging and monitoring
winston
morgan

# Development tools
nodemon
dotenv
```

#### Basic Server Setup
Create foundational server files:
- `src/app.ts` - Express application setup with middleware
- `src/server.ts` - Server initialization and startup
- `src/config/database.ts` - MongoDB connection configuration
- `src/config/redis.ts` - Redis connection setup
- `src/config/environment.ts` - Environment variables management
- `src/middleware/auth.ts` - JWT authentication middleware skeleton
- `src/middleware/validation.ts` - Request validation middleware
- `src/middleware/errorHandler.ts` - Global error handling

#### Basic Route Structure
Set up initial routing structure:
- `src/routes/index.ts` - Main router aggregation
- `src/routes/auth.ts` - Authentication routes skeleton
- `src/routes/charts.ts` - Astrology charts routes skeleton
- `src/routes/chat.ts` - Chat system routes skeleton
- `src/routes/payments.ts` - Payment system routes skeleton

### 3. Frontend Foundation Setup

#### React + TypeScript Setup
Initialize frontend with Vite:
```bash
npm create vite@latest frontend -- --template react-ts
```

#### Essential Dependencies
Install and configure frontend packages:
```bash
# UI Framework
@mui/material
@emotion/react
@emotion/styled
@mui/icons-material

# State Management
@reduxjs/toolkit
react-redux

# Routing
react-router-dom

# Forms
react-hook-form
@hookform/resolvers
yup

# HTTP Client
axios

# Real-time
socket.io-client

# Date handling
date-fns

# Charts
recharts

# Utilities
lodash
clsx
```

#### Component Structure Setup
Create initial component structure:
- `src/components/layout/` - Layout components
- `src/components/forms/` - Form components
- `src/components/charts/` - Astrology chart components
- `src/components/chat/` - Chat interface components
- `src/components/payment/` - Payment components
- `src/components/common/` - Shared utility components

#### Configuration Files
Set up essential configuration:
- `vite.config.ts` - Vite configuration with proxy setup
- `src/theme/` - Material-UI theme configuration
- `src/store/` - Redux store setup
- `src/services/api.ts` - Axios configuration with interceptors
- `src/utils/constants.ts` - Application constants

### 4. Shared Types and Utilities

#### TypeScript Type Definitions
Create shared type definitions in `shared/types/`:
- `auth.types.ts` - Authentication related types
- `chart.types.ts` - Astrology chart types
- `chat.types.ts` - Chat system types
- `payment.types.ts` - Payment and token types
- `api.types.ts` - API request/response types

#### Shared Utilities
Create shared utility functions in `shared/utils/`:
- `validation.ts` - Common validation functions
- `date.ts` - Date manipulation utilities
- `constants.ts` - Shared constants

### 5. Development Environment Configuration

#### Database Setup
Set up development databases:
- MongoDB instance (local or Docker)
- Redis instance (local or Docker)
- Database initialization scripts
- Sample data seeding scripts

#### Docker Configuration
Create Docker setup:
- `docker-compose.yml` for development environment
- Individual Dockerfiles for backend and frontend
- Environment variable configuration for containers
- Volume mounting for development

#### Development Scripts
Configure package.json scripts:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "test": "npm run test:backend && npm run test:frontend",
    "lint": "npm run lint:backend && npm run lint:frontend"
  }
}
```

### 6. Basic Testing Infrastructure

#### Backend Testing Setup
Configure testing environment:
- Jest configuration for unit tests
- Supertest for API testing
- Test database configuration
- Mock setup for external services

#### Frontend Testing Setup
Configure React testing:
- React Testing Library setup
- Jest configuration for frontend
- Component testing utilities
- Mock setup for API calls

### 7. Code Quality Tools

#### Linting and Formatting
Set up code quality tools:
- ESLint configuration for TypeScript
- Prettier configuration
- Husky for pre-commit hooks
- lint-staged for staged file linting

#### Git Configuration
Configure version control:
- `.gitignore` with comprehensive exclusions
- `.gitattributes` for consistent line endings
- Branch protection strategies
- Commit message conventions

### 8. Documentation Foundation

#### Technical Documentation
Create initial documentation:
- `README.md` with project overview and setup instructions
- `docs/api_documentation.md` skeleton
- `docs/deployment_guide.md` skeleton
- Code commenting standards

#### Development Guidelines
Document development practices:
- Coding standards and conventions
- Git workflow guidelines
- Testing practices
- Code review checklist

## Deliverables

### 1. Complete Project Structure
- Fully initialized project with all folders and basic files
- Properly configured package.json files with all dependencies
- Working development environment that can be started with `npm run dev`

### 2. Backend Foundation
- Express server with TypeScript running on specified port
- Database connections configured and tested
- Basic middleware setup (CORS, helmet, compression, logging)
- Route structure ready for implementation

### 3. Frontend Foundation
- React application with TypeScript running on development server
- Material-UI theme configured and working
- Redux store setup and connected
- Basic routing structure in place

### 4. Development Environment
- Docker configuration for consistent development
- Database instances running and accessible
- Testing infrastructure ready for use
- Code quality tools configured and working

### 5. Documentation
- Complete setup and development documentation
- API documentation structure ready
- Code standards and guidelines documented

## Success Criteria

### Technical Setup
- Both backend and frontend start without errors
- Database connections successful
- All linting and formatting tools working
- Docker environment functional

### Code Quality
- TypeScript compilation successful with no errors
- ESLint passing with configured rules
- Prettier formatting applied consistently
- Pre-commit hooks working correctly

### Development Workflow
- Clear development scripts and commands
- Easy setup process for new developers
- Comprehensive documentation for getting started
- Version control best practices implemented

## Testing Checklist

### Backend Testing
- [ ] Server starts on correct port
- [ ] MongoDB connection successful
- [ ] Redis connection successful
- [ ] Basic routes respond correctly
- [ ] Middleware functions properly
- [ ] Environment variables loaded correctly

### Frontend Testing
- [ ] React application loads without errors
- [ ] Material-UI components render correctly
- [ ] Redux store connected and functional
- [ ] Routing works for basic navigation
- [ ] API service configured and ready

### Development Environment
- [ ] Docker containers start successfully
- [ ] Hot reload working for both backend and frontend
- [ ] Database access from application
- [ ] Linting and formatting tools working
- [ ] Testing commands execute successfully

## Notes for Claude Code

- Follow the exact folder structure specified
- Use TypeScript consistently throughout the project
- Ensure all configurations are production-ready
- Set up proper error handling from the beginning
- Configure logging for debugging purposes
- Use environment variables for all configuration
- Follow security best practices in all setup
- Document any deviations from the plan

## Estimated Time
1-2 days for complete foundation setup