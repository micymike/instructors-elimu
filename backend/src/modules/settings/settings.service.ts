import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { UserSettings, UserSettingsDocument } from '../../schemas/user-settings.schema';
import { InstructorService } from '../../services/instructor.service';

@Injectable()
export class SettingsService {
  private readonly centralizedAuthUrl: string;

  constructor(
    @InjectModel(UserSettings.name) private userSettingsModel: Model<UserSettingsDocument>,
    private instructorService: InstructorService,
  ) {
    this.centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const response = await axios.post(`${this.centralizedAuthUrl}/auth/validate`, 
        { token }, 
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );
      
      if (!response.data.isValid) {
        throw new UnauthorizedException('Invalid token');
      }
      
      return response.data.user;
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
      return JSON.parse(payload) || {};
    } catch (error) {
      console.error('Token decoding error:', error);
      return {};
    }
  }

  async getSettings(token: string): Promise<any> {
    // Validate token and get user
    const user = await this.validateToken(token);
    const tokenPayload = this.decodeToken(token);
    const email = tokenPayload.email;

    // Fetch settings
    const settings = await this.userSettingsModel.findOne({ email });
    
    let userData = { firstName: '', lastName: '', profilePicture: '' };
    
    try {
      const instructor = await this.instructorService.getUserDetails(email);
      userData = {
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        profilePicture: instructor.profilePicture
      };
    } catch (error) {
      console.warn('User data not available:', error.message);
    }
    
    return { 
      ...settings?.toObject() || {}, 
      ...userData 
    };
  }

  async updateSettings(updateSettingsDto: any, token: string) {
    // Validate token and get user
    const user = await this.validateToken(token);
    const tokenPayload = this.decodeToken(token);
    const email = tokenPayload.email;

    // Update settings
    const updatedSettings = await this.userSettingsModel.findOneAndUpdate(
      { email }, 
      { $set: { ...updateSettingsDto, email } }, 
      { new: true, upsert: true }
    );
    
    return { 
      message: 'Settings updated successfully', 
      settings: updatedSettings 
    };
  }
}
