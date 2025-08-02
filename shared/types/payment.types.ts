// Shared payment and token management types for Ha Linh Vietnamese Astrology Application

// Token system types
export interface TokenTransaction {
  id: string;
  userId: string;
  
  // Transaction details
  type: TokenTransactionType;
  amount: number; // Positive for additions, negative for usage
  balanceBefore: number;
  balanceAfter: number;
  
  // Reference and context
  reference: TransactionReference;
  description: string;
  category: TokenCategory;
  
  // Payment information (for purchases)
  payment?: PaymentInfo;
  
  // Metadata
  timestamp: string;
  expiresAt?: string; // For promotional tokens
  isReversible: boolean;
  reversalDeadline?: string;
  
  // Status and validation
  status: TransactionStatus;
  verificationStatus: VerificationStatus;
  
  // Audit trail
  auditTrail: AuditEntry[];
}

export interface TransactionReference {
  type: ReferenceType;
  id: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentInfo {
  paymentId: string;
  provider: PaymentProvider;
  externalTransactionId: string;
  amount: number; // VND
  exchangeRate: number; // VND per token
  promotionalDiscount?: number;
  finalAmount: number;
}

export interface AuditEntry {
  action: AuditAction;
  timestamp: string;
  userId?: string;
  details: string;
  metadata?: Record<string, any>;
}

// Payment system types
export interface Payment {
  id: string;
  userId: string;
  
  // Payment details
  provider: PaymentProvider;
  providerTransactionId: string;
  amount: number; // VND
  currency: Currency;
  
  // Product information
  product: PurchaseProduct;
  
  // Status and tracking
  status: PaymentStatus;
  statusHistory: PaymentStatusChange[];
  
  // Processing information
  webhookReceived: boolean;
  webhookData?: any;
  processingTime?: number;
  
  // Vietnamese compliance
  invoice: InvoiceInfo;
  taxInfo: TaxInfo;
  
  // Timing
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiresAt: string;
  
  // Error handling
  errorCode?: PaymentErrorCode;
  errorMessage?: string;
  retryCount: number;
  
  // Refund information
  refund?: RefundInfo;
}

export interface PurchaseProduct {
  type: ProductType;
  packageId: string;
  name: string;
  description: string;
  tokenAmount: number;
  bonusTokens: number;
  originalPrice: number; // VND
  discountedPrice?: number; // VND
  discount?: DiscountInfo;
}

export interface DiscountInfo {
  type: DiscountType;
  code?: string;
  percentage?: number;
  fixedAmount?: number;
  description: string;
  validUntil?: string;
}

export interface PaymentStatusChange {
  fromStatus: PaymentStatus;
  toStatus: PaymentStatus;
  timestamp: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceInfo {
  required: boolean;
  invoiceNumber?: string;
  details?: CompanyInfo;
  vatAmount?: number;
  totalAmount?: number;
  issuedAt?: string;
}

export interface CompanyInfo {
  companyName: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface TaxInfo {
  vatRate: number; // Vietnamese VAT rate
  vatAmount: number;
  taxableAmount: number;
  exemptionReason?: string;
}

export interface RefundInfo {
  id: string;
  amount: number;
  reason: RefundReason;
  status: RefundStatus;
  requestedAt: string;
  processedAt?: string;
  refundMethod: RefundMethod;
  providerRefundId?: string;
}

// Token packages and pricing
export interface TokenPackage {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  
  // Token details
  tokens: number;
  bonusTokens: number;
  totalTokens: number;
  
  // Pricing
  price: number; // VND
  originalPrice: number; // VND
  discountPercentage?: number;
  pricePerToken: number; // VND per token
  
  // Features and benefits
  features: PackageFeature[];
  benefits: string[];
  
  // Availability and promotion
  isPopular: boolean;
  isBestValue: boolean;
  isLimitedTime: boolean;
  availableUntil?: string;
  
  // Restrictions
  maxPurchasesPerUser?: number;
  cooldownPeriod?: number; // hours
  prerequisites?: string[];
  
  // Metadata
  category: PackageCategory;
  targetAudience: TargetAudience;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PackageFeature {
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon?: string;
  isHighlight: boolean;
}

// User token management
export interface UserTokenBalance {
  userId: string;
  
  // Current balance
  balance: number;
  
  // Historical totals
  totalPurchased: number;
  totalUsed: number;
  totalExpired: number;
  totalRefunded: number;
  
  // Breakdown by category
  breakdown: TokenBreakdown;
  
  // Expiration tracking
  expiringTokens: ExpiringToken[];
  
  // Usage analytics
  usageStats: TokenUsageStats;
  
  // Last update
  lastUpdated: string;
  lastTransaction?: string;
}

export interface TokenBreakdown {
  purchased: number;
  promotional: number;
  bonus: number;
  referral: number;
  refunded: number;
}

export interface ExpiringToken {
  amount: number;
  expiresAt: string;
  source: TokenSource;
  isWarningShown: boolean;
}

export interface TokenUsageStats {
  averageDaily: number;
  averageWeekly: number;
  averageMonthly: number;
  mostUsedCategory: TokenCategory;
  usageByCategory: Record<TokenCategory, number>;
  peakUsageHours: number[];
  lastUsage: string;
}

// Payment providers (Vietnamese)
export interface PaymentProviderConfig {
  name: PaymentProvider;
  displayName: string;
  displayNameVi: string;
  logo: string;
  
  // Configuration
  isActive: boolean;
  isDefault: boolean;
  supportedCurrencies: Currency[];
  
  // Limits and fees
  minAmount: number; // VND
  maxAmount: number; // VND
  processingFee: number; // VND or percentage
  
  // Features
  supportsInstantPayment: boolean;
  supportsRecurring: boolean;
  supportsRefunds: boolean;
  
  // Vietnamese specific
  requiresVietnameseAccount: boolean;
  supportedBanks?: VietnameseBank[];
  
  // Processing times
  averageProcessingTime: number; // minutes
  maxProcessingTime: number; // minutes
}

// Enums and types
export type TokenTransactionType = 
  | 'purchase'      // Bought tokens
  | 'usage'         // Used tokens for service
  | 'refund'        // Refunded tokens
  | 'bonus'         // Bonus tokens from promotion
  | 'referral'      // Tokens from referral program
  | 'expired'       // Tokens that expired
  | 'adjustment'    // Manual adjustment by admin
  | 'transfer';     // Transfer between users (if supported)

export type TokenCategory = 
  | 'consultation_basic'      // Basic AI consultation
  | 'consultation_detailed'   // Detailed analysis
  | 'chart_generation'        // Chart creation
  | 'prediction_future'       // Future predictions
  | 'compatibility_analysis'  // Relationship compatibility
  | 'timing_advice'          // Timing recommendations
  | 'premium_features'       // Premium features access
  | 'extended_session'       // Extended consultation time
  | 'priority_support'       // Priority customer support
  | 'chart_export'          // Chart export/printing
  | 'other';                // Other services

export type ReferenceType = 
  | 'consultation'
  | 'payment'
  | 'admin_action'
  | 'promotion'
  | 'referral'
  | 'refund'
  | 'system_adjustment'
  | 'bonus_grant';

export type TransactionStatus = 
  | 'pending'       // Transaction initiated
  | 'processing'    // Being processed
  | 'completed'     // Successfully completed
  | 'failed'        // Failed to process
  | 'cancelled'     // Cancelled by user/system
  | 'reversed'      // Reversed/refunded
  | 'expired';      // Expired without completion

export type VerificationStatus = 
  | 'unverified'    // Not yet verified
  | 'verified'      // Verified and valid
  | 'suspicious'    // Flagged for review
  | 'fraudulent'    // Confirmed fraudulent
  | 'disputed';     // Under dispute

export type AuditAction = 
  | 'created'
  | 'updated'
  | 'cancelled'
  | 'refunded'
  | 'verified'
  | 'flagged'
  | 'resolved';

export type PaymentProvider = 
  | 'momo'          // MoMo e-wallet
  | 'vnpay'         // VNPay gateway
  | 'zalopay'       // ZaloPay
  | 'vietqr'        // VietQR banking
  | 'atm_card'      // Vietnamese ATM card
  | 'internet_banking' // Vietnamese internet banking
  | 'cash_card'     // Pre-paid cash card
  | 'bank_transfer'; // Manual bank transfer

export type Currency = 'VND'; // Vietnamese Dong

export type ProductType = 
  | 'token_package'
  | 'subscription'
  | 'one_time_service'
  | 'premium_upgrade';

export type PaymentStatus = 
  | 'pending'       // Payment initiated
  | 'processing'    // Being processed by provider
  | 'completed'     // Successfully completed
  | 'failed'        // Payment failed
  | 'cancelled'     // Cancelled by user
  | 'expired'       // Payment link expired
  | 'refunded'      // Refunded
  | 'disputed'      // Under dispute
  | 'chargeback';   // Chargeback initiated

export type PaymentErrorCode = 
  | 'INSUFFICIENT_FUNDS'
  | 'CARD_DECLINED'
  | 'EXPIRED_CARD'
  | 'INVALID_CARD'
  | 'PROCESSING_ERROR'
  | 'TIMEOUT'
  | 'FRAUD_DETECTED'
  | 'LIMIT_EXCEEDED'
  | 'PROVIDER_ERROR'
  | 'NETWORK_ERROR';

export type RefundReason = 
  | 'user_request'
  | 'service_issue'
  | 'duplicate_payment'
  | 'fraud_detected'
  | 'chargeback'
  | 'technical_error'
  | 'policy_violation';

export type RefundStatus = 
  | 'requested'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'failed';

export type RefundMethod = 
  | 'original_payment_method'
  | 'bank_transfer'
  | 'cash_refund'
  | 'store_credit';

export type PackageCategory = 
  | 'starter'       // For new users
  | 'standard'      // Regular users
  | 'premium'       // Heavy users
  | 'professional'  // Professional astrologers
  | 'promotional'   // Special promotions
  | 'seasonal';     // Seasonal offers

export type TargetAudience = 
  | 'new_users'
  | 'casual_users'
  | 'regular_users'
  | 'power_users'
  | 'professionals'
  | 'enterprises';

export type DiscountType = 
  | 'percentage'
  | 'fixed_amount'
  | 'buy_one_get_one'
  | 'bulk_discount'
  | 'loyalty_discount'
  | 'first_time_user'
  | 'referral_bonus'
  | 'seasonal_promotion';

export type TokenSource = 
  | 'purchase'
  | 'promotion'
  | 'bonus'
  | 'referral'
  | 'gift'
  | 'admin_grant';

export type VietnameseBank = 
  | 'Vietcombank'   // Ngân hàng Ngoại thương Việt Nam
  | 'VietinBank'    // Ngân hàng Công thương Việt Nam
  | 'BIDV'          // Ngân hàng Đầu tư và Phát triển Việt Nam
  | 'Agribank'      // Ngân hàng Nông nghiệp và Phát triển Nông thôn
  | 'Techcombank'   // Ngân hàng Kỹ thương Việt Nam
  | 'MBBank'        // Ngân hàng Quân đội
  | 'VPBank'        // Ngân hàng Việt Nam Thịnh vượng
  | 'ACB'           // Ngân hàng Á Châu
  | 'Sacombank'     // Ngân hàng TMCP Sài Gòn Thương Tín
  | 'TPBank'        // Ngân hàng Tiên Phong
  | 'HDBank'        // Ngân hàng Phát triển Nhà TPHCM
  | 'SHB'           // Ngân hàng Sài Gòn - Hà Nội
  | 'Eximbank'      // Ngân hàng Xuất Nhập khẩu Việt Nam
  | 'OCB'           // Ngân hàng Phương Đông
  | 'LienVietPostBank'; // Ngân hàng Bưu điện Liên Việt

// Payment request/response types
export interface PaymentRequest {
  packageId: string;
  provider: PaymentProvider;
  returnUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
  userInfo?: PaymentUserInfo;
  invoiceRequired?: boolean;
  invoiceInfo?: CompanyInfo;
}

export interface PaymentUserInfo {
  name: string;
  email?: string;
  phone?: string;
}

export interface PaymentResponse {
  paymentId: string;
  redirectUrl?: string;
  qrCode?: string;
  deeplink?: string;
  instructions?: string;
  expiresAt: string;
  status: PaymentStatus;
}

export interface WebhookPayload {
  provider: PaymentProvider;
  eventType: WebhookEventType;
  paymentId: string;
  externalTransactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  timestamp: string;
  signature: string;
  rawData: any;
}

export type WebhookEventType = 
  | 'payment_completed'
  | 'payment_failed'
  | 'payment_cancelled'
  | 'payment_refunded'
  | 'payment_disputed';

// Analytics and reporting
export interface PaymentAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  conversionRate: number;
  
  // By provider
  providerBreakdown: ProviderStats[];
  
  // By package
  packagePerformance: PackageStats[];
  
  // Time-based
  dailyStats: DailyStats[];
  monthlyStats: MonthlyStats[];
  
  // User behavior
  userSegmentation: UserSegmentStats[];
}

export interface ProviderStats {
  provider: PaymentProvider;
  totalRevenue: number;
  transactionCount: number;
  successRate: number;
  averageProcessingTime: number;
  userPreference: number; // percentage
}

export interface PackageStats {
  packageId: string;
  packageName: string;
  totalSold: number;
  totalRevenue: number;
  conversionRate: number;
  averageUserRating: number;
}

export interface DailyStats {
  date: string;
  revenue: number;
  transactions: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface MonthlyStats {
  month: string;
  revenue: number;
  transactions: number;
  topPackage: string;
  growthRate: number;
}

export interface UserSegmentStats {
  segment: TargetAudience;
  totalUsers: number;
  averageSpending: number;
  preferredPackage: string;
  retentionRate: number;
}

export default Payment;