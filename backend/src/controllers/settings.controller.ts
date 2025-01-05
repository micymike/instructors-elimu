import { 
  Controller, 
  Get, 
  Req, 
  UseGuards,
  Logger 
} from '@nestjs/common';
import { 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { ExpressRequest } from '../common/interfaces/express-request.interface';
import { SettingsService } from '../services/settings.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  async getUserSettings(@Req() req: ExpressRequest) {
    try {
      // Log the incoming request details
      this.logger.log(`Incoming settings request headers: ${JSON.stringify(req.headers)}`);
      
      // Extract user information from the authenticated request
      const user = await this.authenticateRequest(req);
      
      this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
      
      // Fetch user settings
      const settings = await this.settingsService.getUserSettings(user.email);
      
      return { 
        message: 'User settings retrieved successfully', 
        data: settings 
      };
    } catch (error) {
      this.logger.error('Error retrieving user settings', error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized to retrieve user settings');
      } else {
        throw new InternalServerErrorException('Failed to retrieve user settings');
      }
    }
  }

  // Method to authenticate the request (similar to other controllers)
  private async authenticateRequest(req: ExpressRequest) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      this.logger.error('Authorization header missing');
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      this.logger.error('Token missing');
      throw new UnauthorizedException('Token missing');
    }

    try {
      // Decode the token first to log its contents
      const decodedWithoutVerify = jwt.decode(token);
      this.logger.log(`Decoded Token (without verification): ${JSON.stringify(decodedWithoutVerify)}`);

      // Get the AUTH_SECRET from environment configuration
      const authSecret = this.configService.get<string>('AUTH_SECRET');

      if (!authSecret) {
        this.logger.error('AUTH_SECRET is not defined in environment');
        throw new UnauthorizedException('JWT configuration error');
      }

      const decoded = jwt.verify(token, authSecret) as any;
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (!decoded.email) {
        this.logger.error('Token missing required fields');
        throw new UnauthorizedException('Token missing required fields');
      }

      return {
        email: decoded.email,
        role: decoded.role || 'instructor'
      };
    } catch (error) {
      this.logger.error('Token Verification Failed', {
        error: error.message,
        name: error.name,
        stack: error.stack
      });
      
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token format');
      } else if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      
      throw new UnauthorizedException('Invalid token');
    }
  }
}
