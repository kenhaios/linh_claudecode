import 'dotenv/config';
import App from './app';
import { config, isDevelopment } from './config/environment';
import { database } from './config/database';
import { redis } from './config/redis';
import { logger, vietnameseLogger } from './utils/logger';

class Server {
  private app: App;
  private port: number;

  constructor() {
    this.app = new App();
    this.port = config.PORT;
  }

  public async start(): Promise<void> {
    try {
      // Connect to databases
      await this.connectDatabases();

      // Start the server
      this.app.getServer().listen(this.port, () => {
        vietnameseLogger.systemStart(this.port, config.NODE_ENV);
        
        logger.info('🚀 Ha Linh Vietnamese Astrology Server Started', {
          port: this.port,
          environment: config.NODE_ENV,
          apiVersion: config.API_VERSION,
          nodeVersion: process.version,
          vietnamese: {
            timezone: config.DEFAULT_TIMEZONE,
            locale: config.DEFAULT_LOCALE,
            currency: config.DEFAULT_CURRENCY,
          },
        });

        if (isDevelopment()) {
          this.logDevelopmentInfo();
        }
      });

      // Handle server errors
      this.app.getServer().on('error', (error: any) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        const bind = typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;

        switch (error.code) {
          case 'EACCES':
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
          case 'EADDRINUSE':
            logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
          default:
            throw error;
        }
      });

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async connectDatabases(): Promise<void> {
    try {
      // Connect to MongoDB
      logger.info('Connecting to databases...');
      
      await database.connect();
      logger.info('✅ MongoDB connected successfully');

      // Connect to Redis
      await redis.connect();
      logger.info('✅ Redis connected successfully');

      // Test database connections
      await this.testConnections();

    } catch (error) {
      logger.error('Failed to connect to databases:', error);
      throw error;
    }
  }

  private async testConnections(): Promise<void> {
    try {
      // Test MongoDB
      const dbHealth = await database.healthCheck();
      logger.info('MongoDB health check:', dbHealth);

      // Test Redis
      const redisHealth = await redis.healthCheck();
      logger.info('Redis health check:', redisHealth);

      // TODO: Test external services
      await this.testExternalServices();

    } catch (error) {
      logger.warn('Some health checks failed:', error);
      // Don't throw here as the server can still function with degraded services
    }
  }

  private async testExternalServices(): Promise<void> {
    try {
      // TODO: Test OpenAI API connection
      logger.info('Testing external services...');

      // Test OpenAI API (basic check)
      if (config.OPENAI_API_KEY) {
        logger.info('✅ OpenAI API key configured');
      } else {
        logger.warn('⚠️ OpenAI API key not configured');
      }

      // Test Vietnamese payment providers (basic configuration check)
      const paymentProviders = {
        momo: !!(config.MOMO_PARTNER_CODE && config.MOMO_ACCESS_KEY && config.MOMO_SECRET_KEY),
        vnpay: !!(config.VNPAY_TMN_CODE && config.VNPAY_HASH_SECRET),
        zalopay: !!(config.ZALOPAY_APP_ID && config.ZALOPAY_KEY1 && config.ZALOPAY_KEY2),
      };

      logger.info('Vietnamese payment providers configuration:', paymentProviders);

      const configuredProviders = Object.entries(paymentProviders)
        .filter(([_, configured]) => configured)
        .map(([provider, _]) => provider);

      if (configuredProviders.length > 0) {
        logger.info(`✅ Payment providers configured: ${configuredProviders.join(', ')}`);
      } else {
        logger.warn('⚠️ No payment providers configured');
      }

      // Test email configuration
      if (config.EMAIL_USER && config.EMAIL_CLIENT_ID) {
        logger.info('✅ Email service configured');
      } else {
        logger.warn('⚠️ Email service not properly configured');
      }

      // Test SMS configuration
      if (config.SMS_API_KEY && config.SMS_API_SECRET) {
        logger.info(`✅ SMS service configured (${config.SMS_PROVIDER})`);
      } else {
        logger.warn('⚠️ SMS service not configured');
      }

    } catch (error) {
      logger.error('External services test failed:', error);
    }
  }

  private logDevelopmentInfo(): void {
    const devInfo = {
      '🌐 Frontend URL': 'http://localhost:3000',
      '🔗 API Base URL': `http://localhost:${this.port}/api/${config.API_VERSION}`,
      '🏥 Health Check': `http://localhost:${this.port}/health`,
      '🔧 Socket.io Test': `http://localhost:${this.port}/socket.io/`,
      '📚 API Documentation': `http://localhost:${this.port}/api/docs`,
      '🇻🇳 Vietnamese Settings': {
        timezone: config.DEFAULT_TIMEZONE,
        locale: config.DEFAULT_LOCALE,
        currency: config.DEFAULT_CURRENCY,
      },
      '🔐 JWT Configuration': {
        accessTokenExpiry: config.JWT_EXPIRES_IN,
        refreshTokenExpiry: config.JWT_REFRESH_EXPIRES_IN,
      },
      '💰 Token Pricing (VND)': {
        basic: config.TOKEN_PRICE_BASIC.toLocaleString('vi-VN'),
        premium: config.TOKEN_PRICE_PREMIUM.toLocaleString('vi-VN'),
        vip: config.TOKEN_PRICE_VIP.toLocaleString('vi-VN'),
      },
      '🤖 AI Consultation Costs (Tokens)': {
        love: config.CONSULTATION_LOVE_COST,
        career: config.CONSULTATION_CAREER_COST,
        majorPeriod: config.CONSULTATION_MAJOR_PERIOD_COST,
        minorPeriod: config.CONSULTATION_MINOR_PERIOD_COST,
        health: config.CONSULTATION_HEALTH_COST,
        wealth: config.CONSULTATION_WEALTH_COST,
        overview: config.CONSULTATION_OVERVIEW_COST,
      },
    };

    console.log('\n='.repeat(80));
    console.log('🎯 HA LINH VIETNAMESE ASTROLOGY API - DEVELOPMENT MODE');
    console.log('='.repeat(80));
    
    Object.entries(devInfo).forEach(([key, value]) => {
      if (typeof value === 'object') {
        console.log(`${key}:`);
        Object.entries(value).forEach(([subKey, subValue]) => {
          console.log(`   ${subKey}: ${subValue}`);
        });
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    console.log('='.repeat(80));
    console.log('💡 Tips:');
    console.log('   - Use POST /api/v1/auth/register to create a test user');
    console.log('   - Use GET /health to check system status');
    console.log('   - Check logs in the logs/ directory');
    console.log('   - Vietnamese astrology features are ready for development');
    console.log('='.repeat(80) + '\n');
  }

  public async stop(): Promise<void> {
    try {
      logger.info('Stopping server...');

      // Close database connections
      await database.disconnect();
      await redis.disconnect();

      logger.info('Server stopped successfully');
    } catch (error) {
      logger.error('Error stopping server:', error);
    }
  }
}

// Create and start the server
const server = new Server();

// Start the server
server.start().catch((error) => {
  logger.error('Failed to start Ha Linh server:', error);
  process.exit(1);
});

export default server;