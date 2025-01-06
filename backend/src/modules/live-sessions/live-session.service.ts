import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ZoomService } from '../../zoom/zoom.service';
import { Course, CourseDocument } from '../../schemas/course.schema';

@Injectable()
export class LiveSessionService {
  private readonly logger = new Logger(LiveSessionService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private zoomService: ZoomService
  ) {}

  async createLiveSessionForCourse(courseId: string, sessionData: {
    topic: string;
    startTime: string;
    duration: number;
    instructorId: string;
  }) {
    try {
      // Create Zoom meeting
      const zoomMeeting = await this.zoomService.createMeeting(
        sessionData.instructorId, 
        {
          topic: sessionData.topic,
          startTime: sessionData.startTime,
          duration: sessionData.duration,
          agenda: `Live session for course: ${courseId}`
        }
      );

      // Update course with live session details
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        courseId,
        {
          $push: {
            liveSessions: {
              sessionDate: new Date(sessionData.startTime),
              startTime: sessionData.startTime,
              endTime: new Date(new Date(sessionData.startTime).getTime() + sessionData.duration * 60000).toISOString(),
              topic: sessionData.topic,
              meetingLink: zoomMeeting.joinUrl,
              recordingUrl: null, // Will be populated after session
              materials: [] // Initialize empty materials array
            }
          }
        },
        { new: true }
      );

      return {
        course: updatedCourse,
        zoomMeeting
      };
    } catch (error) {
      this.logger.error('Failed to create live session', error);
      throw new Error(`Failed to create live session: ${error.message}`);
    }
  }

  async updateLiveSession(courseId: string, sessionId: string, updateData: {
    topic?: string;
    startTime?: string;
    duration?: number;
  }) {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const sessionIndex = course.liveSessions.findIndex(
        session => session.sessionDate.toString() === sessionId
      );

      if (sessionIndex === -1) {
        throw new Error('Live session not found');
      }

      const session = course.liveSessions[sessionIndex];

      // Update Zoom meeting if details change
      if (updateData.topic || updateData.startTime || updateData.duration) {
        await this.zoomService.updateMeeting(session.meetingLink.split('/').pop(), {
          topic: updateData.topic,
          startTime: updateData.startTime,
          duration: updateData.duration
        });
      }

      // Update course document
      course.liveSessions[sessionIndex] = {
        ...session,
        ...updateData
      };

      await course.save();

      return course.liveSessions[sessionIndex];
    } catch (error) {
      this.logger.error('Failed to update live session', error);
      throw new Error(`Failed to update live session: ${error.message}`);
    }
  }

  async recordLiveSession(courseId: string, sessionId: string, recordingUrl: string) {
    try {
      const course = await this.courseModel.findByIdAndUpdate(
        courseId,
        {
          $set: {
            'liveSessions.$[session].recordingUrl': recordingUrl
          }
        },
        { 
          arrayFilters: [{ 'session.sessionDate': sessionId }],
          new: true 
        }
      );

      return course;
    } catch (error) {
      this.logger.error('Failed to record live session', error);
      throw new Error(`Failed to record live session: ${error.message}`);
    }
  }

  async deleteLiveSession(courseId: string, sessionId: string) {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const sessionIndex = course.liveSessions.findIndex(
        session => session.sessionDate.toString() === sessionId
      );

      if (sessionIndex === -1) {
        throw new Error('Live session not found');
      }

      const session = course.liveSessions[sessionIndex];

      // Delete Zoom meeting
      await this.zoomService.deleteMeeting(session.meetingLink.split('/').pop());

      // Remove session from course
      course.liveSessions.splice(sessionIndex, 1);
      await course.save();

      return { message: 'Live session deleted successfully' };
    } catch (error) {
      this.logger.error('Failed to delete live session', error);
      throw new Error(`Failed to delete live session: ${error.message}`);
    }
  }

  async getAllLiveSessions(filters?: {
    courseId?: string;
    instructorId?: string;
    topic?: string;
    startTime?: string;
    endTime?: string;
  }) {
    const query: any = {};
    if (filters?.courseId) query._id = filters.courseId;
    if (filters?.instructorId) query.instructor = filters.instructorId;
    if (filters?.topic) query['liveSessions.topic'] = filters.topic;
    if (filters?.startTime) query['liveSessions.startTime'] = { $gte: filters.startTime };
    if (filters?.endTime) query['liveSessions.endTime'] = { $lte: filters.endTime };

    const courses = await this.courseModel.find(query).select('liveSessions');
    return courses.flatMap(course => course.liveSessions);
  }
}
