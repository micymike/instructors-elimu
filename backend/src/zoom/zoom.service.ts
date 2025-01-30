import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(ZoomService.name);

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('ZOOM_CLIENT_ID');
    const clientSecret = this.configService.get<string>('ZOOM_API_SECRET');
    const accountId = this.configService.get<string>('ZOOM_ACCOUNT_ID');

    if (!clientId || !clientSecret || !accountId) {
      this.logger.error('Missing required Zoom configuration');
      throw new Error('Missing required Zoom configuration: ZOOM_CLIENT_ID, ZOOM_API_SECRET, and ZOOM_ACCOUNT_ID must be provided');
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
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get Zoom access token: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async getAllMeetings(userId?: string) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(`${this.baseUrl}/users/${userId || 'me'}/meetings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          type: 'scheduled',
          page_size: 100,
        },
      });

      // Sort meetings by start time
      const sortedMeetings = response.data.meetings.sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      return sortedMeetings;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get meetings: ${error.response?.data?.message || error.message}`);
      }
      throw error;
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

  async deleteMeeting(meetingId: string, userId?: string) {
    try {
      const accessToken = await this.getAccessToken();
      await axios.delete(`${this.baseUrl}/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          user_id: userId || 'me',
        },
      });

      return { message: 'Meeting deleted successfully' };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to delete meeting: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async joinMeeting(meetingId: string, userId?: string) {
    try {
      const accessToken = await this.getAccessToken();
      
      // Fetch meeting details first to get the join URL
      const meetingResponse = await axios.get(`${this.baseUrl}/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          occurrence_id: 'false', // Fetch main meeting details
        },
      });

      const meeting = meetingResponse.data;
      
      // Check if the meeting has a join URL
      if (!meeting.join_url) {
        throw new Error('No join URL available for this meeting');
      }

      return {
        joinUrl: meeting.join_url,
        topic: meeting.topic,
        startTime: meeting.start_time,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get meeting join URL: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}
