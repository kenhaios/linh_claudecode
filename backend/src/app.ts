import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config, isDevelopment } from './config/environment';
import { logger, httpLogStream, vietnameseLogger } from './utils/logger';
import { globalErrorHandler, notFound } from './middleware/errorHandler';
import { sanitize } from './middleware/validation';

// Import route modules (to be created)
// import authRoutes from './routes/auth';
// import chartRoutes from './routes/charts';
// import chatRoutes from './routes/chat';
// import paymentRoutes from './routes/payments';

class App {
  public app: Application;
  public server: any;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.CORS_ORIGIN,
        credentials: config.CORS_CREDENTIALS,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSocketIO();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, postman, etc.)
        if (!origin) return callback(null, true);
        
        if (isDevelopment()) {
          return callback(null, true);
        }
        
        // In production, check against allowed origins
        const allowedOrigins = config.CORS_ORIGIN.split(',');
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: config.CORS_CREDENTIALS,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-Vietnamese-Timezone',
      ],
    }));

    // Request parsing middleware
    this.app.use(express.json({ 
      limit: '10mb',
      type: ['application/json', 'text/plain'],
    }));
    this.app.use(express.urlencoded({ 
      extended: true,
      limit: '10mb',
    }));

    // Compression middleware
    this.app.use(compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6,
    }));

    // Logging middleware
    if (isDevelopment()) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', { stream: httpLogStream }));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX_REQUESTS,
      message: {
        success: false,
        error: {
          message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau',
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: 429,
        },
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req, res) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/api/health';
      },
      onLimitReached: (req, res) => {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
        });
      },
    });

    this.app.use('/api/', limiter);

    // Input sanitization
    this.app.use(sanitize);

    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);

    // Vietnamese timezone middleware
    this.app.use((req, res, next) => {
      req.headers['x-vietnamese-timezone'] = config.DEFAULT_TIMEZONE;
      res.setHeader('X-Vietnamese-Timezone', config.DEFAULT_TIMEZONE);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', this.healthCheck);
    this.app.get('/api/health', this.healthCheck);

    // API routes
    const apiRouter = express.Router();

    // Mount route modules
    // apiRouter.use('/auth', authRoutes);
    // apiRouter.use('/charts', chartRoutes);
    // apiRouter.use('/chat', chatRoutes);
    // apiRouter.use('/payments', paymentRoutes);

    // Temporary placeholder routes
    apiRouter.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Ha Linh Vietnamese Astrology API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        timezone: config.DEFAULT_TIMEZONE,
      });
    });

    // Mount API router
    this.app.use(`/api/${config.API_VERSION}`, apiRouter);

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Chào mừng đến với Ha Linh Tử Vi API',
        description: 'API tư vấn tử vi Việt Nam với trí tuệ nhân tạo',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health',
      });
    });
  }

  private initializeSocketIO(): void {
    // Socket.io middleware for authentication
    this.io.use((socket, next) => {
      try {
        // TODO: Implement socket authentication
        // const token = socket.handshake.auth.token;
        // const user = authenticateSocket(token);
        // socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    // Socket.io connection handling
    this.io.on('connection', (socket) => {
      logger.info('Socket connected', {
        socketId: socket.id,
        userId: (socket as any).user?.id,
      });

      // Handle consultation room joining
      socket.on('join_consultation', (consultationId: string) => {
        socket.join(`consultation_${consultationId}`);
        logger.info('User joined consultation room', {
          socketId: socket.id,
          consultationId,
          userId: (socket as any).user?.id,
        });
      });

      // Handle leaving consultation room
      socket.on('leave_consultation', (consultationId: string) => {
        socket.leave(`consultation_${consultationId}`);
        logger.info('User left consultation room', {
          socketId: socket.id,
          consultationId,
          userId: (socket as any).user?.id,
        });
      });

      // Handle user messages
      socket.on('user_message', async (data: { consultationId: string; message: string }) => {
        try {
          // TODO: Process user message and get AI response
          logger.info('User message received', {
            socketId: socket.id,
            consultationId: data.consultationId,
            messageLength: data.message.length,
          });

          // Emit typing indicator
          socket.to(`consultation_${data.consultationId}`).emit('ai_typing', true);

          // TODO: Process with AI service
          // Temporary response
          setTimeout(() => {
            socket.to(`consultation_${data.consultationId}`).emit('ai_typing', false);
            socket.emit('ai_response', {
              consultationId: data.consultationId,
              message: 'Đây là phản hồi tạm thời từ AI. Chức năng này đang được phát triển.',
              timestamp: new Date().toISOString(),
            });
          }, 2000);

        } catch (error) {
          logger.error('Error processing user message:', error);
          socket.emit('error', {
            message: 'Có lỗi xảy ra khi xử lý tin nhắn',
            code: 'MESSAGE_PROCESSING_ERROR',
          });
        }
      });

      // Handle typing indicators
      socket.on('user_typing', (data: { consultationId: string; isTyping: boolean }) => {
        socket.to(`consultation_${data.consultationId}`).emit('user_typing', data.isTyping);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info('Socket disconnected', {
          socketId: socket.id,
          reason,
          userId: (socket as any).user?.id,
        });
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error('Socket error:', error);
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler - must be after all routes
    this.app.use(notFound);

    // Global error handler - must be last
    this.app.use(globalErrorHandler);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown('UNHANDLED_REJECTION');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle process termination signals
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  private healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      // TODO: Add database and Redis health checks
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        version: '1.0.0',
        services: {
          database: 'checking...', // Will be implemented with database
          redis: 'checking...', // Will be implemented with Redis
          ai: 'checking...', // Will be implemented with OpenAI
        },
        vietnamese: {
          timezone: config.DEFAULT_TIMEZONE,
          locale: config.DEFAULT_LOCALE,
          currency: config.DEFAULT_CURRENCY,
        },
      };

      res.json({
        success: true,
        data: health,
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Health check failed',
          statusCode: 500,
        },
      });
    }
  };

  private gracefulShutdown = (signal: string): void => {
    vietnameseLogger.systemShutdown(signal);
    
    this.server.close(() => {
      logger.info('HTTP server closed');
      
      // Close Socket.io
      this.io.close(() => {
        logger.info('Socket.io server closed');
        
        // TODO: Close database connections
        // TODO: Close Redis connections
        
        process.exit(0);
      });
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };

  public getApp(): Application {
    return this.app;
  }

  public getServer(): any {
    return this.server;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default App;