import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ZoomService } from './zoom.service';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from '../notification/notification.service';

@ApiTags('zoom')
@Controller('zoom')

export class ZoomController {
  constructor(private readonly zoomService: ZoomService, private readonly notificationService: NotificationService) {}

  @Get('meetings')
  @ApiOperation({ summary: 'Get all meetings' })
  @ApiResponse({ status: 200, description: 'Meetings retrieved successfully' })
  @ApiQuery({ name: 'userId', required: false, description: 'Optional user ID to get meetings for' })
  async getAllMeetings(@Query('userId') userId?: string) {
    return this.zoomService.getAllMeetings(userId);
  }

  @Post('meetings')
  @ApiOperation({ summary: 'Create a new Zoom meeting' })
  @ApiResponse({ status: 201, description: 'Meeting created successfully' })
  async createMeeting(
    @Body() createMeetingDto: {
      instructorId: string;
      topic: string;
      startTime: string;
      duration: number;
      agenda?: string;
    },
  ) {
    return this.zoomService.createMeeting(
      createMeetingDto.instructorId,
      {
        topic: createMeetingDto.topic,
        startTime: createMeetingDto.startTime,
        duration: createMeetingDto.duration,
        agenda: createMeetingDto.agenda,
      },
    );
  }

  @Get('meetings/:meetingId')
  @ApiOperation({ summary: 'Get meeting details' })
  @ApiResponse({ status: 200, description: 'Meeting details retrieved successfully' })
  async getMeeting(@Param('meetingId') meetingId: string) {
    return this.zoomService.getMeeting(meetingId);
  }

  @Get('meetings/:meetingId/join')
  @ApiOperation({ summary: 'Get join URL for a specific meeting' })
  @ApiResponse({ status: 200, description: 'Meeting join URL retrieved successfully' })
  async joinMeeting(
    @Param('meetingId') meetingId: string,
    @Query('userId') userId?: string,
  ) {
    return this.zoomService.joinMeeting(meetingId, userId);
  }

  @Patch('meetings/:meetingId')
  @ApiOperation({ summary: 'Update meeting details' })
  @ApiResponse({ status: 200, description: 'Meeting updated successfully' })
  async updateMeeting(
    @Param('meetingId') meetingId: string,
    @Body() updateMeetingDto: {
      topic?: string;
      startTime?: string;
      duration?: number;
      agenda?: string;
    },
  ) {
    return this.zoomService.updateMeeting(meetingId, updateMeetingDto);
  }

  @Post('meetings/group/:groupId')
  @ApiOperation({ summary: 'Create a new Zoom meeting for a specific group' })
  @ApiResponse({ status: 201, description: 'Meeting created successfully' })
  async createGroupMeeting(
    @Param('groupId') groupId: string,
    @Body() createMeetingDto: {
      instructorId: string;
      topic: string;
      startTime: string;
      duration: number;
      agenda?: string;
    },
  ) {
    const meeting = await this.zoomService.createMeeting(
      createMeetingDto.instructorId,
      createMeetingDto
    );
  
    // Notify all students in the group
    await this.notificationService.notifyGroupMeeting(groupId, meeting);
  
    return meeting;
  }

  @Delete('meetings/:meetingId')
  @ApiOperation({ summary: 'Delete a specific meeting' })
  @ApiResponse({ status: 200, description: 'Meeting deleted successfully' })
  async deleteMeeting(
    @Param('meetingId') meetingId: string,
    @Query('userId') userId?: string,
  ) {
    return this.zoomService.deleteMeeting(meetingId, userId);
  }
}
