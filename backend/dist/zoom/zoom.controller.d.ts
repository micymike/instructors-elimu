import { ZoomService } from './zoom.service';
import { NotificationService } from '../notification/notification.service';
export declare class ZoomController {
    private readonly zoomService;
    private readonly notificationService;
    constructor(zoomService: ZoomService, notificationService: NotificationService);
    getAllMeetings(userId?: string): Promise<any>;
    createMeeting(createMeetingDto: {
        instructorId: string;
        topic: string;
        startTime: string;
        duration: number;
        agenda?: string;
    }): Promise<{
        meetingId: any;
        joinUrl: any;
        startUrl: any;
        password: any;
    }>;
    getMeeting(meetingId: string): Promise<any>;
    joinMeeting(meetingId: string, userId?: string): Promise<{
        joinUrl: any;
        topic: any;
        startTime: any;
    }>;
    updateMeeting(meetingId: string, updateMeetingDto: {
        topic?: string;
        startTime?: string;
        duration?: number;
        agenda?: string;
    }): Promise<any>;
    createGroupMeeting(groupId: string, createMeetingDto: {
        instructorId: string;
        topic: string;
        startTime: string;
        duration: number;
        agenda?: string;
    }): Promise<{
        meetingId: any;
        joinUrl: any;
        startUrl: any;
        password: any;
    }>;
    deleteMeeting(meetingId: string, userId?: string): Promise<{
        message: string;
    }>;
}
