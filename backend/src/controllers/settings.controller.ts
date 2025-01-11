import { 
  Controller, 
  Get, 
  Post,
  Body,
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

@Controller('api/settings')
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

  @Post()
  async updateUserSettings(@Req() req: ExpressRequest, @Body() settingsData: any) {
    try {
      // Log the incoming request details
      this.logger.log(`Incoming update settings request headers: ${JSON.stringify(req.headers)}`);
      this.logger.log(`Incoming update settings data: ${JSON.stringify(settingsData)}`);
      
      // Extract user information from the authenticated request
      const user = await this.authenticateRequest(req);
      
      this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
      
      // Update user settings
      const updatedSettings = await this.settingsService.updateUserSettings(
        user.email, 
        settingsData
      );
      
      return { 
        message: 'User settings updated successfully', 
        data: updatedSettings 
      };
    } catch (error) {
      this.logger.error('Error updating user settings', error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized to update user settings');
      } else {
        throw new InternalServerErrorException('Failed to update user settings');
      }
    }
  }

  private async authenticateRequest(req: ExpressRequest): Promise<any> {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No authorization token provided');
      }

      // Remove 'Bearer ' prefix
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid authorization token format');
      }

      // Verify token using JWT secret from config
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new InternalServerErrorException('JWT secret not configured');
      }

      // Decode and verify the token
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Validate decoded token
      if (!decoded || !decoded.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return decoded;
    } catch (error) {
      this.logger.error('Authentication error', error.stack);
      
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw error;
    }
  }
}
