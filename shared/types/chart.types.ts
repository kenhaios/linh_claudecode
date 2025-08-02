// Shared Vietnamese astrology chart types for Ha Linh Application

// Birth data types
export interface BirthData {
  name: string;
  gender: VietnameseGender;
  solarDate: string; // ISO date string
  lunarDate?: LunarDate;
  timeOfBirth: TimeOfBirth;
  placeOfBirth: PlaceOfBirth;
  calculationMethod: AstrologyMethod;
}

export interface LunarDate {
  day: number;
  month: number;
  year: string; // Vietnamese year format (e.g., "Giáp Tý")
  isLeapMonth: boolean;
  cyclicalYear: CyclicalYear;
}

export interface CyclicalYear {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  element: WuxingElement;
  yinYang: YinYang;
}

export interface TimeOfBirth {
  hour: number; // 0-23
  minute: number; // 0-59
  traditionalHour: VietnameseHour;
  solarTerm?: SolarTerm;
}

export interface PlaceOfBirth {
  province: VietnameseProvince;
  district?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
}

// Vietnamese astrology chart structure
export interface AstrologyChart {
  id: string;
  userId: string;
  name: string;
  birthData: BirthData;
  chartData: ChartData;
  metadata: ChartMetadata;
  createdAt: string;
  updatedAt: string;
  lastViewed?: string;
  viewCount: number;
  isPublic: boolean;
}

export interface ChartData {
  palaces: { [key in PalaceName]: Palace };
  stars: StarPlacement[];
  elements: ElementalConfiguration;
  cycles: LifeCycleConfiguration;
  compatibility: CompatibilityData;
  predictions: PredictionData;
}

export interface ChartMetadata {
  version: string;
  calculationMethod: AstrologyMethod;
  accuracy: number; // confidence score 0-1
  generationTime: number; // milliseconds
  cacheKey: string;
}

// Palace system (12 cung)
export type PalaceName = 
  | 'mệnh'        // Life Palace
  | 'huynh_đệ'    // Siblings Palace
  | 'phu_thê'     // Marriage Palace
  | 'tử_tức'      // Children Palace
  | 'tài_bạch'    // Wealth Palace
  | 'tật_ách'     // Health Palace
  | 'thiên_di'    // Travel Palace
  | 'nô_bộc'      // Friends/Servants Palace
  | 'quan_lộc'    // Career Palace
  | 'điền_trạch'  // Property Palace
  | 'phúc_đức'    // Mental/Happiness Palace
  | 'phụ_mẫu';    // Parents Palace

export interface Palace {
  name: PalaceName;
  vietnameseName: string;
  englishName: string;
  position: ChartPosition;
  mainStars: StarName[];
  supportingStars: StarName[];
  element: WuxingElement;
  earthlyBranch: EarthlyBranch;
  majorPeriod: number;
  minorPeriod: string;
  energy: EnergyType;
  brightness: StarBrightness;
  significance: string;
  interpretation: string;
}

export interface ChartPosition {
  row: number; // 1-4
  col: number; // 1-3
  index: number; // 1-12
}

// Star system
export type StarName = MainStarName | SupportingStarName | SpecialStarName;

export type MainStarName = 
  | 'tử_vi'        // Purple Emperor
  | 'thiên_cơ'     // Heavenly Secret
  | 'thái_dương'   // Sun
  | 'vũ_khúc'      // Military Commander
  | 'thiên_đồng'   // Heavenly Unity
  | 'liêm_trinh'   // Pure Virtue
  | 'thiên_phủ'    // Southern Emperor
  | 'thái_âm'      // Moon
  | 'tham_lang'    // Greedy Wolf
  | 'cự_môn'       // Great Door
  | 'thiên_tướng'  // Heavenly Commander
  | 'thiên_lương'  // Heavenly Beam
  | 'thất_sát'     // Seven Killers
  | 'phá_quân';    // Army Destroyer

export type SupportingStarName = 
  | 'văn_xương'    // Literary Star
  | 'văn_khúc'     // Musical Star
  | 'tả_phụ'       // Left Assistant
  | 'hữu_bật'      // Right Assistant
  | 'thiên_khôi'   // Heavenly Leader
  | 'thiên_việt'   // Heavenly Halberd
  | 'hóa_lộc'      // Transform to Wealth
  | 'hóa_quyền'    // Transform to Authority
  | 'hóa_khoa'     // Transform to Achievement
  | 'hóa_kỵ';      // Transform to Taboo

export type SpecialStarName = 
  | 'lộc_tồn'      // Wealth Preservation
  | 'thiên_mã'     // Heavenly Horse
  | 'hồng_loan'    // Red Phoenix
  | 'thiên_hỉ'     // Heavenly Joy
  | 'đào_hoa'      // Peach Blossom
  | 'thiên_đức'    // Heavenly Virtue
  | 'quốc_ấn'      // National Seal
  | 'thai_tuế';    // Grand Duke

export interface StarPlacement {
  name: StarName;
  vietnameseName: string;
  englishName: string;
  palace: PalaceName;
  brightness: StarBrightness;
  element: WuxingElement;
  energy: EnergyType;
  influence: StarInfluence;
  interactions: StarInteraction[];
  meanings: StarMeaning[];
}

export type StarBrightness = 'miếu' | 'vượng' | 'đắc_địa' | 'bình' | 'hãm' | 'lạc';

export type EnergyType = 'dương' | 'âm' | 'trung_tính';

export interface StarInfluence {
  career: number;      // -5 to +5
  wealth: number;      // -5 to +5
  health: number;      // -5 to +5
  relationships: number; // -5 to +5
  family: number;      // -5 to +5
  education: number;   // -5 to +5
}

export interface StarInteraction {
  withStar: StarName;
  type: InteractionType;
  effect: InteractionEffect;
  strength: number; // 0-10
}

export type InteractionType = 'hợp' | 'xung' | 'hình' | 'hại' | 'phá' | 'tuyệt';

export interface InteractionEffect {
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  areas: LifeArea[];
}

export interface StarMeaning {
  aspect: LifeArea;
  interpretation: string;
  keywords: string[];
  advice: string;
}

// Five Elements system (Ngũ hành)
export type WuxingElement = 'kim' | 'mộc' | 'thủy' | 'hỏa' | 'thổ';

export interface ElementalConfiguration {
  dominant: WuxingElement;
  secondary: WuxingElement;
  weak: WuxingElement;
  balance: ElementBalance;
  interactions: ElementInteraction[];
}

export interface ElementBalance {
  kim: number;   // Metal
  mộc: number;   // Wood
  thủy: number;  // Water
  hỏa: number;   // Fire
  thổ: number;   // Earth
}

export interface ElementInteraction {
  from: WuxingElement;
  to: WuxingElement;
  type: ElementRelation;
  strength: number;
}

export type ElementRelation = 'sinh' | 'khắc' | 'đồng' | 'hỗ_trợ';

// Time cycles
export interface LifeCycleConfiguration {
  majorPeriods: MajorPeriod[];
  currentPeriod: MajorPeriod;
  minorPeriods: MinorPeriod[];
  currentMinorPeriod: MinorPeriod;
  transitions: PeriodTransition[];
}

export interface MajorPeriod {
  palace: PalaceName;
  startAge: number;
  endAge: number;
  element: WuxingElement;
  mainInfluences: string[];
  fortuneLevel: FortuneLevel;
  keyEvents: PredictedEvent[];
}

export interface MinorPeriod {
  year: number;
  earthlyBranch: EarthlyBranch;
  element: WuxingElement;
  fortuneLevel: FortuneLevel;
  monthlyInfluences: MonthlyInfluence[];
}

export interface MonthlyInfluence {
  month: number;
  lunarMonth: number;
  influence: LifeArea;
  trend: TrendDirection;
  advice: string;
}

export interface PeriodTransition {
  fromPeriod: string;
  toPeriod: string;
  transitionAge: number;
  challenges: string[];
  opportunities: string[];
  preparation: string[];
}

// Vietnamese time system
export type VietnameseHour = 
  | 'tý'   // 23:00-01:00
  | 'sửu'  // 01:00-03:00
  | 'dần'  // 03:00-05:00
  | 'mão'  // 05:00-07:00
  | 'thìn' // 07:00-09:00
  | 'tỵ'   // 09:00-11:00
  | 'ngọ'  // 11:00-13:00
  | 'mùi'  // 13:00-15:00
  | 'thân' // 15:00-17:00
  | 'dậu'  // 17:00-19:00
  | 'tuất' // 19:00-21:00
  | 'hợi'; // 21:00-23:00

export type HeavenlyStem = 
  | 'giáp' | 'ất' | 'bính' | 'đinh' | 'mậu' 
  | 'kỷ' | 'canh' | 'tân' | 'nhâm' | 'quý';

export type EarthlyBranch = 
  | 'tý' | 'sửu' | 'dần' | 'mão' | 'thìn' | 'tỵ'
  | 'ngọ' | 'mùi' | 'thân' | 'dậu' | 'tuất' | 'hợi';

export type YinYang = 'âm' | 'dương';

export type SolarTerm = 
  | 'lập_xuân' | 'vũ_thủy' | 'kinh_trập' | 'xuân_phân'
  | 'thanh_minh' | 'cốc_vũ' | 'lập_hạ' | 'tiểu_mãn'
  | 'mang_chủng' | 'hạ_chí' | 'tiểu_thử' | 'đại_thử'
  | 'lập_thu' | 'xử_thử' | 'bạch_lộ' | 'thu_phân'
  | 'hàn_lộ' | 'sương_giáng' | 'lập_đông' | 'tiểu_tuyết'
  | 'đại_tuyết' | 'đông_chí' | 'tiểu_hàn' | 'đại_hàn';

// Compatibility and relationships
export interface CompatibilityData {
  bestMatches: CompatibilityMatch[];
  challengingMatches: CompatibilityMatch[];
  recommendations: RelationshipAdvice[];
}

export interface CompatibilityMatch {
  type: RelationshipType;
  characteristics: string[];
  compatibility: number; // 0-100
  elements: WuxingElement[];
  advice: string;
}

export type RelationshipType = 
  | 'romantic' | 'marriage' | 'friendship' | 'business' 
  | 'family' | 'mentor' | 'colleague';

export interface RelationshipAdvice {
  area: LifeArea;
  advice: string;
  timing: TimingAdvice[];
  warnings: string[];
}

export interface TimingAdvice {
  period: string;
  suitability: number; // 0-10
  recommendations: string[];
}

// Predictions and fortune telling
export interface PredictionData {
  shortTerm: Prediction[];    // 1 year
  mediumTerm: Prediction[];   // 3-5 years
  longTerm: Prediction[];     // 10+ years
  lifeEvents: LifeEvent[];
  fortuneRanking: FortuneRanking;
}

export interface Prediction {
  timeframe: TimeFrame;
  area: LifeArea;
  prediction: string;
  probability: number; // 0-100
  influences: StarName[];
  advice: string;
  precautions: string[];
}

export interface LifeEvent {
  age: number;
  event: string;
  likelihood: number; // 0-100
  category: LifeEventCategory;
  preparation: string[];
}

export interface FortuneRanking {
  overall: FortuneLevel;
  career: FortuneLevel;
  wealth: FortuneLevel;
  health: FortuneLevel;
  relationships: FortuneLevel;
  family: FortuneLevel;
  education: FortuneLevel;
}

// Enums and utility types
export type LifeArea = 
  | 'career' | 'wealth' | 'health' | 'relationships' 
  | 'family' | 'education' | 'travel' | 'property';

export type FortuneLevel = 
  | 'excellent' | 'good' | 'average' | 'challenging' | 'difficult';

export type TrendDirection = 'improving' | 'stable' | 'declining' | 'volatile';

export type TimeFrame = 'current' | 'next_month' | 'next_season' | 'next_year';

export type LifeEventCategory = 
  | 'career_change' | 'marriage' | 'childbirth' | 'property_acquisition'
  | 'health_issue' | 'financial_gain' | 'travel' | 'education';

export type AstrologyMethod = 'bắc_phái' | 'nam_phái' | 'phổ_biến';

export type VietnameseGender = 'nam' | 'nữ';

export type VietnameseProvince = string; // Reuse from auth.types.ts

// Chart generation and analysis
export interface ChartGenerationRequest {
  birthData: BirthData;
  options: ChartGenerationOptions;
}

export interface ChartGenerationOptions {
  method: AstrologyMethod;
  includeMinorStars: boolean;
  includePredictions: boolean;
  includeCompatibility: boolean;
  detailLevel: 'basic' | 'standard' | 'detailed';
  language: 'vi' | 'en';
}

export interface ChartAnalysisRequest {
  chartId: string;
  analysisType: AnalysisType[];
  focusAreas?: LifeArea[];
  timeframe?: TimeFrame;
}

export type AnalysisType = 
  | 'personality' | 'career' | 'wealth' | 'health' 
  | 'relationships' | 'timing' | 'compatibility';

export interface ChartAnalysisResult {
  summary: string;
  detailedAnalysis: AnalysisSection[];
  recommendations: string[];
  warnings: string[];
  confidence: number;
}

export interface AnalysisSection {
  title: string;
  content: string;
  importance: number; // 1-10
  category: LifeArea;
  keyPoints: string[];
}

export default AstrologyChart;