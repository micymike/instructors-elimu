import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification, NotificationDocument } from './notification.schema';
import { Group } from '../instructor/entities/group.entity'; // Importing Group type

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Group.name) // Injecting Group model
    private groupModel: Model<Group>, // Using Group type directly
  ) {}

  async create(createNotificationDto: {
    userId: string;
    title: string;
    message: string;
    type: string;
    category: string;
    metadata?: any;
  }): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    const savedNotification = await notification.save();
    
    // Emit real-time notification
    this.server.to(createNotificationDto.userId).emit('notification', savedNotification);
    
    return savedNotification;
  }

  async findAllForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId, active: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .exec() as Promise<Notification | null>;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { userId, read: false },
        { read: true }
      )
      .exec();
  }

  async delete(id: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, { active: false }, { new: true })
      .exec() as Promise<Notification | null>;
  }

  // Helper methods for creating specific notifications
  async notifyCourseCreated(courseId: string, instructorId: string, courseTitle: string) {
    return this.create({
      userId: instructorId,
      title: 'Course Created Successfully',
      message: `Your course "${courseTitle}" has been created and is pending review.`,
      type: 'success',
      category: 'course',
      metadata: { courseId },
    });
  }

  async notifyCourseApproved(courseId: string, instructorId: string, courseTitle: string) {
    return this.create({
      userId: instructorId,
      title: 'Course Approved',
      message: `Your course "${courseTitle}" has been approved and is now live!`,
      type: 'success',
      category: 'course',
      metadata: { courseId },
    });
  }

  async notifyNewEnrollment(courseId: string, instructorId: string, studentId: string, courseTitle: string) {
    return this.create({
      userId: instructorId,
      title: 'New Course Enrollment',
      message: `A new student has enrolled in your course "${courseTitle}".`,
      type: 'info',
      category: 'enrollment',
      metadata: { courseId, studentId },
    });
  }

  async notifyNewReview(courseId: string, instructorId: string, studentId: string, courseTitle: string, rating: number) {
    return this.create({
      userId: instructorId,
      title: 'New Course Review',
      message: `A student has left a ${rating}-star review on your course "${courseTitle}".`,
      type: 'info',
      category: 'review',
      metadata: { courseId, studentId },
    });
  }

  async notifyGroupCreation(group: Group): Promise<void> {
    for (const studentId of group.studentIds) {
      await this.create({
        userId: studentId,
        title: 'Added to New Group',
        message: `You have been added to group: ${group.name}`,
        type: 'group',
        category: 'enrollment',
      });
    }
  }

  async notifyGroupMeeting(groupId: string, meeting: any): Promise<void> {
    const group = await this.groupModel.findById(groupId); // Ensure group is fetched
    if (!group) return;

    for (const studentId of group.studentIds) {
      await this.create({
        userId: studentId,
        title: 'New Group Meeting Scheduled',
        message: `A new meeting has been scheduled for ${group.name}`,
        type: 'meeting',
        category: 'schedule',
        metadata: {
          meetingId: meeting.id,
          meetingLink: meeting.join_url,
          startTime: meeting.start_time,
        },
      });
    }
  }

  async notifyStudentsAddedToGroup(group: Group, newStudentIds: string[]): Promise<void> {
    for (const studentId of newStudentIds) {
      await this.create({
        userId: studentId,
        title: 'Added to Group',
        message: `You have been added to group: ${group.name}`,
        type: 'group',
        category: 'enrollment',
      });
    }
  }
}
