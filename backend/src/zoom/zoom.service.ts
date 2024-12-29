import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class ZoomService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly accountId: string;
  private readonly baseUrl = 'https://api.zoom.us/v2';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('ZOOM_CLIENT_ID');
    const clientSecret = this.configService.get<string>('ZOOM_API_SECRET');
    const accountId = this.configService.get<string>('ZOOM_ACCOUNT_ID');

    if (!clientId || !clientSecret || !accountId) {
      throw new Error('Missing required Zoom configuration');
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accountId = accountId;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<{ access_token: string; expires_in: number }>(
        'https://zoom.us/oauth/token',
        null,
        {
          params: {
            grant_type: 'account_credentials',
            account_id: this.accountId,
          },
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          },
        }
      );

      if (!response.data.access_token) {
        throw new Error('No access token received from Zoom');
      }

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to get Zoom access token: ${axiosError.message}`);
    }
  }

  async createMeeting(instructorId: string, courseData: {
    topic: string;
    startTime: string;
    duration: number;
    agenda?: string;
  }) {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/users/me/meetings`,
        {
          topic: courseData.topic,
          type: 2, // Scheduled meeting
          start_time: courseData.startTime,
          duration: courseData.duration,
          timezone: 'UTC',
          agenda: courseData.agenda,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            meeting_authentication: true,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        meetingId: response.data.id,
        joinUrl: response.data.join_url,
        startUrl: response.data.start_url,
        password: response.data.password,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error details:', axiosError.response?.data); // Log detailed error response
      throw new Error(`Failed to create Zoom meeting: ${axiosError.message}`);
    }
  }

  async getMeeting(meetingId: string) {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.get(
        `${this.baseUrl}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to get Zoom meeting: ${axiosError.message}`);
    }
  }

  async updateMeeting(meetingId: string, updateData: {
    topic?: string;
    startTime?: string;
    duration?: number;
    agenda?: string;
  }) {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.patch(
        `${this.baseUrl}/meetings/${meetingId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to update Zoom meeting: ${axiosError.message}`);
    }
  }

  async deleteMeeting(meetingId: string) {
    const token = await this.getAccessToken();
    
    try {
      await axios.delete(
        `${this.baseUrl}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to delete Zoom meeting: ${axiosError.message}`);
    }
  }
}
