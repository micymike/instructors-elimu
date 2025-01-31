"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importStar(require("axios"));
let ZoomService = class ZoomService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = 'https://api.zoom.us/v2';
        this.accessToken = null;
        this.tokenExpiry = 0;
        const clientId = this.configService.get('ZOOM_CLIENT_ID');
        const clientSecret = this.configService.get('ZOOM_API_SECRET');
        const accountId = this.configService.get('ZOOM_ACCOUNT_ID');
        if (!clientId || !clientSecret || !accountId) {
            throw new Error('Missing required Zoom configuration');
        }
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accountId = accountId;
    }
    async getAccessToken() {
        var _a, _b;
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }
        try {
            const response = await axios_1.default.post('https://zoom.us/oauth/token', null, {
                params: {
                    grant_type: 'account_credentials',
                    account_id: this.accountId,
                },
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
                },
            });
            if (!response.data.access_token) {
                throw new Error('No access token received from Zoom');
            }
            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            return this.accessToken;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(`Failed to get Zoom access token: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
            throw error;
        }
    }
    async getAllMeetings(userId) {
        var _a, _b;
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios_1.default.get(`${this.baseUrl}/users/${userId || 'me'}/meetings`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    type: 'scheduled',
                    page_size: 100,
                },
            });
            const sortedMeetings = response.data.meetings.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
            return sortedMeetings;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(`Failed to get meetings: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
            throw error;
        }
    }
    async createMeeting(instructorId, courseData) {
        var _a;
        const token = await this.getAccessToken();
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/users/me/meetings`, {
                topic: courseData.topic,
                type: 2,
                start_time: courseData.startTime,
                duration: courseData.duration,
                timezone: 'UTC',
                agenda: courseData.agenda,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    waiting_room: true,
                    meeting_authentication: true,
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return {
                meetingId: response.data.id,
                joinUrl: response.data.join_url,
                startUrl: response.data.start_url,
                password: response.data.password,
            };
        }
        catch (error) {
            const axiosError = error;
            console.error('Error details:', (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data);
            throw new Error(`Failed to create Zoom meeting: ${axiosError.message}`);
        }
    }
    async getMeeting(meetingId) {
        const token = await this.getAccessToken();
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/meetings/${meetingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            const axiosError = error;
            throw new Error(`Failed to get Zoom meeting: ${axiosError.message}`);
        }
    }
    async updateMeeting(meetingId, updateData) {
        const token = await this.getAccessToken();
        try {
            const response = await axios_1.default.patch(`${this.baseUrl}/meetings/${meetingId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            const axiosError = error;
            throw new Error(`Failed to update Zoom meeting: ${axiosError.message}`);
        }
    }
    async deleteMeeting(meetingId, userId) {
        var _a, _b;
        try {
            const accessToken = await this.getAccessToken();
            await axios_1.default.delete(`${this.baseUrl}/meetings/${meetingId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    user_id: userId || 'me',
                },
            });
            return { message: 'Meeting deleted successfully' };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(`Failed to delete meeting: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
            throw error;
        }
    }
    async joinMeeting(meetingId, userId) {
        var _a, _b;
        try {
            const accessToken = await this.getAccessToken();
            const meetingResponse = await axios_1.default.get(`${this.baseUrl}/meetings/${meetingId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    occurrence_id: 'false',
                },
            });
            const meeting = meetingResponse.data;
            if (!meeting.join_url) {
                throw new Error('No join URL available for this meeting');
            }
            return {
                joinUrl: meeting.join_url,
                topic: meeting.topic,
                startTime: meeting.start_time,
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(`Failed to get meeting join URL: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
            throw error;
        }
    }
};
exports.ZoomService = ZoomService;
exports.ZoomService = ZoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ZoomService);
//# sourceMappingURL=zoom.service.js.map