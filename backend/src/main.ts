import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

class CustomIoAdapter extends IoAdapter {
  createIOServer(
    port: number, 
    options?: ServerOptions & { namespace?: string; server?: any }
  ) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'http://localhost:3000', 
          'http://localhost:3001', 
          'https://elimu-instructor-fr.onrender.com'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      }
    });

    // Authentication middleware for socket.io
    server.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        // Verify token using your authentication logic
        const user = await verifyToken(token);
        
        // Attach user to socket for later use
        (socket as any).user = user;
        next();
      } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    return server;
  }
}

interface CustomJwtPayload extends JwtPayload {
  email: string;
  id: string;
  role: string;
}

const verifyToken = (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY; // Ensure this matches the key used to sign the token
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with multiple origins
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'https://elimu-instructor-fr.onrender.com',
      'https://instructors-elimu.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-user-id'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600,
  });

  // Security middleware
  app.use(helmet());

  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Instructor Platform API')
    .setDescription('API for instructor course management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger at /api/docs endpoint
  SwaggerModule.setup('api/docs', app, document);

  // Session and Passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'fallback_secret',
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Use custom socket.io adapter
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  // Use dynamic port for Render
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
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
