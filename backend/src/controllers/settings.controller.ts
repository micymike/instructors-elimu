import { 
  Controller, 
  Get, 
  Post,
  Body,
  Req, 
  Logger,
  UploadedFile,
  UseInterceptors,
  Query 
} from '@nestjs/common';
import { 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  async getUserSettings(
    @Req() req: ExpressRequest, 
    @Query('includeProfilePicture') includeProfilePicture?: boolean
  ) {
    try {
      // Log the incoming request details
      this.logger.log(`Incoming settings request headers: ${JSON.stringify(req.headers)}`);
      this.logger.log(`Include profile picture: ${includeProfilePicture}`);
      
      // Extract user information from the authenticated request
      const user = await this.authenticateRequest(req);
      
      this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
      
      // Fetch user settings
      const settings = await this.settingsService.getUserSettings(user.email, includeProfilePicture);
      
      return { 
        message: 'User settings retrieved successfully', 
        data: settings 
      };
    } catch (error) {
      this.logger.error('Error retrieving user settings', error.stack);
      
      throw error;
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', {
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async updateUserSettings(
    @Req() req: ExpressRequest, 
    @Body() settingsData: any,
    @UploadedFile() profilePicture?: Express.Multer.File
  ) {
    try {
      // Log the incoming request details
      this.logger.log(`Incoming update settings request headers: ${JSON.stringify(req.headers)}`);
      this.logger.log(`Incoming update settings data: ${JSON.stringify(settingsData)}`);
      
      // Extract user information from the authenticated request
      const user = await this.authenticateRequest(req);
      
      this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
      
      // Prepare settings data
      const updateData = {
        ...settingsData,
        profilePicture: profilePicture ? {
          originalName: profilePicture.originalname,
          mimetype: profilePicture.mimetype,
          buffer: profilePicture.buffer.toString('base64')
        } : undefined
      };
      
      // Update user settings
      const updatedSettings = await this.settingsService.updateUserSettings(
        user.email, 
        updateData
      );
      
      return { 
        message: 'User settings updated successfully', 
        data: updatedSettings 
      };
    } catch (error) {
      this.logger.error('Error updating user settings', error.stack);
      
      throw error;
    }
  }

  private async authenticateRequest(req: ExpressRequest): Promise<any> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization token');
    }

    try {
      // Extract token, handling both 'Bearer' and direct token scenarios
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;
      
      // Decode the token without verification first
      const decoded = jwt.decode(token) as any;
      
      if (!decoded) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Validate token expiration manually
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new UnauthorizedException('Token has expired');
      }

      // Validate required fields
      if (!decoded.email) {
        throw new UnauthorizedException('Token missing required fields');
      }

      this.logger.log('Token Decoded Successfully', { 
        email: decoded.email,
        isExpired: decoded.exp ? decoded.exp < currentTimestamp : false
      });

      return {
        id: decoded.sub || decoded.email,
        sub: decoded.sub || decoded.email,
        email: decoded.email,
        role: decoded.role || 'instructor'
      };
    } catch (error) {
      this.logger.error('Token Verification Failed', {
        error: error.message,
        name: error.name,
        stack: error.stack
      });

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
