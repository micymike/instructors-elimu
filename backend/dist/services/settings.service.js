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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const instructor_schema_1 = require("../schemas/instructor.schema");
let SettingsService = SettingsService_1 = class SettingsService {
    constructor(instructorModel) {
        this.instructorModel = instructorModel;
        this.logger = new common_1.Logger(SettingsService_1.name);
    }
    async getUserSettings(email) {
        try {
            this.logger.log(`Attempting to retrieve settings for email: ${email}`);
            const instructor = await this.instructorModel.findOne({ email });
            this.logger.log(`Instructor query result: ${JSON.stringify(instructor)}`);
            if (!instructor) {
                this.logger.error(`No instructor found with email: ${email}`);
                const allInstructors = await this.instructorModel.find({}, { email: 1 });
                this.logger.log(`Existing instructors: ${JSON.stringify(allInstructors.map(i => i.email))}`);
                throw new common_1.InternalServerErrorException(`Instructor not found with email: ${email}`);
            }
            return {
                personalInfo: {
                    firstName: instructor.firstName,
                    lastName: instructor.lastName,
                    email: instructor.email,
                    role: instructor.status === 'active' ? 'instructor' : 'pending',
                    isVerified: instructor.isVerified,
                    expertise: instructor.expertise,
                    profilePicture: instructor.profilePicture
                },
                preferences: {
                    notifications: true,
                    language: 'en',
                    theme: 'light'
                },
                teachingProfile: {
                    phoneNumber: instructor.phoneNumber,
                    experience: instructor.experience,
                    education: instructor.education,
                    certification: instructor.certification,
                    teachingAreas: instructor.teachingAreas,
                    bio: instructor.bio
                }
            };
        }
        catch (error) {
            this.logger.error(`Error retrieving instructor settings for ${email}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to retrieve instructor settings');
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(instructor_schema_1.Instructor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map