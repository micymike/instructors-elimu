"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ZoomService = class ZoomService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
    }
    onModuleInit() {
        const accountId = this.configService.get('ZOOM_ACCOUNT_ID');
        const clientId = this.configService.get('ZOOM_CLIENT_ID');
        const clientSecret = this.configService.get('ZOOM_API_SECRET');
        if (!accountId || !clientId || !clientSecret) {
            throw new Error('Missing required Zoom configuration. Please check your environment variables.');
        }
        this.accountId = accountId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    async getAccessToken() {
        try {
            const tokenUrl = 'https://zoom.us/oauth/token';
            const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(tokenUrl, 'grant_type=account_credentials&account_id=' + this.accountId, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }));
            this.accessToken = response.data.access_token;
            return this.accessToken;
        }
        catch (error) {
            const zoomError = error;
            console.error('Error getting Zoom access token:', zoomError);
            throw new Error('Failed to get Zoom access token');
        }
    }
    async createMeeting(params) {
        try {
            console.log('Getting access token...');
            const token = await this.getAccessToken();
            console.log('Creating Zoom meeting with params:', params);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://api.zoom.us/v2/users/me/meetings', {
                topic: params.topic,
                type: 2,
                start_time: params.startTime,
                duration: params.duration,
                agenda: params.agenda,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    waiting_room: true,
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }));
            console.log('Zoom API response:', response.data);
            return response.data;
        }
        catch (error) {
            const zoomError = error;
            console.error('Error creating Zoom meeting:', zoomError.response?.data || zoomError);
            throw new Error(zoomError.response?.data?.message || 'Failed to create Zoom meeting');
        }
    }
};
exports.ZoomService = ZoomService;
exports.ZoomService = ZoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], ZoomService);
//# sourceMappingURL=zoom.service.js.map