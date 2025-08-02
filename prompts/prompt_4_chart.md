# Phase 4: Vietnamese Astrology Chart Generation

## Objective
Implement the complete Vietnamese astrology chart generation system (An Sao Tử Vi) based on traditional algorithms, with accurate lunar calendar conversion and chart visualization.

## Prerequisites
- Phase 3 authentication system completed
- User models and database ready
- Vietnamese domain knowledge from Phase 1 research

## Tasks to Complete

### 1. Lunar Calendar Conversion System

#### Solar to Lunar Conversion Service
Create accurate date conversion system:

**Lunar Calendar Service (`src/services/LunarCalendarService.ts`)**
```typescript
interface LunarDate {
  day: number;
  month: number;
  year: string; // Vietnamese year (Giáp Tý, Ất Sửu, etc.)
  yearCycle: number; // 60-year cycle position
  isLeapMonth: boolean;
}

interface SolarToLunarInput {
  solarDate: Date;
  timezone: string; // Vietnam timezone
}

class LunarCalendarService {
  // Main conversion function
  static convertSolarToLunar(input: SolarToLunarInput): LunarDate
  
  // Helper functions
  static getVietnameseYear(year: number): string
  static getHeavenlyStem(year: number): string // Thiên Can
  static getEarthlyBranch(year: number): string // Địa Chi
  static calculateLeapMonth(lunarYear: number): number | null
  static getTraditionalHour(solarTime: string): string // 12 traditional hours
}
```

#### Time Conversion System
Implement traditional Vietnamese time system:

**Traditional Time Mapping**
```typescript
enum TraditionalHours {
  TY = "Tý (23g-1g)",
  SUU = "Sửu (1g-3g)", 
  DAN = "Dần (3g-5g)",
  MAO = "Mão (5g-7g)",
  THIN = "Thìn (7g-9g)",
  TI = "Tị (9g-11g)",
  NGO = "Ngọ (11g-13g)",
  MUI = "Mùi (13g-15g)",
  THAN = "Thân (15g-17g)",
  DAU = "Dậu (17g-19g)",
  TUAT = "Tuất (19g-21g)",
  HOI = "Hợi (21g-23g)"
}
```

### 2. Core Astrology Chart Generation

#### Chart Generation Service
Implement the complete An Sao algorithm:

**Chart Generation Service (`src/services/ChartGenerationService.ts`)**
```typescript
interface AstrologyChart {
  personalInfo: {
    name: string;
    gender: 'male' | 'female';
    solarBirth: Date;
    lunarBirth: LunarDate;
    traditionalHour: string;
  };
  configuration: {
    destiny: string; // Bản mệnh (Kim, Mộc, Thủy, Hỏa, Thổ)
    configuration: string; // Cục (Thủy Nhị, Mộc Tam, Kim Tứ, Thổ Ngũ, Hỏa Lục)
    destinyHouse: string; // Cung Mệnh
    bodyHouse: string; // Cung Thân
  };
  houses: {
    [houseName: string]: {
      name: string;
      position: number; // 1-12
      element: string; // Ngũ hành of the house
      mainStars: string[]; // Chính tinh
      supportStars: string[]; // Phụ tinh
      majorPeriods: number[]; // Đại vận
      minorPeriods: string[]; // Tiểu vận
      luckyStars: string[]; // Cát tinh
      unluckyStars: string[]; // Hung tinh
    }
  };
  starPositions: {
    [starName: string]: number; // House position (1-12)
  };
  periods: {
    currentMajorPeriod: number;
    currentMinorPeriod: string;
    majorPeriodAges: { [age: number]: number };
    minorPeriodAges: { [age: number]: string };
  };
}

class ChartGenerationService {
  // Main chart generation
  static async generateChart(userInfo: UserBirthInfo): Promise<AstrologyChart>
  
  // Step 1: Determine houses
  static determineDestinyHouse(lunarBirth: LunarDate): string
  static determineBodyHouse(lunarBirth: LunarDate): string
  static arrange12Houses(destinyHouse: string): { [key: string]: number }
  
  // Step 2: Determine configuration
  static determineConfiguration(destinyHouse: string, lunarYear: string): string
  
  // Step 3: Find destiny element
  static findDestinyElement(lunarYear: string): string
  
  // Step 4: Place Purple Star and 14 main stars
  static placePurpleStar(configuration: string, lunarDay: number): string
  static place14MainStars(purpleStarPosition: string): { [starName: string]: string }
  
  // Step 5: Place star cycles
  static placeLifeCycle(configuration: string, gender: string): { [starName: string]: string }
  static placeTaiSuiCycle(lunarYear: string): { [starName: string]: string }
  static placeLuckCycle(lunarYear: string, gender: string): { [starName: string]: string }
  
  // Step 6-9: Place remaining stars
  static placeStarsByHeavenlyStem(stem: string): { [starName: string]: string }
  static placeStarsByEarthlyBranch(branch: string): { [starName: string]: string }
  static placeStarsByMonth(lunarMonth: number): { [starName: string]: string }
  static placeStarsByHour(traditionalHour: string): { [starName: string]: string }
  
  // Step 10: Calculate periods
  static calculateMajorPeriods(destinyHouse: string, configuration: string, gender: string): { [age: number]: number }
  static calculateMinorPeriods(lunarYear: string): { [age: number]: string }
}
```

#### Star Database and Definitions
Create comprehensive star definitions:

**Star Database (`src/data/starsDatabase.ts`)**
```typescript
interface StarDefinition {
  name: string;
  vietnameseName: string;
  category: 'main' | 'support' | 'lucky' | 'unlucky';
  element: string;
  nature: 'positive' | 'negative' | 'neutral';
  meanings: {
    general: string;
    career: string;
    love: string;
    health: string;
    wealth: string;
  };
  compatibility: string[];
  conflicts: string[];
}

// 14 Main Stars (14 Chính Tinh)
const MAIN_STARS = {
  TU_VI: { name: 'Tử Vi', element: 'Thổ', nature: 'positive' },
  LIEM_TRINH: { name: 'Liêm Trinh', element: 'Hỏa', nature: 'positive' },
  DONG_LUONG: { name: 'Đồng Lương', element: 'Thổ', nature: 'positive' },
  // ... complete 14 main stars
};

// Support Stars (Phụ Tinh)
const SUPPORT_STARS = {
  VAN_XUONG: { name: 'Văn Xương', category: 'support', nature: 'positive' },
  VAN_KHUC: { name: 'Văn Khúc', category: 'support', nature: 'positive' },
  // ... complete support stars
};
```

### 3. Chart Visualization System

#### Backend Chart Data Service
Create chart data formatting service:

**Chart Data Service (`src/services/ChartDataService.ts`)**
```typescript
interface ChartVisualizationData {
  houses: HouseVisualization[];
  connections: StarConnection[];
  metadata: ChartMetadata;
}

interface HouseVisualization {
  position: number;
  name: string;
  element: string;
  stars: StarVisualization[];
  periods: PeriodVisualization;
  coordinates: { x: number; y: number };
}

class ChartDataService {
  static formatChartForVisualization(chart: AstrologyChart): ChartVisualizationData
  static calculateHousePositions(): { [position: number]: { x: number; y: number } }
  static generateStarColors(stars: string[]): { [starName: string]: string }
  static createElementMapping(): { [element: string]: { color: string; symbol: string } }
}
```

#### Frontend Chart Visualization
Create React chart visualization components:

**Chart Visualization Component (`src/components/charts/AstrologyChart.tsx`)**
```typescript
interface AstrologyChartProps {
  chartData: AstrologyChart;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  highlightHouse?: number;
  onHouseClick?: (housePosition: number) => void;
}

const AstrologyChart: React.FC<AstrologyChartProps> = ({
  chartData,
  size = 'medium',
  interactive = true,
  highlightHouse,
  onHouseClick
}) => {
  // Implementation using SVG or Canvas for traditional 4x3 grid layout
  // Each house shows:
  // - House name
  // - Main stars
  // - Support stars  
  // - Element indicators
  // - Period numbers
}
```

**Individual House Component (`src/components/charts/HouseCard.tsx`)**
```typescript
interface HouseCardProps {
  house: HouseVisualization;
  isHighlighted?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}
```

### 4. Chart Storage and Management

#### Chart Database Models
Create chart storage models:

**Chart Model (`src/models/Chart.ts`)**
```typescript
interface SavedChart {
  _id: ObjectId;
  userId: ObjectId;
  chartData: AstrologyChart;
  metadata: {
    name: string;
    description?: string;
    isPrivate: boolean;
    tags: string[];
    createdAt: Date;
    lastViewed: Date;
    viewCount: number;
  };
  analysis: {
    aiAnalysisCount: number;
    lastAnalysisDate?: Date;
    favoriteQuestions: string[];
  };
}
```

#### Chart Management Service
Create chart CRUD operations:

**Chart Service (`src/services/ChartService.ts`)**
```typescript
class ChartService {
  static async createChart(userId: string, birthInfo: UserBirthInfo): Promise<SavedChart>
  static async getUserCharts(userId: string): Promise<SavedChart[]>
  static async getChartById(chartId: string, userId: string): Promise<SavedChart>
  static async updateChart(chartId: string, updates: Partial<SavedChart>): Promise<SavedChart>
  static async deleteChart(chartId: string, userId: string): Promise<void>
  static async shareChart(chartId: string, shareSettings: ShareSettings): Promise<string>
}
```

### 5. API Implementation

#### Chart API Routes
Create comprehensive chart API:

**Chart Routes (`src/routes/charts.ts`)**
```typescript
// Chart generation and management
POST   /api/charts/generate     // Generate new chart
GET    /api/charts              // Get user's charts
GET    /api/charts/:id          // Get specific chart
PUT    /api/charts/:id          // Update chart
DELETE /api/charts/:id          // Delete chart
POST   /api/charts/:id/share    // Share chart

// Chart analysis endpoints
GET    /api/charts/:id/analysis // Get chart analysis data
POST   /api/charts/:id/analyze  // Request AI analysis (Phase 6)

// Utility endpoints
POST   /api/charts/convert-date // Solar to lunar conversion
GET    /api/charts/star-info/:starName // Get star information
```

#### Chart Controller Implementation
Create chart controllers:

**Chart Controller (`src/controllers/ChartController.ts`)**
```typescript
class ChartController {
  async generateChart(req: Request, res: Response): Promise<void>
  async getUserCharts(req: Request, res: Response): Promise<void>
  async getChart(req: Request, res: Response): Promise<void>
  async updateChart(req: Request, res: Response): Promise<void>
  async deleteChart(req: Request, res: Response): Promise<void>
  async shareChart(req: Request, res: Response): Promise<void>
  async convertSolarToLunar(req: Request, res: Response): Promise<void>
  async getStarInformation(req: Request, res: Response): Promise<void>
}
```

### 6. Frontend Chart Management

#### Chart Management Interface
Create chart management components:

**Chart List Component (`src/components/charts/ChartList.tsx`)**
- Display user's saved charts
- Chart creation button
- Chart preview cards
- Search and filter functionality
- Sorting options

**Chart Creation Form (`src/components/charts/CreateChart.tsx`)**
- Birth information input form
- Solar to lunar conversion preview
- Validation and error handling
- Chart generation loading state

**Chart Detail View (`src/components/charts/ChartDetail.tsx`)**
- Full chart visualization
- Chart information display
- Analysis history
- Share functionality
- Edit/delete options

#### Redux State Management
Set up chart state management:

**Chart Slice (`src/store/slices/chartSlice.ts`)**
```typescript
interface ChartState {
  charts: SavedChart[];
  currentChart: SavedChart | null;
  isLoading: boolean;
  error: string | null;
  generationProgress: number;
}
```

### 7. Validation and Error Handling

#### Birth Information Validation
Create comprehensive validation:

**Birth Info Validation (`src/validation/chartSchemas.ts`)**
```typescript
const birthInfoSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  gender: Joi.string().valid('male', 'female').required(),
  birthDate: Joi.date().required().max('now'),
  birthTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  timezone: Joi.string().default('Asia/Ho_Chi_Minh')
});
```

#### Chart Generation Error Handling
Implement error handling for chart generation:

**Error Types**
- Invalid birth date/time
- Lunar conversion errors
- Chart generation failures
- Database storage errors
- Visualization rendering errors

### 8. Testing Implementation

#### Unit Tests
Create comprehensive unit tests:

**Lunar Calendar Tests (`tests/unit/lunar-calendar.test.ts`)**
- Solar to lunar conversion accuracy
- Traditional hour conversion
- Edge cases (leap years, months)
- Timezone handling

**Chart Generation Tests (`tests/unit/chart-generation.test.ts`)**
- Star placement accuracy
- House determination correctness
- Period calculation validation
- Complete chart generation flow

#### Integration Tests
Create integration tests:

**Chart API Tests (`tests/integration/chart-api.test.ts`)**
- Chart creation workflow
- Chart retrieval and management
- Error handling scenarios
- Authentication integration

### 9. Performance Optimization

#### Caching Strategy
Implement caching for performance:

**Chart Caching (`src/services/CacheService.ts`)**
- Cache generated charts
- Cache lunar conversion results
- Cache star position calculations
- Redis-based caching implementation

#### Database Optimization
- Index chart queries efficiently
- Optimize chart storage format
- Implement pagination for chart lists
- Database query optimization

## Deliverables

### 1. Complete Chart Generation System
- Accurate lunar calendar conversion service
- Full Vietnamese astrology chart generation
- Traditional star placement algorithms
- Period calculation system

### 2. Chart Visualization
- Traditional 4x3 grid chart display
- Interactive house selection
- Star information tooltips
- Element color coding
- Mobile-responsive design

### 3. Chart Management System
- Chart creation and storage
- Chart listing and search
- Chart sharing functionality
- Chart editing capabilities

### 4. API Implementation
- Complete chart management API
- Birth information validation
- Error handling and logging
- Performance optimization

### 5. Frontend Interface
- Chart creation forms
- Chart visualization components
- Chart management interface
- Vietnamese language support

## Success Criteria

### Accuracy Requirements
- [ ] Solar to lunar conversion 100% accurate
- [ ] Star placement matches traditional methods
- [ ] Chart generation follows Vietnamese astrology rules
- [ ] Period calculations correct for all cases

### Performance Requirements
- [ ] Chart generation < 5 seconds
- [ ] Chart visualization loads < 2 seconds
- [ ] Lunar conversion < 1 second
- [ ] Database queries optimized

### User Experience Requirements
- [ ] Intuitive chart creation process
- [ ] Clear chart visualization
- [ ] Responsive design works on mobile
- [ ] Vietnamese language support complete
- [ ] Error messages helpful and clear

### Technical Requirements
- [ ] All chart APIs functional
- [ ] Database storage efficient
- [ ] Caching improves performance
- [ ] Error handling comprehensive
- [ ] Testing coverage > 80%

## Implementation Notes

### Vietnamese Astrology Accuracy
- Follow traditional algorithms exactly
- Validate against known chart examples
- Consult Vietnamese astrology experts
- Test with historical birth data

### Performance Considerations
- Cache frequently accessed data
- Optimize chart generation algorithms
- Use efficient database queries
- Implement progressive chart loading

### Cultural Considerations
- Use traditional Vietnamese terminology
- Respect cultural naming conventions
- Implement proper Vietnamese date formats
- Consider regional variations in interpretation

## Dependencies to Install

### Backend Dependencies
```bash
npm install moment-lunar date-fns-tz
npm install sharp canvas fabric
npm install node-cache redis
```

### Frontend Dependencies
```bash
npm install react-svg-pan-zoom d3 recharts
npm install date-fns moment
npm install html2canvas jspdf
```

## Estimated Time
4-5 days for complete chart generation system implementation