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
exports.CourseSchema = exports.Course = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const create_course_dto_1 = require("../dto/create-course.dto");
let Course = class Course {
};
exports.Course = Course;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, auto: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Course.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "instructor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(create_course_dto_1.CourseLevel) }),
    __metadata("design:type", String)
], Course.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['on-demand', 'live', 'self-paced'], default: 'on-demand' }),
    __metadata("design:type", String)
], Course.prototype, "deliveryMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            title: String,
            description: String,
            content: [{
                    type: {
                        type: String,
                        enum: ['video', 'document', 'quiz', 'assignment', 'live-session'],
                    },
                    title: String,
                    description: String,
                    url: String,
                    duration: Number,
                    scheduledTime: Date,
                    meetingLink: String,
                    maxDuration: { type: Number, max: 45 },
                    resourceType: {
                        type: String,
                        enum: ['pdf', 'video', 'document', 'quiz']
                    },
                    isRequired: { type: Boolean, default: false },
                    dueDate: Date,
                }]
        }]),
    __metadata("design:type", Array)
], Course.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'draft', enum: ['draft', 'published', 'archived'] }),
    __metadata("design:type", String)
], Course.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Course.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            totalHours: Number,
            weeksDuration: Number,
            selfPacedDeadline: Date,
        }
    }),
    __metadata("design:type", Object)
], Course.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Course.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Course.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Student' }] }),
    __metadata("design:type", Array)
], Course.prototype, "students", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{
                url: { type: String, required: true },
                name: { type: String, required: true },
                type: { type: String, enum: ['pdf', 'video', 'document'], required: true },
                uploadedAt: { type: Date, default: Date.now },
                duration: { type: Number },
                size: { type: Number },
                isDownloadable: { type: Boolean, default: true }
            }], default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "materials", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{
                sessionDate: Date,
                startTime: String,
                endTime: String,
                topic: String,
                meetingLink: String,
                recordingUrl: String,
                materials: [{
                        url: String,
                        name: String,
                        type: { type: String, enum: ['pdf', 'video', 'document'] }
                    }]
            }], default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "liveSessions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: {
            isEnrollmentOpen: { type: Boolean, default: true },
            startDate: Date,
            endDate: Date,
            maxStudents: Number,
            prerequisites: [String],
            objectives: [String],
            certificateAvailable: { type: Boolean, default: false },
            completionCriteria: {
                minAttendance: Number,
                minAssignments: Number,
                minQuizScore: Number
            }
        } }),
    __metadata("design:type", Object)
], Course.prototype, "courseSettings", void 0);
exports.Course = Course = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Course);
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
//# sourceMappingURL=course.schema.js.map