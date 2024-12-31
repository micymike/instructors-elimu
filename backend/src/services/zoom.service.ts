import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { AxiosError } from 'axios';

interface ZoomApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

@Injectable()
export class ZoomService implements OnModuleInit {
  private accountId!: string;
  private clientId!: string;
  private clientSecret!: string;
  private accessToken!: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    const accountId = this.configService.get<string>('ZOOM_ACCOUNT_ID');
    const clientId = this.configService.get<string>('ZOOM_CLIENT_ID');
    const clientSecret = this.configService.get<string>('ZOOM_API_SECRET');

    if (!accountId || !clientId || !clientSecret) {
      throw new Error('Missing required Zoom configuration. Please check your environment variables.');
    }

    this.accountId = accountId;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken() {
    try {
      const tokenUrl = 'https://zoom.us/oauth/token';
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(
          tokenUrl,
          'grant_type=account_credentials&account_id=' + this.accountId,
          {
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      const zoomError = error as ZoomApiError;
      console.error('Error getting Zoom access token:', zoomError);
      throw new Error('Failed to get Zoom access token');
    }
  }

async createMeeting(params: CreateMeetingDto) {
  try {
    console.log('Getting access token...');
    const token = await this.getAccessToken();
    
    console.log('Creating Zoom meeting with params:', params);
    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: params.title,
          type: 2,
          start_time: `${params.date}T${params.time}:00`,
          duration: params.duration,
          agenda: params.description,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

      console.log('Zoom API response:', response.data);
      return response.data;
    } catch (error) {
      const zoomError = error as ZoomApiError;
      console.error('Error creating Zoom meeting:', zoomError.response?.data || zoomError);
      throw new Error(zoomError.response?.data?.message || 'Failed to create Zoom meeting');
    }
  }
}
