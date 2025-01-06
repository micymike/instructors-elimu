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
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both frontend URLs
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-user-id'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600,
  });

  // Global prefix
  app.setGlobalPrefix('api');

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
    validationError: { target: false },
  }));

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
