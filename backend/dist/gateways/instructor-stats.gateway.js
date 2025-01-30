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
var InstructorStatsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorStatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const course_service_1 = require("../services/course.service");
const common_1 = require("@nestjs/common");
let InstructorStatsGateway = InstructorStatsGateway_1 = class InstructorStatsGateway {
    constructor(courseService) {
        this.courseService = courseService;
        this.logger = new common_1.Logger(InstructorStatsGateway_1.name);
    }
    async handleConnection(client) {
        try {
            const user = client.user;
            if (!user) {
                client.disconnect(true);
                return;
            }
            this.logger.log(`Socket connected: ${user.email}`);
            const stats = await this.courseService.getInstructorStats(user.email);
            client.emit('instructor_stats_update', stats);
        }
        catch (error) {
            this.logger.error('Socket connection error', error);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        var _a;
        this.logger.log(`Socket disconnected: ${((_a = client.user) === null || _a === void 0 ? void 0 : _a.email) || 'Unknown'}`);
    }
    async broadcastInstructorStats(instructorEmail) {
        try {
            const stats = await this.courseService.getInstructorStats(instructorEmail);
            const sockets = await this.server.fetchSockets();
            const instructorSockets = Array.from(sockets).filter((socket) => {
                var _a;
                const userEmail = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.email;
                return userEmail === instructorEmail;
            });
            instructorSockets.forEach(socket => {
                socket.emit('instructor_stats_update', stats);
            });
        }
        catch (error) {
            this.logger.error('Error broadcasting instructor stats', error);
        }
    }
    async onCourseCreated(course) {
        await this.broadcastInstructorStats(course.instructor.email);
    }
    async onCourseUpdated(course) {
        await this.broadcastInstructorStats(course.instructor.email);
    }
    async onCourseDeleted(course) {
        await this.broadcastInstructorStats(course.instructor.email);
    }
};
exports.InstructorStatsGateway = InstructorStatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], InstructorStatsGateway.prototype, "server", void 0);
exports.InstructorStatsGateway = InstructorStatsGateway = InstructorStatsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    }),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], InstructorStatsGateway);
//# sourceMappingURL=instructor-stats.gateway.js.map