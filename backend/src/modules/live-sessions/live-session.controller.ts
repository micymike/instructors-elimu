import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete,
  Param, 
  Body, 
  Req 
} from '@nestjs/common';
import { LiveSessionService } from './live-session.service';
import { Request } from 'express';

@Controller('live-sessions')
export class LiveSessionController {
  constructor(private readonly liveSessionService: LiveSessionService) {}

  @Post(':courseId')
  async createLiveSession(
    @Param('courseId') courseId: string,
    @Body() sessionData: {
      topic: string;
      startTime: string;
      duration: number;
      instructorId: string;
    }
  ) {
    return this.liveSessionService.createLiveSessionForCourse(
      courseId, 
      sessionData
    );
  }

  @Put(':courseId/:sessionId')
  async updateLiveSession(
    @Param('courseId') courseId: string,
    @Param('sessionId') sessionId: string,
    @Body() updateData: {
      topic?: string;
      startTime?: string;
      duration?: number;
    }
  ) {
    return this.liveSessionService.updateLiveSession(
      courseId, 
      sessionId, 
      updateData
    );
  }

  @Delete(':courseId/:sessionId')
  async deleteLiveSession(
    @Param('courseId') courseId: string,
    @Param('sessionId') sessionId: string
  ) {
    return this.liveSessionService.deleteLiveSession(courseId, sessionId);
  }

  @Post(':courseId/:sessionId/record')
  async recordLiveSession(
    @Param('courseId') courseId: string,
    @Param('sessionId') sessionId: string,
    @Body('recordingUrl') recordingUrl: string
  ) {
    return this.liveSessionService.recordLiveSession(
      courseId, 
      sessionId, 
      recordingUrl
    );
  }

  @Get()
  async getAllLiveSessions() {
    return this.liveSessionService.getAllLiveSessions();
  }

  @Get(':courseId')
  async getCourseLiveSessions(
    @Param('courseId') courseId: string
  ) {
    return this.liveSessionService.getAllLiveSessions({ courseId });
  }
}
