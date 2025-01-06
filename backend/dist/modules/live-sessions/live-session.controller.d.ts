import { LiveSessionService } from './live-session.service';
export declare class LiveSessionController {
    private readonly liveSessionService;
    constructor(liveSessionService: LiveSessionService);
    createLiveSession(courseId: string, sessionData: {
        topic: string;
        startTime: string;
        duration: number;
        instructorId: string;
    }): Promise<{
        course: import("mongoose").Document<unknown, {}, import("../../schemas/course.schema").CourseDocument> & import("../../schemas/course.schema").Course & import("mongoose").Document<unknown, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
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
    deleteLiveSession(courseId: string, sessionId: string): Promise<{
        message: string;
    }>;
    recordLiveSession(courseId: string, sessionId: string, recordingUrl: string): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/course.schema").CourseDocument> & import("../../schemas/course.schema").Course & import("mongoose").Document<unknown, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllLiveSessions(): Promise<{
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
    getCourseLiveSessions(courseId: string): Promise<{
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
