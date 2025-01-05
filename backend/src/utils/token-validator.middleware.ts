import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class TokenValidatorMiddleware implements NestMiddleware {
  private readonly centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.split(' ')[1];
      
      // Validate token with centralized auth service
      const response = await axios.post(`${this.centralizedAuthUrl}/auth/validate`, 
        { token }, 
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );

      // Check token validity
      if (!response.data.isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user information to request
      (req as any).user = response.data.user;

      next();
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
