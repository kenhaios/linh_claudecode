// Shared chat and consultation types for Ha Linh AI Astrology Application

// Core consultation types
export interface Consultation {
  id: string;
  userId: string;
  chartId: string;
  sessionId: string;
  
  // Consultation metadata
  category: ConsultationCategory;
  type: ConsultationType;
  status: ConsultationStatus;
  priority: ConsultationPriority;
  
  // Content and messages
  title: string;
  description?: string;
  messages: ConsultationMessage[];
  
  // AI context and configuration
  aiContext: AIContext;
  aiConfiguration: AIConfiguration;
  
  // Business logic
  tokenCost: TokenCost;
  timeTracking: TimeTracking;
  
  // Quality and feedback
  feedback?: ConsultationFeedback;
  rating?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiresAt: string;
  isArchived: boolean;
}

// Message system
export interface ConsultationMessage {
  id: string;
  consultationId: string;
  
  // Message content
  sender: MessageSender;
  content: string;
  messageType: MessageType;
  format: MessageFormat;
  
  // Attachments and media
  attachments?: MessageAttachment[];
  chartReferences?: ChartReference[];
  
  // AI-specific data
  aiMetadata?: AIMessageMetadata;
  
  // User interaction data
  userMetadata?: UserMessageMetadata;
  
  // Message state
  status: MessageStatus;
  isEdited: boolean;
  editHistory?: MessageEdit[];
  
  // Timestamps
  timestamp: string;
  readAt?: string;
  deliveredAt?: string;
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  preview?: string;
  metadata?: Record<string, any>;
}

export interface ChartReference {
  chartId: string;
  palaceName?: string;
  starName?: string;
  aspect?: string;
  highlightType: 'reference' | 'analysis' | 'prediction';
}

export interface AIMessageMetadata {
  model: string;
  tokens: number;
  confidence: number;
  processingTime: number;
  temperature: number;
  promptVersion: string;
  contextLength: number;
  responseType: AIResponseType;
  citations?: string[];
}

export interface UserMessageMetadata {
  deviceType: 'mobile' | 'desktop' | 'tablet';
  inputMethod: 'text' | 'voice' | 'image';
  language: 'vi' | 'en';
  sessionInfo: UserSessionInfo;
}

export interface UserSessionInfo {
  sessionDuration: number;
  messageCount: number;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
}

export interface MessageEdit {
  timestamp: string;
  originalContent: string;
  newContent: string;
  reason?: string;
}

// AI Context and Configuration
export interface AIContext {
  // Consultation context
  personalityInsights: PersonalityInsight[];
  previousConsultations: ConsultationReference[];
  currentFocus: LifeArea[];
  consultationGoals: string[];
  
  // Cultural and linguistic context
  culturalContext: CulturalContext;
  languagePreferences: LanguagePreferences;
  
  // Chart-specific context
  chartSummary: ChartSummary;
  relevantStars: StarContext[];
  currentLifePeriod: LifePeriodContext;
  
  // Conversation context
  conversationFlow: ConversationNode[];
  topicHistory: TopicHistory[];
  userPreferences: AIUserPreferences;
}

export interface AIConfiguration {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  responseStyle: ResponseStyle;
  expertise: ExpertiseLevel;
  safeguards: SafeguardSettings;
}

export interface PersonalityInsight {
  trait: PersonalityTrait;
  strength: number; // 0-10
  description: string;
  source: InsightSource;
}

export interface ConsultationReference {
  consultationId: string;
  category: ConsultationCategory;
  keyTopics: string[];
  outcomes: string[];
  timestamp: string;
}

export interface ChartSummary {
  dominantElements: string[];
  majorInfluences: string[];
  lifeThemes: string[];
  challenges: string[];
  strengths: string[];
  currentPeriod: string;
}

export interface StarContext {
  starName: string;
  palace: string;
  influence: StarInfluence;
  relevanceToQuery: number; // 0-10
  keyMeanings: string[];
}

export interface LifePeriodContext {
  majorPeriod: string;
  age: number;
  startYear: number;
  endYear: number;
  themes: string[];
  opportunities: string[];
  challenges: string[];
}

export interface ConversationNode {
  topic: string;
  timestamp: string;
  userIntent: UserIntent;
  aiResponse: string;
  confidence: number;
  followUpSuggestions: string[];
}

export interface TopicHistory {
  topic: string;
  frequency: number;
  lastDiscussed: string;
  userSatisfaction: number; // 0-10
  keyInsights: string[];
}

export interface AIUserPreferences {
  responseLength: 'brief' | 'moderate' | 'detailed';
  technicalLevel: 'basic' | 'intermediate' | 'advanced';
  culturalSensitivity: 'high' | 'medium' | 'low';
  personalityType: PersonalityType;
  communicationStyle: CommunicationStyle;
}

// Feedback and Quality
export interface ConsultationFeedback {
  overall: FeedbackRating;
  accuracy: FeedbackRating;
  helpfulness: FeedbackRating;
  culturalAppropriateness: FeedbackRating;
  responseTime: FeedbackRating;
  
  // Detailed feedback
  positiveAspects: string[];
  improvementAreas: string[];
  specificComments: string;
  
  // Structured feedback
  wouldRecommend: boolean;
  wouldUseAgain: boolean;
  satisfactionLevel: number; // 1-10
  
  // Metadata
  feedbackDate: string;
  feedbackVersion: string;
}

export interface FeedbackRating {
  score: number; // 1-5
  comment?: string;
}

// Token and Cost Management
export interface TokenCost {
  estimated: number;
  actual: number;
  breakdown: TokenCostBreakdown[];
  discounts?: TokenDiscount[];
  finalCost: number;
}

export interface TokenCostBreakdown {
  category: CostCategory;
  description: string;
  tokens: number;
  unitCost: number;
  totalCost: number;
}

export interface TokenDiscount {
  type: DiscountType;
  description: string;
  percentage?: number;
  fixedAmount?: number;
  appliedCost: number;
}

export interface TimeTracking {
  startTime: string;
  endTime?: string;
  totalDuration: number; // seconds
  activeTime: number; // seconds
  pausedTime: number; // seconds
  estimatedCompletion?: string;
}

// Enums and Types
export type ConsultationCategory = 
  | 'tổng_quan'     // General Overview
  | 'sự_nghiệp'     // Career
  | 'tình_duyên'    // Love & Relationships
  | 'tài_lộc'       // Wealth & Finance
  | 'sức_khỏe'      // Health
  | 'gia_đình'      // Family
  | 'học_hành'      // Education
  | 'du_lịch'       // Travel
  | 'bất_động_sản'  // Real Estate
  | 'đầu_tư'        // Investment
  | 'khác';         // Other

export type ConsultationType = 
  | 'real_time'     // Live chat
  | 'async'         // Asynchronous
  | 'scheduled'     // Scheduled session
  | 'follow_up'     // Follow-up consultation
  | 'emergency';    // Emergency/urgent

export type ConsultationStatus = 
  | 'pending'       // Waiting to start
  | 'active'        // Currently active
  | 'paused'        // Temporarily paused
  | 'completed'     // Finished successfully
  | 'cancelled'     // Cancelled by user
  | 'expired'       // Expired without completion
  | 'error';        // Error occurred

export type ConsultationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type MessageSender = 'user' | 'ai' | 'system' | 'moderator';

export type MessageType = 
  | 'text'          // Regular text message
  | 'question'      // Direct question
  | 'analysis'      // Analysis result
  | 'prediction'    // Future prediction
  | 'advice'        // Guidance/advice
  | 'chart_insight' // Chart interpretation
  | 'follow_up'     // Follow-up question
  | 'clarification' // Clarifying question
  | 'summary'       // Summary of discussion
  | 'system';       // System message

export type MessageFormat = 
  | 'plain_text'
  | 'markdown'
  | 'rich_text'
  | 'structured_data'
  | 'chart_data';

export type MessageStatus = 
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'processing';

export type AttachmentType = 
  | 'image'
  | 'document'
  | 'chart_export'
  | 'voice_note'
  | 'screenshot';

export type AIResponseType = 
  | 'direct_answer'
  | 'analysis'
  | 'prediction'
  | 'advice'
  | 'clarification_request'
  | 'follow_up_suggestion'
  | 'chart_interpretation'
  | 'cultural_context';

export type CulturalContext = 
  | 'traditional'   // Traditional Vietnamese approach
  | 'modern'        // Modern interpretation
  | 'balanced'      // Balance of both
  | 'western'       // Western psychological approach
  | 'regional';     // Specific regional variation

export type LanguagePreferences = {
  primary: 'vi' | 'en';
  terminology: 'traditional' | 'simplified' | 'mixed';
  formality: 'formal' | 'casual' | 'respectful';
  dialectVariant?: 'northern' | 'central' | 'southern';
};

export type AIModel = 
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'claude-3'
  | 'custom-vietnamese-model';

export type ResponseStyle = 
  | 'conversational'
  | 'professional'
  | 'empathetic'
  | 'analytical'
  | 'storytelling'
  | 'educational';

export type ExpertiseLevel = 
  | 'master'        // Expert level
  | 'experienced'   // Professional level
  | 'intermediate'  // Good knowledge
  | 'basic';        // Basic understanding

export interface SafeguardSettings {
  culturalSensitivity: boolean;
  harmfulContentFilter: boolean;
  accuracyWarnings: boolean;
  limitedAdviceDisclaimer: boolean;
  privacyProtection: boolean;
}

export type PersonalityTrait = 
  | 'analytical'
  | 'intuitive'
  | 'practical'
  | 'emotional'
  | 'social'
  | 'independent'
  | 'ambitious'
  | 'cautious'
  | 'creative'
  | 'traditional';

export type InsightSource = 
  | 'chart_analysis'
  | 'conversation_analysis'
  | 'previous_consultations'
  | 'user_profile'
  | 'behavioral_patterns';

export type UserIntent = 
  | 'seek_advice'
  | 'understand_chart'
  | 'predict_future'
  | 'solve_problem'
  | 'general_curiosity'
  | 'verify_information'
  | 'compare_options'
  | 'plan_timing';

export type PersonalityType = 
  | 'analytical'
  | 'creative'
  | 'practical'
  | 'intuitive'
  | 'social'
  | 'contemplative';

export type CommunicationStyle = 
  | 'direct'
  | 'diplomatic'
  | 'supportive'
  | 'detailed'
  | 'concise'
  | 'storytelling';

export type CostCategory = 
  | 'base_consultation'
  | 'extended_analysis'
  | 'prediction_request'
  | 'chart_generation'
  | 'follow_up_question'
  | 'premium_feature';

export type DiscountType = 
  | 'first_time_user'
  | 'loyalty_program'
  | 'package_deal'
  | 'promotional'
  | 'referral'
  | 'bulk_purchase';

export type LifeArea = 
  | 'career'
  | 'relationships'
  | 'health'
  | 'wealth'
  | 'family'
  | 'education'
  | 'travel'
  | 'property'
  | 'spirituality'
  | 'personal_growth';

export type StarInfluence = {
  positive: string[];
  negative: string[];
  neutral: string[];
  timing: string[];
};

// Real-time communication types
export interface SocketEvent {
  type: SocketEventType;
  consultationId: string;
  data: any;
  timestamp: string;
  userId?: string;
}

export type SocketEventType = 
  | 'join_consultation'
  | 'leave_consultation'
  | 'user_message'
  | 'ai_response'
  | 'user_typing'
  | 'ai_typing'
  | 'message_read'
  | 'consultation_status_change'
  | 'token_update'
  | 'error'
  | 'disconnect';

export interface TypingIndicator {
  isTyping: boolean;
  sender: MessageSender;
  timestamp: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastPing: string;
  reconnectAttempts: number;
  quality: ConnectionQuality;
}

export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor';

// Chat options and quick replies
export interface ChatOption {
  id: string;
  label: string;
  description?: string;
  tokenCost: number;
  category: ConsultationCategory;
  icon?: string;
  isRecommended?: boolean;
  prerequisites?: string[];
}

export interface QuickReply {
  id: string;
  text: string;
  intent: UserIntent;
  context?: string;
}

export interface SuggestedQuestion {
  question: string;
  category: ConsultationCategory;
  relevance: number; // 0-10
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTokens: number;
}

export default Consultation;