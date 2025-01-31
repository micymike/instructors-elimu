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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomController = void 0;
const common_1 = require("@nestjs/common");
const zoom_service_1 = require("../services/zoom.service");
const create_meeting_dto_1 = require("../dto/create-meeting.dto");
let ZoomController = class ZoomController {
    constructor(zoomService) {
        this.zoomService = zoomService;
    }
    async createMeeting(meetingData) {
        try {
            console.log('Received meeting data:', meetingData);
            const meeting = await this.zoomService.createMeeting(meetingData);
            return {
                success: true,
                data: meeting,
            };
        }
        catch (error) {
            console.error('Failed to create meeting:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to create Zoom meeting',
                details: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error occurred',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ZoomController = ZoomController;
__decorate([
    (0, common_1.Post)('meetings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meeting_dto_1.CreateMeetingDto]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "createMeeting", null);
exports.ZoomController = ZoomController = __decorate([
    (0, common_1.Controller)('zoom'),
    __metadata("design:paramtypes", [zoom_service_1.ZoomService])
], ZoomController);
//# sourceMappingURL=zoom.controller.js.map