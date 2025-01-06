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
const zoom_service_1 = require("./zoom.service");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("../notification/notification.service");
let ZoomController = class ZoomController {
    constructor(zoomService, notificationService) {
        this.zoomService = zoomService;
        this.notificationService = notificationService;
    }
    async getAllMeetings(userId) {
        return this.zoomService.getAllMeetings(userId);
    }
    async createMeeting(createMeetingDto) {
        return this.zoomService.createMeeting(createMeetingDto.instructorId, {
            topic: createMeetingDto.topic,
            startTime: createMeetingDto.startTime,
            duration: createMeetingDto.duration,
            agenda: createMeetingDto.agenda,
        });
    }
    async getMeeting(meetingId) {
        return this.zoomService.getMeeting(meetingId);
    }
    async joinMeeting(meetingId, userId) {
        return this.zoomService.joinMeeting(meetingId, userId);
    }
    async updateMeeting(meetingId, updateMeetingDto) {
        return this.zoomService.updateMeeting(meetingId, updateMeetingDto);
    }
    async createGroupMeeting(groupId, createMeetingDto) {
        const meeting = await this.zoomService.createMeeting(createMeetingDto.instructorId, createMeetingDto);
        await this.notificationService.notifyGroupMeeting(groupId, meeting);
        return meeting;
    }
    async deleteMeeting(meetingId, userId) {
        return this.zoomService.deleteMeeting(meetingId, userId);
    }
};
exports.ZoomController = ZoomController;
__decorate([
    (0, common_1.Get)('meetings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all meetings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meetings retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Optional user ID to get meetings for' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getAllMeetings", null);
__decorate([
    (0, common_1.Post)('meetings'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Zoom meeting' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Meeting created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "createMeeting", null);
__decorate([
    (0, common_1.Get)('meetings/:meetingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get meeting details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting details retrieved successfully' }),
    __param(0, (0, common_1.Param)('meetingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getMeeting", null);
__decorate([
    (0, common_1.Get)('meetings/:meetingId/join'),
    (0, swagger_1.ApiOperation)({ summary: 'Get join URL for a specific meeting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting join URL retrieved successfully' }),
    __param(0, (0, common_1.Param)('meetingId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "joinMeeting", null);
__decorate([
    (0, common_1.Patch)('meetings/:meetingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update meeting details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting updated successfully' }),
    __param(0, (0, common_1.Param)('meetingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "updateMeeting", null);
__decorate([
    (0, common_1.Post)('meetings/group/:groupId'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Zoom meeting for a specific group' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Meeting created successfully' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "createGroupMeeting", null);
__decorate([
    (0, common_1.Delete)('meetings/:meetingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific meeting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting deleted successfully' }),
    __param(0, (0, common_1.Param)('meetingId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "deleteMeeting", null);
exports.ZoomController = ZoomController = __decorate([
    (0, swagger_1.ApiTags)('zoom'),
    (0, common_1.Controller)('zoom'),
    __metadata("design:paramtypes", [zoom_service_1.ZoomService, notification_service_1.NotificationService])
], ZoomController);
//# sourceMappingURL=zoom.controller.js.map