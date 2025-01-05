import { Controller, Get, Post, Body, Req, UseInterceptors } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Request } from 'express';
import { TokenValidatorMiddleware } from '../../utils/token-validator.middleware';

@Controller('api/settings')
@UseInterceptors(TokenValidatorMiddleware)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Req() req: Request) {
    const token = req.headers.authorization as string;
    
    return {
      status: 'success',
      data: await this.settingsService.getSettings(token)
    };
  }

  @Post()
  async updateSettings(@Req() req: Request, @Body() settings: any) {
    const token = req.headers.authorization as string;
    
    return {
      status: 'success',
      data: await this.settingsService.updateSettings(settings, token)
    };
  }
}
