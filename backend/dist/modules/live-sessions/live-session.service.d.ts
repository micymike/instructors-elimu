import { Model } from 'mongoose';
import { ZoomService } from '../../zoom/zoom.service';
import { Course, CourseDocument } from '../../schemas/course.schema';
export declare class LiveSessionService {
    private courseModel;
    private zoomService;
    private readonly logger;
    constructor(courseModel: Model<CourseDocument>, zoomService: ZoomService);
    createLiveSessionForCourse(courseId: string, sessionData: {
        topic: string;
        startTime: string;
        duration: number;
        instructorId: string;
    }): Promise<{
        course: import("mongoose").Document<unknown, {}, CourseDocument> & Course & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            _id: import("mongoose").Types.ObjectId;
        };
        zoomMeeting: {
            meetingId: any;
            joinUrl: any;
            startUrl: any;
            password: any;
        };
    }>;
    updateLiveSession(courseId: string, sessionId: string, updateData: {
        topic?: string;
        startTime?: string;
        duration?: number;
    }): Promise<{
        sessionDate: Date;
        startTime: string;
        endTime: string;
        topic: string;
        meetingLink: string;
        recordingUrl?: string;
        materials: Array<{
            url: string;
            name: string;
            type: string;
        }>;
    }>;
    recordLiveSession(courseId: string, sessionId: string, recordingUrl: string): Promise<import("mongoose").Document<unknown, {}, CourseDocument> & Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteLiveSession(courseId: string, sessionId: string): Promise<{
        message: string;
    }>;
    getAllLiveSessions(filters?: {
        courseId?: string;
        instructorId?: string;
        topic?: string;
        startTime?: string;
        endTime?: string;
    }): Promise<{
        sessionDate: Date;
        startTime: string;
        endTime: string;
        topic: string;
        meetingLink: string;
        recordingUrl?: string;
        materials: Array<{
            url: string;
            name: string;
            type: string;
        }>;
    }[]>;
}
