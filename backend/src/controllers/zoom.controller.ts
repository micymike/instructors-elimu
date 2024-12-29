import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ZoomService } from '../services/zoom.service';
import { CreateMeetingDto } from '../dto/create-meeting.dto';

@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @Post('meetings')
  async createMeeting(@Body() meetingData: CreateMeetingDto) {
    try {
      console.log('Received meeting data:', meetingData);
      const meeting = await this.zoomService.createMeeting(meetingData);
      return {
        success: true,
        data: meeting,
      };
    } catch (error: any) {
      console.error('Failed to create meeting:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create Zoom meeting',
          details: error?.message || 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 