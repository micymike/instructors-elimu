"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const gemini_service_1 = require("../services/gemini.service");
const course_service_1 = require("../services/course.service");
const notification_service_1 = require("../notification/notification.service");
const create_course_dto_1 = require("../dto/create-course.dto");
const update_course_dto_1 = require("../dto/update-course.dto");
const jwt = __importStar(require("jsonwebtoken"));
const create_course_dto_2 = require("../dto/create-course.dto");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_service_1 = require("../modules/cloudinary/cloudinary.service");
const swagger_1 = require("@nestjs/swagger");
let CourseController = class CourseController {
    constructor(courseService, notificationService, geminiService, cloudinaryService) {
        this.courseService = courseService;
        this.notificationService = notificationService;
        this.geminiService = geminiService;
        this.cloudinaryService = cloudinaryService;
    }
    async authenticateRequest(req) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new common_1.UnauthorizedException('No authorization token');
        }
        try {
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : authHeader;
            const decoded = jwt.decode(token);
            if (!decoded) {
                throw new common_1.UnauthorizedException('Invalid token format');
            }
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTimestamp) {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            if (!decoded.email) {
                throw new common_1.UnauthorizedException('Token missing required fields');
            }
            console.log(' Token Decoded Successfully', {
                email: decoded.email,
                isExpired: decoded.exp ? decoded.exp < currentTimestamp : false
            });
            return {
                id: decoded.sub || decoded.email,
                sub: decoded.sub || decoded.email,
                email: decoded.email,
                role: decoded.role || 'instructor'
            };
        }
        catch (error) {
            console.error(' Token Verification Failed', {
                error: error.message,
                name: error.name,
                stack: error.stack
            });
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async learn(id, req) {
        const user = await this.authenticateRequest(req);
        return { message: `Displaying course materials for course with ID ${id}` };
    }
    async createCourse(req, courseData) {
        try {
            console.log(' Course Creation Request', {
                headers: req.headers,
                body: courseData
            });
            const user = await this.authenticateRequest(req);
            if (!courseData.title || !courseData.description || !courseData.category) {
                throw new common_1.BadRequestException('Missing required course fields');
            }
            const newCourse = await this.courseService.createCourse(courseData, {
                id: user.id,
                email: user.email,
                role: user.role
            });
            try {
                await this.notificationService.create({
                    userId: user.id,
                    title: 'Course Created Successfully',
                    message: `Your course "${courseData.title}" has been successfully created.`,
                    type: 'success',
                    category: 'course',
                    metadata: {
                        courseId: newCourse._id.toString(),
                        instructorId: user.id,
                        actionUrl: `/courses/${newCourse._id.toString()}`
                    }
                });
            }
            catch (notificationError) {
                console.warn('Failed to create notification:', notificationError);
            }
            const courseInsights = await this.generateCourseInsights(courseData);
            return {
                statusCode: 201,
                message: 'Course created successfully',
                data: {
                    course: {
                        ...newCourse,
                        _id: newCourse._id,
                        id: newCourse._id.toString()
                    },
                    insights: courseInsights
                }
            };
        }
        catch (error) {
            console.error('Course Creation Error', {
                error: error.message,
                stack: error.stack
            });
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create course');
        }
    }
    async generateCourseInsights(courseData) {
        try {
            const prompt = `Generate learning insights for a course with the following details:
        Title: ${courseData.title}
        Description: ${courseData.description}
        Category: ${courseData.category}
        Level: ${courseData.level}
        Topics: ${courseData.topics?.map(topic => `  - ${topic}`).join('\n') || '  - No topics specified'}

        Learning Objectives

        Suggestion: Define specific learning outcomes that students should achieve by the end of the course, such as:
          - Understand the core concepts of the course
          - Be able to apply learned skills in practical scenarios
          - Develop problem-solving skills related to the course topic

        Teaching Methods
          - Interactive lectures
          - Hands-on projects
          - Peer learning
          - Real-world case studies

        Recommended Resources
        ${courseData.resources?.map(resource => `  - ${resource}`).join('\n') || '  - No resources specified'}
`;
            const response = await this.geminiService.generateResponse(prompt, 'course_insights');
            return {
                aiGeneratedInsights: response,
                recommendedLearningPath: this.generateLearningPath(courseData)
            };
        }
        catch (error) {
            console.warn('Failed to generate course insights', error);
            return null;
        }
    }
    generateLearningPath(courseData) {
        const learningPath = [];
        switch (courseData.level) {
            case create_course_dto_2.CourseLevel.BEGINNER:
                learningPath.push('Foundational Concepts');
                learningPath.push('Basic Techniques');
                learningPath.push('Practical Exercises');
                break;
            case create_course_dto_2.CourseLevel.INTERMEDIATE:
                learningPath.push('Advanced Concepts');
                learningPath.push('Complex Problem Solving');
                learningPath.push('Real-world Applications');
                break;
            case create_course_dto_2.CourseLevel.ADVANCED:
                learningPath.push('Expert-level Techniques');
                learningPath.push('Cutting-edge Strategies');
                learningPath.push('Mastery Projects');
                break;
        }
        return learningPath;
    }
    async getAllCourses(req) {
        const user = await this.authenticateRequest(req);
        try {
            const courses = await this.courseService.findAllByEmail(user.email);
            return {
                message: 'Courses retrieved successfully',
                data: courses
            };
        }
        catch (error) {
            console.error('Course retrieval error:', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve courses');
        }
    }
    async getAllCoursesWithUser(req) {
        try {
            const user = await this.authenticateRequest(req);
            const email = user.email;
            if (!email) {
                throw new common_1.UnauthorizedException('User not authenticated or incomplete user data');
            }
            console.log(' CourseController findAll request:', {
                email,
                timestamp: new Date().toISOString()
            });
            const courses = await this.courseService.findAllByEmail(email);
            console.log(` Courses retrieved for ${email}:`, {
                count: courses.length
            });
            return { message: 'Courses retrieved successfully', data: courses };
        }
        catch (error) {
            console.error(' Error in findAll method:', {
                message: error.message,
                timestamp: new Date().toISOString()
            });
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException({
                message: 'Failed to retrieve courses',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    async generateCourse(createCourseDto, req) {
        const user = await this.authenticateRequest(req);
        const analysis = `
Course Information Analysis

Title: ${createCourseDto.title}

Description: ${createCourseDto.description}

Category: ${createCourseDto.category}

Level: ${createCourseDto.level}

Content Structure

Suggestion: Include specific topics that will be covered in the course, such as:
${createCourseDto.topics?.map(topic => `  - ${topic}`).join('\n') || '  - No topics specified'}

Learning Objectives

Suggestion: Define specific learning outcomes that students should achieve by the end of the course, such as:
  - Understand the core concepts of the course
  - Be able to apply learned skills in practical scenarios
  - Develop problem-solving skills related to the course topic

Teaching Methods
  - Interactive lectures
  - Hands-on projects
  - Peer learning
  - Real-world case studies

Recommended Resources
${createCourseDto.resources?.map(resource => `  - ${resource}`).join('\n') || '  - No resources specified'}
`;
        const aiEnhancedAnalysis = await this.generateCourseInsights(createCourseDto);
        return {
            analysis,
            aiInsights: aiEnhancedAnalysis,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
    async getCourseById(req, courseId) {
        try {
            const user = await this.authenticateRequest(req);
            if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                throw new common_1.BadRequestException('Invalid course ID');
            }
            const course = await this.courseService.findOne(courseId, user.email);
            if (!course) {
                throw new common_1.NotFoundException('Course not found');
            }
            return course;
        }
        catch (error) {
            console.error('Get Course Error', {
                error: error.message,
                stack: error.stack
            });
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to retrieve course');
        }
    }
    async updateCourseContent(req, courseId, contentData) {
        try {
            const user = await this.authenticateRequest(req);
            if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                throw new common_1.BadRequestException('Invalid course ID');
            }
            const updatedCourse = await this.courseService.updateCourseContent(courseId, contentData, {
                id: user.id,
                email: user.email,
                role: user.role
            });
            try {
                await this.notificationService.create({
                    userId: user.id,
                    title: 'Course Content Updated',
                    message: `Content for course "${updatedCourse.title}" has been updated.`,
                    type: 'info',
                    category: 'course',
                    metadata: {
                        courseId: updatedCourse._id.toString(),
                        instructorId: user.id,
                        actionUrl: `/courses/${updatedCourse._id.toString()}`
                    }
                });
            }
            catch (notificationError) {
                console.warn('Failed to create notification:', notificationError);
            }
            return updatedCourse;
        }
        catch (error) {
            console.error('Course Content Update Error', {
                error: error.message,
                stack: error.stack
            });
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update course content');
        }
    }
    async getCourseStats(req) {
        try {
            const user = await this.authenticateRequest(req);
            const stats = await this.courseService.getCourseStats(user.email);
            return {
                message: 'Course statistics retrieved successfully',
                data: stats
            };
        }
        catch (error) {
            console.error('Error retrieving course stats:', error);
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.UnauthorizedException('Unauthorized to retrieve course statistics');
            }
            else if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException('Invalid request for course statistics');
            }
            else {
                throw new common_1.InternalServerErrorException('Failed to retrieve course statistics');
            }
        }
    }
    async getInstructorStats(req) {
        try {
            const user = await this.authenticateRequest(req);
            const stats = await this.courseService.getInstructorStats(user.email);
            return {
                statusCode: 200,
                message: 'Instructor course statistics retrieved successfully',
                data: stats
            };
        }
        catch (error) {
            this.logger.error('Error retrieving instructor stats', {
                error: error.message,
                stack: error.stack
            });
            throw new common_1.InternalServerErrorException('Failed to retrieve instructor statistics');
        }
    }
    async updateCourse(req, courseId, updateData) {
        try {
            const user = await this.authenticateRequest(req);
            if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                throw new common_1.BadRequestException('Invalid course ID');
            }
            const updatedCourse = await this.courseService.updateCourse(courseId, updateData, {
                id: user.id,
                email: user.email,
                role: user.role
            });
            try {
                await this.notificationService.create({
                    userId: user.id,
                    title: 'Course Updated Successfully',
                    message: `Your course "${updatedCourse.title}" has been updated.`,
                    type: 'info',
                    category: 'course',
                    metadata: {
                        courseId: updatedCourse._id.toString(),
                        instructorId: user.id,
                        actionUrl: `/courses/${updatedCourse._id.toString()}`
                    }
                });
            }
            catch (notificationError) {
                console.warn('Failed to create notification:', notificationError);
            }
            const courseObject = updatedCourse;
            const improvementSuggestions = await this.generateCourseImprovementSuggestions(courseObject);
            return {
                statusCode: 200,
                message: 'Course updated successfully',
                data: {
                    course: {
                        ...updatedCourse,
                        _id: updatedCourse._id,
                        id: updatedCourse._id.toString()
                    },
                    improvementSuggestions
                }
            };
        }
        catch (error) {
            console.error('Course Update Error', {
                error: error.message,
                stack: error.stack
            });
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update course');
        }
    }
    async generateCourseImprovementSuggestions(course) {
        try {
            const prompt = `Analyze and provide improvement suggestions for a course:
        Title: ${course.title || 'Untitled Course'}
        Description: ${course.description || 'No description provided'}
        Category: ${course.category || 'Uncategorized'}
        Current Level: ${course.level || 'Not specified'}
        Existing Topics: ${course.topics?.join(', ') || 'No specific topics'}
        Learning Outcomes: ${course.learningOutcomes?.join(', ') || 'No specific learning outcomes'}
        Prerequisites: ${course.prerequisites?.join(', ') || 'No specific prerequisites'}
        Resources: ${course.resources?.join(', ') || 'No specific resources'}
        Sections: ${course.sections?.join(', ') || 'No specific sections'}`;
            const response = await this.geminiService.generateResponse(prompt, 'course_improvement');
            return {
                aiGeneratedSuggestions: response,
                potentialEnhancements: this.extractPotentialEnhancements(course)
            };
        }
        catch (error) {
            console.warn('Failed to generate course improvement suggestions', error);
            return null;
        }
    }
    extractPotentialEnhancements(course) {
        const enhancements = [];
        if (!course.learningOutcomes || course.learningOutcomes.length === 0) {
            enhancements.push('Add clear learning outcomes');
        }
        if (!course.prerequisites || course.prerequisites.length === 0) {
            enhancements.push('Define course prerequisites');
        }
        if (!course.resources || course.resources.length === 0) {
            enhancements.push('Include additional learning resources');
        }
        if (!course.sections || course.sections.length < 3) {
            enhancements.push('Expand course content with more sections');
        }
        return enhancements;
    }
    async updateContent(id, updateContentDto, req) {
        const user = await this.authenticateRequest(req);
        const updatedCourse = await this.courseService.updateContent(id, updateContentDto);
        return { message: 'Course content updated successfully', data: updatedCourse };
    }
    async remove(id, req) {
        const user = await this.authenticateRequest(req);
        return { message: 'Course deleted successfully', data: await this.courseService.remove(id) };
    }
    async getContent(id, req) {
        const user = await this.authenticateRequest(req);
        const course = await this.courseService.findOne(id);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return { message: 'Course content retrieved successfully', data: course.modules };
    }
    async uploadContent(id, file, req) {
        const user = await this.authenticateRequest(req);
        const fileUrl = `uploads/${file.filename}`;
        const course = await this.courseService.addContent(id, {
            title: file.originalname,
            url: fileUrl,
            type: file.mimetype
        });
        return { message: 'Course content uploaded successfully', data: course };
    }
    async generateContent(body, req) {
        const user = await this.authenticateRequest(req);
        try {
            const response = await this.geminiService.generateResponse(body.message, '');
            return { message: 'Content generated successfully', data: response };
        }
        catch (error) {
            console.error('Content generation error:', error);
            throw new common_1.InternalServerErrorException('Failed to generate content');
        }
    }
    async getCourseMaterials(courseId, req) {
        const user = await this.authenticateRequest(req);
        const materials = await this.courseService.getCourseMaterials(courseId);
        return { message: 'Course materials retrieved successfully', data: materials };
    }
    async addCourseMaterial(courseId, file, req) {
        try {
            const user = await this.authenticateRequest(req);
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            const fileUrl = await this.cloudinaryService.uploadFile(file, 'course-materials');
            const materialData = {
                url: fileUrl,
                name: file.originalname,
                type: this.getFileType(file.originalname),
                uploadedAt: new Date(),
                isDownloadable: true
            };
            await this.courseService.addMaterial(courseId, materialData);
            return {
                message: 'Material added successfully',
                data: materialData
            };
        }
        catch (error) {
            console.error('Error adding course material:', error);
            throw new common_1.InternalServerErrorException('Failed to add course material');
        }
    }
    getFileType(filename) {
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'pdf';
            case 'mp4':
            case 'avi':
            case 'mov':
                return 'video';
            default:
                return 'document';
        }
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Get)(':id/learn'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "learn", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAllCoursesWithUser", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "generateCourse", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific course by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course found successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Put)(':id/content'),
    (0, swagger_1.ApiOperation)({ summary: 'Update course content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course content updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid course content' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "updateCourseContent", null);
__decorate([
    (0, common_1.Get)('instructor/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourseStats", null);
__decorate([
    (0, common_1.Get)('instructor/stats'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive instructor course statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved instructor course statistics'
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getInstructorStats", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid course data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Put)(':id/content'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/content'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getContent", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "uploadContent", null);
__decorate([
    (0, common_1.Post)('generate-content'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "generateContent", null);
__decorate([
    (0, common_1.Get)(':courseId/materials'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourseMaterials", null);
__decorate([
    (0, common_1.Post)(':courseId/materials'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "addCourseMaterial", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('courses'),
    (0, swagger_1.ApiTags)('courses'),
    __metadata("design:paramtypes", [course_service_1.CourseService,
        notification_service_1.NotificationService,
        gemini_service_1.GeminiService,
        cloudinary_service_1.CloudinaryService])
], CourseController);
//# sourceMappingURL=course.controller.js.map