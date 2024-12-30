import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // Set memory limits
  const memoryLimit = 450 * 1024 * 1024; // 450MB
  process.on('warning', e => console.warn(e.stack));

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
    bodyParser: true,
  });

  // Configure body parser before other middleware
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // Enable compression
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  // Remove the global prefix

  // Add raw body logging middleware
  app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      console.log('Raw request body:', data);
    });
    next();
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false, // Allow non-whitelisted properties
    validateCustomDecorators: true,
    stopAtFirstError: true,
    enableDebugMessages: true, // Enable debug messages
    transformOptions: {
      enableImplicitConversion: true,
    },
    validationError: { target: false },
  }));

  // Increase payload size limit
  app.use(compression());
  const authMiddleware = require('../middleware/auth');
  app.use((req, res, next) => {
    console.log('Request URL:', req.url); // Add logging
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    if (req.body) console.log('Request Body:', req.body);
    
    if (
      req.url.startsWith('/api/courses') || 
      req.url.startsWith('/api/course-generation') || 
      req.url.startsWith('/api/auth/login') || 
      req.url.startsWith('/api/auth/register')
    ) {
      return next();
    }
    authMiddleware(req, res, next);
  });

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

bootstrap().catch(err => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
