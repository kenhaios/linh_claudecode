# Ha Linh - Vietnamese Astrology AI Website - Claude Code Instructions

## Project Overview
Build "Ha Linh" - a Vietnamese astrology (Tử Vi) website with AI chatbot integration, allowing users to input personal information, automatically generate astrology charts, and receive AI-powered consultations.

## Tech Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB 
- **AI Integration**: OpenAI GPT API
- **Authentication**: JWT
- **Payment**: Stripe
- **UI Library**: 21st.dev components (refer to https://deepwiki.com for documentation)
- **Date Conversion**: Vietnamese lunar/solar calendar conversion library

## External Resources Integration

### UI Framework - 21st.dev
**Resource**: https://deepwiki.com
**Instructions for Claude Code**: 
```
Before implementing any UI components, please fetch and study the 21st.dev documentation from https://deepwiki.com to understand:
- Component API and props
- Styling patterns and themes
- Best practices for responsive design
- Form components and validation patterns
- Layout components and grid systems

Use 21st.dev components consistently throughout the project for:
- Forms (user input, payment)
- Chat interface components
- Navigation and layout
- Data display (astrology chart visualization)
```

### Backend Framework Resources
**Additional Resources to Study**:
```
Please also reference these resources before implementing backend:
- Express.js best practices: https://expressjs.com/en/advanced/best-practice-security.html
- MongoDB schema design: https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
- JWT authentication patterns: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/
- OpenAI API best practices: https://platform.openai.com/docs/guides/production-best-practices
```

### Vietnamese Astrology Reference
**Domain Knowledge Resources**:
```
Study these Vietnamese astrology resources to understand the domain:
- Reference site: https://tuvi.cohoc.net (for UI/UX patterns and feature understanding)
- Algorithm reference: https://tuvi.cohoc.net/cach-an-sao-lap-thanh-la-so-tu-vi-tren-giay-nid-1664.html
- Understand the 12 houses (12 cung) system
- Learn about star placement algorithms (An Sao)
- Study Vietnamese lunar calendar conversion
```

## Project Structure
```
ha-linh-tuvi/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserForm/           # User info input
│   │   │   ├── ChartGeneration/    # Astrology chart creation
│   │   │   ├── ChatInterface/      # AI chat UI
│   │   │   ├── PaymentModule/      # Token purchase
│   │   │   └── TokenManager/       # Token balance management
│   │   ├── services/               # API calls
│   │   ├── utils/                  # Helper functions
│   │   └── types/                  # TypeScript definitions
├── backend/
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   ├── models/                 # Database models
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic
│   │   └── utils/                  # Helper functions
├── shared/
│   └── types/                      # Shared TypeScript types
└── docs/
```

## Core Features Implementation

### 1. User Information Input Module

**File: `frontend/src/components/UserForm/UserInfoForm.tsx`**

```typescript
interface UserInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date; // Solar calendar
  birthTime: string; // HH:mm format
  lunarBirthDate?: LunarDate; // Auto-converted
  lunarBirthTime?: string; // Vietnamese hours (Tý, Sửu, etc.)
}

interface LunarDate {
  day: number;
  month: number;
  year: string; // Vietnamese year format (Giáp Tý, Ất Sửu, etc.)
}
```

**Requirements:**
- Use 21st.dev form components for consistent styling
- Implement real-time solar to lunar calendar conversion
- Validate Vietnamese time format (12 traditional hours)
- Auto-save to localStorage for user convenience
- Responsive design for mobile devices

### 2. Astrology Chart Generation (An Sao Module)

**File: `backend/src/services/ChartGenerationService.ts`**

Based on algorithm from: https://tuvi.cohoc.net/cach-an-sao-lap-thanh-la-so-tu-vi-tren-giay-nid-1664.html

**Core functions to implement:**

```typescript
interface AstrologyChart {
  houses: {
    [key: string]: {
      name: string;
      stars: string[];
      element: string; // Five elements (Ngũ hành)
      majorPeriods: number[];
      minorPeriods: string[];
    }
  };
  destiny: string; // Bản mệnh
  configuration: string; // Cục
  personalInfo: UserInfo;
}

class ChartGenerationService {
  // 1. Determine Destiny House and Body House + 12 houses
  static determineDestinyHouse(userInfo: UserInfo): string;
  static determineBodyHouse(userInfo: UserInfo): string;
  static determine12Houses(destinyHouse: string): { [key: string]: string };

  // 2. Determine Configuration (Cục)
  static determineConfiguration(destinyHouse: string, birthYear: string): string;

  // 3. Find Destiny Element (Bản mệnh)
  static findDestinyElement(birthYear: string): string;

  // 4. Place Purple Star (Tử Vi) and 14 main stars
  static placePurpleStar(config: string, birthDay: number): string;
  static place14MainStars(purpleStarPosition: string): { [key: string]: string };

  // 5. Place star cycles
  static placeLifeCycle(config: string, gender: string): { [key: string]: string };
  static placeYearlyStars(birthYear: string): { [key: string]: string };
  static placeLuckStars(birthYear: string, gender: string): { [key: string]: string };

  // 6. Place stars by Heavenly Stem
  static placeStarsByHeavenlyStem(yearStem: string): { [key: string]: string };

  // 7. Place stars by Earthly Branch
  static placeStarsByEarthlyBranch(yearBranch: string): { [key: string]: string };

  // 8. Place stars by birth month
  static placeStarsByMonth(birthMonth: number): { [key: string]: string };

  // 9. Place stars by birth hour
  static placeStarsByHour(birthHour: string): { [key: string]: string };

  // Main function
  static generateChart(userInfo: UserInfo): AstrologyChart;
}
```

### 3. AI Chat Interface

**File: `frontend/src/components/ChatInterface/AstrologyChat.tsx`**

```typescript
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  options?: ChatOption[];
  timestamp: Date;
}

interface ChatOption {
  id: string;
  label: string;
  tokenCost: number;
  category: 'love' | 'career' | 'major-period' | 'minor-period' | 'health' | 'wealth';
}

interface AIResponse {
  content: string;
  nextOptions: ChatOption[];
  confidence: number;
}
```

**Requirements:**
- Use 21st.dev chat components for consistent UI
- Implement token cost display for each option
- Real-time token balance updates
- Message history persistence
- Loading states with elegant animations

### 4. AI Processing Service

**File: `backend/src/services/AIService.ts`**

```typescript
class AIService {
  static async analyzeChart(
    chart: AstrologyChart, 
    userChoice: string,
    chatHistory?: ChatMessage[]
  ): Promise<AIResponse> {
    const prompt = this.buildVietnameseAstrologyPrompt(chart, userChoice, chatHistory);
    
    // Call OpenAI API with Vietnamese astrology expertise
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: `You are a Vietnamese astrology master with 30+ years of experience in Tử Vi fortune telling. 
          You understand the intricate relationships between stars, houses, and life aspects.
          Provide detailed, culturally appropriate advice in Vietnamese.
          Always consider the interaction between:
          - Main stars and supporting stars in each house
          - Five elements relationships (sinh khắc)
          - Major and minor periods influence
          - Traditional Vietnamese cultural context`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      functions: [
        {
          name: "astrology_analysis",
          description: "Analyze Vietnamese astrology chart",
          parameters: {
            type: "object",
            properties: {
              analysis: { 
                type: "string",
                description: "Detailed analysis in Vietnamese"
              },
              confidence: { 
                type: "number",
                description: "Confidence level 0-1"
              },
              nextOptions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    category: { type: "string" },
                    tokenCost: { type: "number" }
                  }
                }
              }
            }
          }
        }
      ]
    });

    return this.parseAIResponse(response);
  }

  private static buildVietnameseAstrologyPrompt(
    chart: AstrologyChart, 
    userChoice: string, 
    history?: ChatMessage[]
  ): string {
    return `
    Vietnamese Astrology Chart Analysis:
    ${JSON.stringify(chart, null, 2)}
    
    User's Question/Choice: ${userChoice}
    
    Chat History: ${history ? JSON.stringify(history) : 'None'}
    
    Please analyze this chart focusing on traditional Vietnamese astrology principles:
    1. Star interactions and their meanings
    2. House relationships and life aspects
    3. Five elements balance and conflicts
    4. Current life period influences
    5. Practical advice for the queried aspect
    
    Provide response in Vietnamese with cultural sensitivity.
    `;
  }
}
```

### 5. Token Management System

**File: `backend/src/models/Token.ts`**

```typescript
interface TokenTransaction {
  userId: string;
  amount: number;
  type: 'purchase' | 'usage';
  category?: string;
  description: string;
  timestamp: Date;
}

interface UserToken {
  userId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  transactions: TokenTransaction[];
}
```

**Token Pricing Structure:**
```typescript
const TOKEN_PRICES = {
  'love': 10,          // Love & relationships
  'career': 15,        // Career & reputation
  'major-period': 20,  // Major life periods
  'minor-period': 15,  // Minor periods
  'health': 12,        // Health analysis
  'wealth': 18,        // Wealth & finance
  'overview': 25       // Complete overview
};
```

### 6. Payment Module

**File: `backend/src/services/PaymentService.ts`**

```typescript
interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number; // VND
  bonus?: number;
  popular?: boolean;
}

const TOKEN_PACKAGES: TokenPackage[] = [
  { 
    id: 'basic', 
    name: 'Basic Package', 
    tokens: 100, 
    price: 50000 // 50,000 VND
  },
  { 
    id: 'premium', 
    name: 'Premium Package', 
    tokens: 300, 
    price: 120000, // 120,000 VND
    bonus: 50 
  },
  { 
    id: 'vip', 
    name: 'VIP Package', 
    tokens: 500, 
    price: 180000, // 180,000 VND
    bonus: 100, 
    popular: true 
  }
];

class PaymentService {
  static async createStripePaymentIntent(packageId: string, userId: string): Promise<string>;
  static async handlePaymentWebhook(payload: any): Promise<void>;
  static async addTokensToUser(userId: string, amount: number): Promise<void>;
}
```

### 7. Database Schema Design

**User Schema:**
```typescript
interface User {
  _id: string;
  email: string;
  hashedPassword: string;
  profile: {
    name: string;
    phone?: string;
    birthInfo?: UserInfo;
  };
  tokens: {
    balance: number;
    transactions: TokenTransaction[];
  };
  chatHistory: ChatMessage[];
  savedCharts: string[]; // Chart IDs
  createdAt: Date;
  updatedAt: Date;
}
```

**Chart Schema:**
```typescript
interface SavedChart {
  _id: string;
  userId: string;
  chartData: AstrologyChart;
  name: string;
  createdAt: Date;
  lastAnalyzed: Date;
  analysisCount: number;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Astrology Charts
- `POST /api/charts/generate` - Generate chart from user info
- `GET /api/charts` - Get user's saved charts
- `GET /api/charts/:id` - Get specific chart
- `DELETE /api/charts/:id` - Delete chart
- `POST /api/charts/:id/analyze` - AI analysis request

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history/:chartId` - Get chat history for chart
- `DELETE /api/chat/history/:chartId` - Clear chat history

### Token Management
- `GET /api/tokens/balance` - Get current token balance
- `GET /api/tokens/transactions` - Get transaction history
- `GET /api/tokens/packages` - Get available token packages

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/webhook` - Handle Stripe webhooks
- `GET /api/payment/history` - Get payment history

## UI/UX Requirements with 21st.dev

### Main Landing Page
```typescript
// Use 21st.dev components for:
import { 
  Header, 
  Hero, 
  Card, 
  Button, 
  Form, 
  Grid 
} from '@21st-dev/ui';

// Header with logo "Ha Linh", navigation, user menu
// Hero section with compelling copy about astrology services
// Feature cards highlighting AI consultation
// Prominent user info form
// Testimonials section
// Footer with links and contact info
```

### Astrology Chart Display
```typescript
// Custom visualization component using 21st.dev base components
// 12 houses displayed in traditional 4x3 grid format
// Each house shows:
// - House name in Vietnamese
// - Main stars and supporting stars
// - Element color coding (Five elements)
// - Responsive design for mobile viewing
```

### Chat Interface
```typescript
// Use 21st.dev chat components:
import { 
  ChatContainer, 
  ChatMessage, 
  ChatInput, 
  Badge, 
  Button 
} from '@21st-dev/ui';

// Features:
// - Modern chat bubble design
// - Option buttons with token cost badges
// - Token balance indicator
// - Loading animations for AI responses
// - Message timestamps
// - Scroll to bottom functionality
```

### Payment Interface
```typescript
// Use 21st.dev form and payment components:
import { 
  PaymentForm, 
  PricingCard, 
  Modal, 
  Loading 
} from '@21st-dev/ui';

// Features:
// - Token package cards with pricing
// - Secure payment form
// - Payment success/failure modals
// - Receipt generation
// - Transaction history table
```

## Environment Configuration

### Development Environment
```bash
# Frontend (.env.local)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend (.env)
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ha-linh-dev
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production Environment
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-jwt-secret
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
1. **Week 1**: Project setup, basic authentication, user registration
2. **Week 2**: User info form with solar/lunar conversion
3. **Week 3**: Basic chart generation (core algorithm)
4. **Week 4**: Simple AI integration with OpenAI
5. **Week 5**: Basic token system and simple chat interface
6. **Week 6**: Testing and bug fixes

### Phase 2: Enhanced Features
1. **Week 7-8**: Complete chart generation algorithm
2. **Week 9**: Advanced chat interface with 21st.dev components
3. **Week 10**: Stripe payment integration
4. **Week 11**: Mobile responsive design
5. **Week 12**: Performance optimization

### Phase 3: Advanced Features
1. **Week 13**: Advanced AI prompting and responses
2. **Week 14**: Analytics dashboard for users
3. **Week 15**: SEO optimization and marketing pages
4. **Week 16**: Final testing and deployment

## Quality Assurance

### Testing Strategy
```typescript
// Unit Tests (Jest + React Testing Library)
- Chart generation algorithm accuracy
- Solar/lunar calendar conversion
- Token calculation logic
- API endpoint functionality

// Integration Tests
- Database operations
- Payment flow end-to-end
- AI service integration
- Authentication flow

// E2E Tests (Cypress)
- Complete user journey: registration → chart creation → AI consultation → payment
- Mobile responsive testing
- Payment processing
```

### Performance Requirements
- Page load time < 3 seconds
- Chart generation < 5 seconds
- AI response time < 10 seconds
- 99.9% uptime for payment processing
- Support 1000+ concurrent users

## Deployment Instructions

### Docker Configuration
```dockerfile
# Multi-stage build for production
# Separate containers for frontend/backend
# nginx reverse proxy configuration
# SSL certificates with Let's Encrypt
# Database backup automation
```

### Monitoring and Analytics
- Error tracking with Sentry
- Performance monitoring with New Relic
- User analytics with Google Analytics
- Business metrics dashboard
- Payment transaction monitoring

## Security Considerations
- Input validation and sanitization
- Rate limiting for API endpoints
- JWT token security best practices
- HTTPS enforcement
- Database query injection prevention
- User data encryption for sensitive information

---

## Getting Started Command

To begin development with Claude Code:

```bash
claude-code "Create the Ha Linh Vietnamese astrology website according to these specifications. Start by:

1. First, fetch and study the 21st.dev documentation from https://deepwiki.com to understand the UI component library
2. Reference https://tuvi.cohoc.net for Vietnamese astrology domain knowledge and UI patterns
3. Set up the project structure with React frontend and Node.js backend
4. Implement the UserInfoForm component using 21st.dev components
5. Create the basic chart generation service with lunar calendar conversion
6. Set up MongoDB models for users and charts

Focus on creating a solid foundation with proper TypeScript types and clean architecture. Prioritize the user information input flow and basic chart generation first."
```

This approach ensures Claude Code has all necessary context and external resources to build a professional Vietnamese astrology website with proper UI framework integration.