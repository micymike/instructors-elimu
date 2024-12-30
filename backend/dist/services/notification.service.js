"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
let NotificationService = class NotificationService {
    async sendNotification(userId, message, type) {
        console.log(`Sending ${type} notification to ${userId}: ${message}`);
        return true;
    }
    async notifyCourseCreation(instructorId, courseTitle) {
        return this.sendNotification(instructorId, `Course "${courseTitle}" has been created successfully`, 'course_creation');
    }
    async notifyCourseUpdate(instructorId, courseTitle) {
        return this.sendNotification(instructorId, `Course "${courseTitle}" has been updated`, 'course_update');
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map