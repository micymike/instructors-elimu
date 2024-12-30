import { ZoomService } from '../services/zoom.service';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
export declare class ZoomController {
    private readonly zoomService;
    constructor(zoomService: ZoomService);
    createMeeting(meetingData: CreateMeetingDto): Promise<{
        success: boolean;
        data: any;
    }>;
}
