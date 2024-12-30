export declare class NotificationService {
    constructor();
    notifyCourseCreated(courseId: string, instructorId: string, courseTitle: string): Promise<void>;
    notifyCourseApproved(courseId: string, instructorId: string, courseTitle: string): Promise<void>;
    notifyNewEnrollment(courseId: string, instructorId: string, studentId: string, courseTitle: string): Promise<void>;
    notifyNewReview(courseId: string, instructorId: string, studentId: string, courseTitle: string, rating: number): Promise<void>;
}
