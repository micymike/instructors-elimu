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
let CourseItem = class CourseItem {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CourseItem.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CourseItem.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['video', 'document', 'quiz'] }),
    __metadata("design:type", String)
], CourseItem.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CourseItem.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CourseItem.prototype, "url", void 0);
CourseItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CourseItem);
let CourseSection = class CourseSection {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CourseSection.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CourseSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CourseItem] }),
    __metadata("design:type", Array)
], CourseSection.prototype, "items", void 0);
CourseSection = __decorate([
    (0, mongoose_1.Schema)()
], CourseSection);
let Progress = class Progress {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Progress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Progress.prototype, "completedItems", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Progress.prototype, "lastAccessed", void 0);
Progress = __decorate([
    (0, mongoose_1.Schema)()
], Progress);
let Review = class Review {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Review.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 5 }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
Review = __decorate([
    (0, mongoose_1.Schema)()
], Review);
let Analytics = class Analytics {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Analytics.prototype, "enrollments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Analytics.prototype, "completionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Analytics.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Analytics.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Analytics.prototype, "activeStudents", void 0);
Analytics = __decorate([
    (0, mongoose_1.Schema)()
], Analytics);
let Pricing = class Pricing {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Pricing.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'USD' }),
    __metadata("design:type", String)
], Pricing.prototype, "currency", void 0);
Pricing = __decorate([
    (0, mongoose_1.Schema)()
], Pricing);
let Content = class Content {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Content.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Content.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['video', 'document', 'quiz', 'external'] }),
    __metadata("design:type", String)
], Content.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Content.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Content.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Content.prototype, "description", void 0);
Content = __decorate([
    (0, mongoose_1.Schema)()
], Content);
let Module = class Module {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Module.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Content] }),
    __metadata("design:type", Array)
], Module.prototype, "content", void 0);
Module = __decorate([
    (0, mongoose_1.Schema)()
], Module);
let Course = class Course {
};
exports.Course = Course;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Course.prototype, "instructor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CourseSection] }),
    __metadata("design:type", Array)
], Course.prototype, "sections", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Progress] }),
    __metadata("design:type", Array)
], Course.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], Course.prototype, "students", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Review] }),
    __metadata("design:type", Array)
], Course.prototype, "reviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Analytics }),
    __metadata("design:type", Analytics)
], Course.prototype, "analytics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Pricing }),
    __metadata("design:type", Pricing)
], Course.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }),
    __metadata("design:type", String)
], Course.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Module] }),
    __metadata("design:type", Array)
], Course.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Content] }),
    __metadata("design:type", Array)
], Course.prototype, "content", void 0);
exports.Course = Course = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Course);
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
//# sourceMappingURL=course.schema.js.map