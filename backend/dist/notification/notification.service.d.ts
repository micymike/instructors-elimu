import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { Notification, NotificationDocument } from './notification.schema';
import { Group } from '../instructor/entities/group.entity';
export declare class NotificationService {
    private notificationModel;
    private groupModel;
    server: Server;
    constructor(notificationModel: Model<NotificationDocument>, groupModel: Model<Group>);
    create(createNotificationDto: {
        userId: string;
        title: string;
        message: string;
        type: string;
        category: string;
        metadata?: any;
    }): Promise<Notification>;
    findAllForUser(userId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification | null>;
    markAllAsRead(userId: string): Promise<void>;
    delete(id: string): Promise<Notification | null>;
    notifyCourseCreated(courseId: string, instructorId: string, courseTitle: string): Promise<Notification>;
    notifyCourseApproved(courseId: string, instructorId: string, courseTitle: string): Promise<Notification>;
    notifyNewEnrollment(courseId: string, instructorId: string, studentId: string, courseTitle: string): Promise<Notification>;
    notifyNewReview(courseId: string, instructorId: string, studentId: string, courseTitle: string, rating: number): Promise<Notification>;
    notifyGroupCreation(group: Group): Promise<void>;
    notifyGroupMeeting(groupId: string, meeting: any): Promise<void>;
    notifyStudentsAddedToGroup(group: Group, newStudentIds: string[]): Promise<void>;
}
