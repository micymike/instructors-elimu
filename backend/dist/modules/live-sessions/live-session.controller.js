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
exports.LiveSessionController = void 0;
const common_1 = require("@nestjs/common");
const live_session_service_1 = require("./live-session.service");
let LiveSessionController = class LiveSessionController {
    constructor(liveSessionService) {
        this.liveSessionService = liveSessionService;
    }
    async createLiveSession(courseId, sessionData) {
        return this.liveSessionService.createLiveSessionForCourse(courseId, sessionData);
    }
    async updateLiveSession(courseId, sessionId, updateData) {
        return this.liveSessionService.updateLiveSession(courseId, sessionId, updateData);
    }
    async deleteLiveSession(courseId, sessionId) {
        return this.liveSessionService.deleteLiveSession(courseId, sessionId);
    }
    async recordLiveSession(courseId, sessionId, recordingUrl) {
        return this.liveSessionService.recordLiveSession(courseId, sessionId, recordingUrl);
    }
    async getAllLiveSessions() {
        return this.liveSessionService.getAllLiveSessions();
    }
    async getCourseLiveSessions(courseId) {
        return this.liveSessionService.getAllLiveSessions({ courseId });
    }
};
exports.LiveSessionController = LiveSessionController;
__decorate([
    (0, common_1.Post)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LiveSessionController.prototype, "createLiveSession", null);
__decorate([
    (0, common_1.Put)(':courseId/:sessionId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LiveSessionController.prototype, "updateLiveSession", null);
__decorate([
    (0, common_1.Delete)(':courseId/:sessionId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LiveSessionController.prototype, "deleteLiveSession", null);
__decorate([
    (0, common_1.Post)(':courseId/:sessionId/record'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)('recordingUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LiveSessionController.prototype, "recordLiveSession", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LiveSessionController.prototype, "getAllLiveSessions", null);
__decorate([
    (0, common_1.Get)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveSessionController.prototype, "getCourseLiveSessions", null);
exports.LiveSessionController = LiveSessionController = __decorate([
    (0, common_1.Controller)('live-sessions'),
    __metadata("design:paramtypes", [live_session_service_1.LiveSessionService])
], LiveSessionController);
//# sourceMappingURL=live-session.controller.js.map