// Vietnamese Email Service for Ha Linh Astrology Platform
import nodemailer from 'nodemailer';
import { config } from '../../config/environment';
import { IUserDocument } from '../../models/User';

export class SendEmailService {
  private static transporter: nodemailer.Transporter;

  // Initialize the email transporter
  static initialize() {
    this.transporter = nodemailer.createTransporter({
      host: config.email.host || 'smtp.gmail.com',
      port: config.email.port || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  /**
   * Send email verification to Vietnamese user
   */
  static async sendVerificationEmail(user: IUserDocument, token: string): Promise<void> {
    if (!this.transporter) {
      this.initialize();
    }

    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}&email=${user.email}`;
    
    const vietnameseTemplate = {
      subject: '🌟 Xác thực tài khoản Ha Linh - Tử Vi Việt Nam',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác thực tài khoản Ha Linh</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              color: #fff;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .greeting {
              font-size: 18px;
              color: #d32f2f;
              margin-bottom: 20px;
            }
            .message {
              margin-bottom: 25px;
              line-height: 1.7;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              box-shadow: 0 4px 10px rgba(211, 47, 47, 0.3);
              transition: transform 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
              text-decoration: none;
              color: white;
            }
            .alternative {
              margin: 25px 0;
              padding: 15px;
              background: #f8f9fa;
              border-left: 4px solid #d32f2f;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              color: #fff;
              font-size: 14px;
              margin-top: 20px;
            }
            .vietnamese-elements {
              border-top: 3px solid #FFD700;
              border-bottom: 3px solid #FFD700;
              padding: 10px 0;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Ha Linh - Tử Vi Việt Nam</h1>
              <p>Nền tảng tử vi AI hàng đầu Việt Nam</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Xin chào ${user.name}! 👋
              </div>
              
              <div class="vietnamese-elements">
                <p><strong>🎋 Chào mừng bạn đến với Ha Linh! 🎋</strong></p>
              </div>
              
              <div class="message">
                <p>Cảm ơn bạn đã tham gia cộng đồng tử vi Việt Nam của chúng tôi. Để hoàn tất việc đăng ký và bắt đầu hành trình khám phá vận mệnh, vui lòng xác thực địa chỉ email của bạn.</p>
                
                <p>Với Ha Linh, bạn sẽ có thể:</p>
                <ul>
                  <li>🔮 Lập lá số tử vi chính xác theo truyền thống Việt Nam</li>
                  <li>🤖 Tư vấn AI thông minh bằng tiếng Việt</li>
                  <li>💫 Khám phá vận mệnh tình duyên, sự nghiệp, tài lộc</li>
                  <li>🌸 Nhận lời khuyên phù hợp với văn hóa Việt Nam</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">
                  ✨ Xác Thực Tài Khoản ✨
                </a>
              </div>
              
              <div class="alternative">
                <strong>Không thể nhấn nút trên?</strong><br>
                Vui lòng copy và dán đường link sau vào trình duyệt:<br>
                <a href="${verificationUrl}" style="color: #d32f2f; word-break: break-all;">${verificationUrl}</a>
              </div>
              
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
                <p><strong>Lưu ý quan trọng:</strong></p>
                <ul>
                  <li>Link xác thực có hiệu lực trong vòng 24 giờ</li>
                  <li>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email</li>
                  <li>Để được hỗ trợ, liên hệ: support@halinh.vn</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <div class="vietnamese-elements">
                <p>🏮 Chúc bạn an khang thịnh vượng! 🏮</p>
              </div>
              <p>© 2024 Ha Linh - Tử Vi Việt Nam. Tất cả quyền được bảo lưu.</p>
              <p>📧 support@halinh.vn | 📞 +84 123 456 789</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Xin chào ${user.name}!
        
        Chào mừng bạn đến với Ha Linh - Tử Vi Việt Nam!
        
        Để hoàn tất việc đăng ký, vui lòng xác thực email bằng cách truy cập:
        ${verificationUrl}
        
        Link có hiệu lực trong 24 giờ.
        
        Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email.
        
        Trân trọng,
        Đội ngũ Ha Linh
        support@halinh.vn
      `
    };

    await this.transporter.sendMail({
      from: `"Ha Linh - Tử Vi Việt Nam" <${config.email.user}>`,
      to: user.email,
      subject: vietnameseTemplate.subject,
      text: vietnameseTemplate.text,
      html: vietnameseTemplate.html,
    });
  }

  /**
   * Send password reset email to Vietnamese user
   */
  static async sendPasswordResetEmail(user: IUserDocument, token: string): Promise<void> {
    if (!this.transporter) {
      this.initialize();
    }

    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    
    const vietnameseTemplate = {
      subject: '🔐 Đặt lại mật khẩu Ha Linh - Tử Vi Việt Nam',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Đặt lại mật khẩu Ha Linh</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .header {
              text-align: center;
              color: #d32f2f;
              margin-bottom: 25px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h2>🔐 Đặt lại mật khẩu</h2>
              </div>
              
              <p>Xin chào ${user.name},</p>
              
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Ha Linh của bạn.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">
                  🔑 Đặt Lại Mật Khẩu
                </a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Lưu ý bảo mật:</strong>
                <ul>
                  <li>Link này có hiệu lực trong 1 giờ</li>
                  <li>Chỉ sử dụng nếu bạn thực sự yêu cầu đặt lại mật khẩu</li>
                  <li>Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này</li>
                </ul>
              </div>
              
              <p>Nếu cần hỗ trợ, liên hệ: support@halinh.vn</p>
              
              <p>Trân trọng,<br>Đội ngũ Ha Linh</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Xin chào ${user.name},
        
        Yêu cầu đặt lại mật khẩu cho tài khoản Ha Linh của bạn.
        
        Truy cập link sau để đặt lại mật khẩu:
        ${resetUrl}
        
        Link có hiệu lực trong 1 giờ.
        
        Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.
        
        Trân trọng,
        Đội ngũ Ha Linh
        support@halinh.vn
      `
    };

    await this.transporter.sendMail({
      from: `"Ha Linh - Tử Vi Việt Nam" <${config.email.user}>`,
      to: user.email,
      subject: vietnameseTemplate.subject,
      text: vietnameseTemplate.text,
      html: vietnameseTemplate.html,
    });
  }

  /**
   * Send welcome email after verification
   */
  static async sendWelcomeEmail(user: IUserDocument): Promise<void> {
    if (!this.transporter) {
      this.initialize();
    }

    const vietnameseTemplate = {
      subject: '🎉 Chào mừng đến với Ha Linh - Bắt đầu hành trình tử vi!',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .feature { margin: 15px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #d32f2f; }
            .button { background: #d32f2f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Chào mừng ${user.name}!</h1>
              <p>Tài khoản đã được xác thực thành công</p>
            </div>
            
            <div class="content">
              <p>Chúc mừng! Bạn đã chính thức trở thành thành viên của cộng đồng Ha Linh.</p>
              
              <div class="feature">
                <strong>🔮 Bước đầu tiên:</strong> Hãy tạo lá số tử vi đầu tiên của bạn
              </div>
              
              <div class="feature">
                <strong>🎁 Quà tặng chào mừng:</strong> 10 token miễn phí để tư vấn AI
              </div>
              
              <div style="text-align: center;">
                <a href="${config.frontendUrl}/dashboard" class="button">
                  Bắt Đầu Khám Phá
                </a>
              </div>
              
              <p>Chúc bạn có những trải nghiệm tuyệt vời với Ha Linh!</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail({
      from: `"Ha Linh - Tử Vi Việt Nam" <${config.email.user}>`,
      to: user.email,
      subject: vietnameseTemplate.subject,
      html: vietnameseTemplate.html,
    });
  }
}