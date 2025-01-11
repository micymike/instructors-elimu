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
import axios from 'axios';

@Controller('api/settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);
  private readonly centralizedAuthUrl: string;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService
  ) {
    this.centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';
  }

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

      // Validate token with centralized auth service
      const response = await axios.post(`${this.centralizedAuthUrl}/auth/validate`, 
        { token }, 
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );
      
      // Check if token is valid
      if (!response.data.isValid) {
        throw new UnauthorizedException('Invalid token');
      }
      
      // Return user information from the token validation
      return response.data.user;
    } catch (error) {
      this.logger.error('Authentication error', error.stack);
      
      if (error.response) {
        // Error response from the auth service
        this.logger.error(`Auth service error: ${JSON.stringify(error.response.data)}`);
      }

      if (axios.isAxiosError(error)) {
        throw new UnauthorizedException('Token validation failed with external auth service');
      }

      throw error;
    }
  }
}
