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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../schemas/course.schema");
let CourseService = class CourseService {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async create(createCourseDto, userId) {
        const createdCourse = new this.courseModel({
            ...createCourseDto,
            instructor: userId,
        });
        return createdCourse.save();
    }
    async findAll(userId) {
        if (userId) {
            return this.courseModel.find({ instructor: userId }).exec();
        }
        else {
            return this.courseModel.find().exec();
        }
    }
    async findOne(id) {
        return this.courseModel.findById(id).exec();
    }
    async update(id, updateCourseDto) {
        return this.courseModel
            .findByIdAndUpdate(id, updateCourseDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.courseModel.findByIdAndDelete(id).exec();
    }
    async addContent(courseId, content) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const module = course.modules.find((module) => module.content);
        if (!module) {
            course.modules.push({ title: '', description: '', content: [content] });
        }
        else {
            module.content.push(content);
        }
        return course.save();
    }
    async removeContent(courseId, contentIndex) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const module = course.modules.find((module) => module.content);
        if (module) {
            module.content.splice(contentIndex, 1);
        }
        return course.save();
    }
    async updateContent(courseId, updateContentDto) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        course.modules = updateContentDto.sections;
        return course.save();
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CourseService);
//# sourceMappingURL=course.service.js.map