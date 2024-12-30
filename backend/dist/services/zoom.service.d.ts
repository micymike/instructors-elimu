import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
export declare class ZoomService implements OnModuleInit {
    private configService;
    private httpService;
    private accountId;
    private clientId;
    private clientSecret;
    private accessToken;
    constructor(configService: ConfigService, httpService: HttpService);
    onModuleInit(): void;
    private getAccessToken;
    createMeeting(params: CreateMeetingDto): Promise<any>;
}
