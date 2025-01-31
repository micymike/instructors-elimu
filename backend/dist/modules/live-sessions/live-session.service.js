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
var LiveSessionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const zoom_service_1 = require("../../zoom/zoom.service");
const course_schema_1 = require("../../schemas/course.schema");
let LiveSessionService = LiveSessionService_1 = class LiveSessionService {
    constructor(courseModel, zoomService) {
        this.courseModel = courseModel;
        this.zoomService = zoomService;
        this.logger = new common_1.Logger(LiveSessionService_1.name);
    }
    async createLiveSessionForCourse(courseId, sessionData) {
        try {
            const zoomMeeting = await this.zoomService.createMeeting(sessionData.instructorId, {
                topic: sessionData.topic,
                startTime: sessionData.startTime,
                duration: sessionData.duration,
                agenda: `Live session for course: ${courseId}`
            });
            const updatedCourse = await this.courseModel.findByIdAndUpdate(courseId, {
                $push: {
                    liveSessions: {
                        sessionDate: new Date(sessionData.startTime),
                        startTime: sessionData.startTime,
                        endTime: new Date(new Date(sessionData.startTime).getTime() + sessionData.duration * 60000).toISOString(),
                        topic: sessionData.topic,
                        meetingLink: zoomMeeting.joinUrl,
                        recordingUrl: null,
                        materials: []
                    }
                }
            }, { new: true });
            return {
                course: updatedCourse,
                zoomMeeting
            };
        }
        catch (error) {
            this.logger.error('Failed to create live session', error);
            throw new Error(`Failed to create live session: ${error.message}`);
        }
    }
    async updateLiveSession(courseId, sessionId, updateData) {
        try {
            const course = await this.courseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            const sessionIndex = course.liveSessions.findIndex(session => session.sessionDate.toString() === sessionId);
            if (sessionIndex === -1) {
                throw new Error('Live session not found');
            }
            const session = course.liveSessions[sessionIndex];
            if (updateData.topic || updateData.startTime || updateData.duration) {
                await this.zoomService.updateMeeting(session.meetingLink.split('/').pop(), {
                    topic: updateData.topic,
                    startTime: updateData.startTime,
                    duration: updateData.duration
                });
            }
            course.liveSessions[sessionIndex] = Object.assign(Object.assign({}, session), updateData);
            await course.save();
            return course.liveSessions[sessionIndex];
        }
        catch (error) {
            this.logger.error('Failed to update live session', error);
            throw new Error(`Failed to update live session: ${error.message}`);
        }
    }
    async recordLiveSession(courseId, sessionId, recordingUrl) {
        try {
            const course = await this.courseModel.findByIdAndUpdate(courseId, {
                $set: {
                    'liveSessions.$[session].recordingUrl': recordingUrl
                }
            }, {
                arrayFilters: [{ 'session.sessionDate': sessionId }],
                new: true
            });
            return course;
        }
        catch (error) {
            this.logger.error('Failed to record live session', error);
            throw new Error(`Failed to record live session: ${error.message}`);
        }
    }
    async deleteLiveSession(courseId, sessionId) {
        try {
            const course = await this.courseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            const sessionIndex = course.liveSessions.findIndex(session => session.sessionDate.toString() === sessionId);
            if (sessionIndex === -1) {
                throw new Error('Live session not found');
            }
            const session = course.liveSessions[sessionIndex];
            await this.zoomService.deleteMeeting(session.meetingLink.split('/').pop());
            course.liveSessions.splice(sessionIndex, 1);
            await course.save();
            return { message: 'Live session deleted successfully' };
        }
        catch (error) {
            this.logger.error('Failed to delete live session', error);
            throw new Error(`Failed to delete live session: ${error.message}`);
        }
    }
    async getAllLiveSessions(filters) {
        const query = {};
        if (filters === null || filters === void 0 ? void 0 : filters.courseId)
            query._id = filters.courseId;
        if (filters === null || filters === void 0 ? void 0 : filters.instructorId)
            query.instructor = filters.instructorId;
        if (filters === null || filters === void 0 ? void 0 : filters.topic)
            query['liveSessions.topic'] = filters.topic;
        if (filters === null || filters === void 0 ? void 0 : filters.startTime)
            query['liveSessions.startTime'] = { $gte: filters.startTime };
        if (filters === null || filters === void 0 ? void 0 : filters.endTime)
            query['liveSessions.endTime'] = { $lte: filters.endTime };
        const courses = await this.courseModel.find(query).select('liveSessions');
        return courses.flatMap(course => course.liveSessions);
    }
};
exports.LiveSessionService = LiveSessionService;
exports.LiveSessionService = LiveSessionService = LiveSessionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        zoom_service_1.ZoomService])
], LiveSessionService);
//# sourceMappingURL=live-session.service.js.map