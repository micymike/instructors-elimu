import { ConfigService } from '@nestjs/config';
export declare class ZoomService {
    private configService;
    private readonly clientId;
    private readonly clientSecret;
    private readonly accountId;
    private readonly baseUrl;
    private accessToken;
    private tokenExpiry;
    constructor(configService: ConfigService);
    private getAccessToken;
    createMeeting(instructorId: string, courseData: {
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
    updateMeeting(meetingId: string, updateData: {
        topic?: string;
        startTime?: string;
        duration?: number;
        agenda?: string;
    }): Promise<any>;
    deleteMeeting(meetingId: string): Promise<boolean>;
}
