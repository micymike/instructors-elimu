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
var CourseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../schemas/course.schema");
const common_2 = require("@nestjs/common");
const cloudinary_service_1 = require("../modules/cloudinary/cloudinary.service");
let CourseService = CourseService_1 = class CourseService {
    constructor(courseModel, cloudinaryService) {
        this.courseModel = courseModel;
        this.cloudinaryService = cloudinaryService;
        this.logger = new common_2.Logger(CourseService_1.name);
    }
    async createCourse(createCourseDto, user) {
        try {
            this.logger.log('🚀 Creating Course', {
                courseData: createCourseDto,
                user: user
            });
            if (!user.email) {
                throw new common_1.BadRequestException('No instructor email provided');
            }
            const createdCourse = new this.courseModel({
                ...createCourseDto,
                instructor: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedCourse = await createdCourse.save();
            this.logger.log('✅ Course Created Successfully', {
                courseId: savedCourse._id,
                title: savedCourse.title,
                instructor: user.email
            });
            return savedCourse;
        }
        catch (error) {
            this.logger.error('❌ Course Creation Error', {
                message: error.message,
                courseData: createCourseDto,
                user: user
            });
            throw new common_1.BadRequestException(`Failed to create course: ${error.message}`);
        }
    }
    async findAll(userId) {
        try {
            this.logger.log('🔍 Course Service - Finding Courses', {
                userId: userId || 'Not Provided',
                timestamp: new Date().toISOString()
            });
            let courses;
            if (userId) {
                courses = await this.courseModel.find({ instructor: userId }).exec();
                this.logger.log(`✅ Courses found for userId ${userId}:`, courses.length);
            }
            else {
                courses = await this.courseModel.find().exec();
                this.logger.log('✅ Total courses found:', courses.length);
            }
            if (courses.length === 0) {
                this.logger.warn('⚠️ No courses found');
            }
            return courses;
        }
        catch (error) {
            this.logger.error('❌ Error in findAll method:', {
                message: error.message,
                stack: error.stack,
                userId: userId
            });
            throw new common_1.InternalServerErrorException({
                message: 'Failed to retrieve courses',
                error: error.message,
                details: {
                    userId: userId,
                    timestamp: new Date().toISOString()
                }
            });
        }
    }
    async findAllByEmail(email) {
        try {
            this.logger.log('🔍 Course Service - Finding Courses by Email', {
                email,
                timestamp: new Date().toISOString()
            });
            const courses = await this.courseModel.find({
                $or: [
                    { instructor: email },
                    { 'instructor.email': email }
                ]
            }).exec();
            this.logger.log(`✅ Courses found for email ${email}:`, courses.length);
            if (courses.length === 0) {
                this.logger.warn(`⚠️ No courses found for email: ${email}`);
            }
            return courses;
        }
        catch (error) {
            this.logger.error('❌ Error in findAllByEmail method:', {
                message: error.message,
                stack: error.stack,
                email: email
            });
            throw new common_1.InternalServerErrorException({
                message: 'Failed to retrieve courses by email',
                error: error.message,
                details: {
                    email: email,
                    timestamp: new Date().toISOString()
                }
            });
        }
    }
    async getAllCourses(user) {
        try {
            this.logger.log('🔍 Getting All Courses', {
                userId: user.id,
                email: user.email,
                role: user.role
            });
            if (user.role === 'admin' || user.role === 'superadmin') {
                return await this.courseModel.find().exec();
            }
            const courses = await this.courseModel.find({ instructor: user.email }).exec();
            this.logger.log('✅ Courses Retrieved Successfully', {
                count: courses.length,
                userIdentifier: user.email
            });
            return courses;
        }
        catch (error) {
            this.logger.error('❌ Course Retrieval Error', {
                message: error.message,
                user: user
            });
            throw new Error(`Failed to retrieve courses: ${error.message}`);
        }
    }
    async findOne(id, instructorEmail) {
        try {
            const course = await this.courseModel.findOne({
                _id: id,
                ...(instructorEmail && { instructor: instructorEmail })
            });
            if (!course) {
                throw new common_1.NotFoundException('Course not found or access denied');
            }
            return course;
        }
        catch (error) {
            this.logger.error('Error finding course:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to retrieve course');
        }
    }
    async getCourseStats(instructorEmail) {
        try {
            const totalCourses = await this.courseModel.countDocuments({
                instructor: instructorEmail
            });
            const activeCourses = await this.courseModel.countDocuments({
                instructor: instructorEmail,
                status: 'published'
            });
            const totalStudents = await this.courseModel.aggregate([
                { $match: { instructor: instructorEmail } },
                { $group: {
                        _id: null,
                        totalStudents: { $sum: { $size: '$students' } }
                    }
                }
            ]);
            const teachingHours = await this.courseModel.aggregate([
                { $match: { instructor: instructorEmail } },
                { $group: {
                        _id: null,
                        totalHours: { $sum: { $toDouble: '$duration' } }
                    }
                }
            ]);
            return {
                totalCourses,
                activeCourses,
                totalStudents: totalStudents[0]?.totalStudents || 0,
                teachingHours: teachingHours[0]?.totalHours || 0
            };
        }
        catch (error) {
            this.logger.error('Error retrieving course statistics:', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve course statistics');
        }
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
        if (content.type === 'document') {
            if (!course.materials) {
                course.materials = [];
            }
            course.materials.push(content.url);
        }
        else {
            const module = course.modules.find((module) => module.content);
            if (!module) {
                course.modules.push({ title: '', description: '', content: [content] });
            }
            else {
                module.content.push(content);
            }
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
    async getCourseMaterials(courseId) {
        try {
            const course = await this.courseModel.findById(courseId).exec();
            if (!course) {
                throw new common_1.NotFoundException(`Course with ID ${courseId} not found`);
            }
            return course.materials || [];
        }
        catch (error) {
            this.logger.error('❌ Error retrieving course materials:', {
                courseId,
                errorMessage: error.message
            });
            throw new common_1.InternalServerErrorException({
                message: 'Failed to retrieve course materials',
                error: error.message
            });
        }
    }
    async addMaterial(courseId, material) {
        try {
            const course = await this.courseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            course.materials.push(material);
            await course.save();
            return course;
        }
        catch (error) {
            this.logger.error('Failed to add material to course', error);
            throw new Error(`Failed to add material: ${error.message}`);
        }
    }
    async addCourseMaterial(courseId, material) {
        return this.addMaterial(courseId, {
            ...material,
            isDownloadable: true
        });
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = CourseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cloudinary_service_1.CloudinaryService])
], CourseService);
//# sourceMappingURL=course.service.js.map