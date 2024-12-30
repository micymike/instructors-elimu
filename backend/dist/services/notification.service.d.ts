export declare class NotificationService {
    sendNotification(userId: string, message: string, type: string): Promise<boolean>;
    notifyCourseCreation(instructorId: string, courseTitle: string): Promise<boolean>;
    notifyCourseUpdate(instructorId: string, courseTitle: string): Promise<boolean>;
}
