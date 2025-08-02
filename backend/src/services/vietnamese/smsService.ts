// Vietnamese SMS Service for Ha Linh Astrology Platform
import axios from 'axios';
import { config } from '../../config/environment';

export class SendSMSService {
  private static readonly SMS_API_URL = 'https://api.stringee.com/v1/sms';
  private static readonly BRAND_NAME = 'HaLinh';

  /**
   * Send verification SMS to Vietnamese phone number
   */
  static async sendVerificationSMS(phone: string, token: string): Promise<void> {
    const vietnameseMessage = `[${this.BRAND_NAME}] Ma xac thuc tai khoan Ha Linh cua ban la: ${token}. Ma co hieu luc trong 10 phut. Khong chia se ma nay voi bat ky ai.`;

    try {
      await this.sendSMS(phone, vietnameseMessage);
    } catch (error) {
      console.error('Failed to send verification SMS:', error);
      throw new Error('Không thể gửi SMS xác thực');
    }
  }

  /**
   * Send password reset SMS to Vietnamese phone number
   */
  static async sendPasswordResetSMS(phone: string, token: string): Promise<void> {
    const vietnameseMessage = `[${this.BRAND_NAME}] Ma dat lai mat khau Ha Linh: ${token}. Ma co hieu luc trong 1 gio. Neu khong phai ban yeu cau, vui long bo qua tin nhan nay.`;

    try {
      await this.sendSMS(phone, vietnameseMessage);
    } catch (error) {
      console.error('Failed to send password reset SMS:', error);
      throw new Error('Không thể gửi SMS đặt lại mật khẩu');
    }
  }

  /**
   * Send welcome SMS after successful registration
   */
  static async sendWelcomeSMS(phone: string, userName: string): Promise<void> {
    const vietnameseMessage = `[${this.BRAND_NAME}] Chao mung ${userName} den voi Ha Linh - Tu vi Viet Nam! Tai khoan cua ban da duoc kich hoat thanh cong. Chuc ban co nhung trai nghiem tuyet voi!`;

    try {
      await this.sendSMS(phone, vietnameseMessage);
    } catch (error) {
      console.error('Failed to send welcome SMS:', error);
      // Don't throw error for welcome SMS failure
    }
  }

  /**
   * Send consultation reminder SMS
   */
  static async sendConsultationReminderSMS(phone: string, userName: string): Promise<void> {
    const vietnameseMessage = `[${this.BRAND_NAME}] Xin chao ${userName}! Ban co cau hoi tu vi can tu van? Hay tro chuyen voi AI cua chung toi de nhan loi khuyen chinh xac!`;

    try {
      await this.sendSMS(phone, vietnameseMessage);
    } catch (error) {
      console.error('Failed to send consultation reminder SMS:', error);
      // Don't throw error for reminder SMS failure
    }
  }

  /**
   * Send low token balance notification
   */
  static async sendLowTokenBalanceSMS(phone: string, userName: string, balance: number): Promise<void> {
    const vietnameseMessage = `[${this.BRAND_NAME}] ${userName} oi! So du token cua ban chi con ${balance}. Mua them token de tiep tuc su dung dich vu tu van AI.`;

    try {
      await this.sendSMS(phone, vietnameseMessage);
    } catch (error) {
      console.error('Failed to send low balance SMS:', error);
      // Don't throw error for notification SMS failure
    }
  }

  /**
   * Core SMS sending function using Stringee API (Vietnamese SMS provider)
   */
  private static async sendSMS(phone: string, message: string): Promise<void> {
    // Normalize Vietnamese phone number
    const normalizedPhone = this.normalizeVietnamesePhone(phone);
    
    if (!config.sms.apiKey) {
      throw new Error('SMS API key not configured');
    }

    try {
      const response = await axios.post(
        this.SMS_API_URL,
        {
          sms: [
            {
              from: this.BRAND_NAME,
              to: normalizedPhone,
              text: message,
              type: 1, // SMS type
            },
          ],
        },
        {
          headers: {
            'X-STRINGEE-AUTH': config.sms.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (response.data.r !== 0) {
        throw new Error(`SMS API error: ${response.data.message || 'Unknown error'}`);
      }

      console.log('SMS sent successfully to:', normalizedPhone);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('SMS API error:', error.response?.data || error.message);
        throw new Error('Lỗi kết nối với dịch vụ SMS');
      } else {
        console.error('Unexpected SMS error:', error);
        throw error;
      }
    }
  }

  /**
   * Alternative SMS sending using ESMS (Vietnamese SMS provider)
   */
  private static async sendSMSViaESMS(phone: string, message: string): Promise<void> {
    const normalizedPhone = this.normalizeVietnamesePhone(phone);
    
    if (!config.sms.esmsApiKey || !config.sms.esmsSecretKey) {
      throw new Error('ESMS credentials not configured');
    }

    try {
      const response = await axios.get('http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get', {
        params: {
          ApiKey: config.sms.esmsApiKey,
          SecretKey: config.sms.esmsSecretKey,
          Phone: normalizedPhone,
          Content: message,
          SmsType: 2, // Brand name SMS
          Brandname: this.BRAND_NAME,
        },
        timeout: 10000,
      });

      if (response.data.CodeResult !== '100') {
        throw new Error(`ESMS error: ${response.data.ErrorMessage || 'Unknown error'}`);
      }

      console.log('SMS sent successfully via ESMS to:', normalizedPhone);
    } catch (error) {
      console.error('ESMS error:', error);
      throw new Error('Lỗi gửi SMS qua ESMS');
    }
  }

  /**
   * Normalize Vietnamese phone number format
   */
  private static normalizeVietnamesePhone(phone: string): string {
    // Remove all non-digit characters
    let normalized = phone.replace(/\D/g, '');
    
    // Handle different Vietnamese phone formats
    if (normalized.startsWith('84')) {
      // Already in international format without +
      return normalized;
    } else if (normalized.startsWith('0')) {
      // Domestic format, convert to international
      return '84' + normalized.substring(1);
    } else if (normalized.length === 9) {
      // 9-digit format, add country code
      return '84' + normalized;
    }
    
    return normalized;
  }

  /**
   * Validate Vietnamese phone number
   */
  static validateVietnamesePhone(phone: string): boolean {
    const vietnamesePhoneRegex = /^(\+84|84|0)[3-9]\d{8}$/;
    return vietnamesePhoneRegex.test(phone);
  }

  /**
   * Generate Vietnamese OTP (6 digits)
   */
  static generateVietnameseOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check if phone number is Vietnamese mobile
   */
  static isVietnameseMobile(phone: string): boolean {
    const normalizedPhone = this.normalizeVietnamesePhone(phone);
    
    // Vietnamese mobile prefixes
    const mobileNetworks = [
      // Viettel
      '8496', '8497', '8498', '8486', '8432', '8433', '8434', '8435', '8436', '8437', '8438', '8439',
      // Vinaphone  
      '8491', '8494', '8483', '8484', '8485', '8481', '8482',
      // Mobifone
      '8490', '8493', '8470', '8479', '8477', '8476', '8478',
      // Vietnamobile
      '8492', '8456', '8458',
      // Gmobile
      '8459', '8499'
    ];
    
    return mobileNetworks.some(prefix => normalizedPhone.startsWith(prefix));
  }

  /**
   * Get Vietnamese mobile network name
   */
  static getVietnameseMobileNetwork(phone: string): string {
    const normalizedPhone = this.normalizeVietnamesePhone(phone);
    
    if (/^84(96|97|98|86|32|33|34|35|36|37|38|39)/.test(normalizedPhone)) {
      return 'Viettel';
    } else if (/^84(91|94|83|84|85|81|82)/.test(normalizedPhone)) {
      return 'Vinaphone';
    } else if (/^84(90|93|70|79|77|76|78)/.test(normalizedPhone)) {
      return 'Mobifone';
    } else if (/^84(92|56|58)/.test(normalizedPhone)) {
      return 'Vietnamobile';
    } else if (/^84(59|99)/.test(normalizedPhone)) {
      return 'Gmobile';
    }
    
    return 'Unknown';
  }

  /**
   * Check SMS sending rate limit for Vietnamese numbers
   */
  private static smsRateLimit = new Map<string, { count: number; resetTime: number }>();
  
  static checkVietnameseSMSRateLimit(phone: string): boolean {
    const normalizedPhone = this.normalizeVietnamesePhone(phone);
    const now = Date.now();
    const maxSMS = 5; // Maximum 5 SMS per hour
    const windowMs = 60 * 60 * 1000; // 1 hour
    
    const phoneLimit = this.smsRateLimit.get(normalizedPhone);
    
    if (!phoneLimit) {
      this.smsRateLimit.set(normalizedPhone, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (now > phoneLimit.resetTime) {
      // Reset the limit
      this.smsRateLimit.set(normalizedPhone, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (phoneLimit.count >= maxSMS) {
      return false; // Rate limit exceeded
    }
    
    phoneLimit.count++;
    return true;
  }
}