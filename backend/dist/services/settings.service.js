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
    async getUserSettings(email, includeProfilePicture = false) {
        try {
            this.logger.log(`Attempting to retrieve settings for email: ${email}`);
            this.logger.log(`Include profile picture: ${includeProfilePicture}`);
            if (!email) {
                this.logger.error('No email provided');
                throw new common_1.InternalServerErrorException('Email is required');
            }
            try {
                await this.instructorModel.db.db.admin().ping();
                this.logger.log('Database connection is active');
            }
            catch (connectionError) {
                this.logger.error('Database connection failed', connectionError);
                throw new common_1.InternalServerErrorException('Database connection error');
            }
            const instructor = await this.instructorModel.findOne({ email }).lean();
            this.logger.log(`Instructor query result: ${JSON.stringify(instructor)}`);
            if (!instructor) {
                this.logger.error(`No instructor found with email: ${email}`);
                const allInstructors = await this.instructorModel.find({}, { email: 1 }).lean();
                this.logger.log(`Existing instructors: ${JSON.stringify(allInstructors.map(i => i.email))}`);
                throw new common_1.InternalServerErrorException(`Instructor not found with email: ${email}`);
            }
            const personalInfo = {
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                email: instructor.email,
                phone: instructor.phoneNumber,
                expertise: instructor.expertise,
                bio: instructor.bio
            };
            if (includeProfilePicture && instructor.profilePicture) {
                personalInfo.profilePicture = {
                    data: instructor.profilePicture,
                    contentType: 'image/jpeg',
                    originalName: 'profile_picture'
                };
            }
            return {
                personalInfo,
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
            this.logger.error(`Comprehensive error retrieving instructor settings for ${email}`, {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack,
                email: email
            });
            throw new common_1.InternalServerErrorException({
                message: 'Failed to retrieve instructor settings',
                details: {
                    email: email,
                    errorMessage: error.message
                }
            });
        }
    }
    async updateUserSettings(email, settingsData) {
        try {
            this.logger.log(`Attempting to update settings for email: ${email}`);
            this.logger.log(`Update data: ${JSON.stringify(settingsData)}`);
            if (!email) {
                this.logger.error('No email provided');
                throw new common_1.InternalServerErrorException('Email is required');
            }
            const existingInstructor = await this.instructorModel.findOne({ email });
            if (!existingInstructor) {
                this.logger.error(`Instructor not found with email: ${email}`);
                throw new common_1.InternalServerErrorException(`Instructor not found with email: ${email}`);
            }
            const updateFields = {};
            const personalInfo = settingsData.personalInfo || settingsData;
            if (personalInfo) {
                if (personalInfo.firstName)
                    updateFields.firstName = personalInfo.firstName;
                if (personalInfo.lastName)
                    updateFields.lastName = personalInfo.lastName;
                if (personalInfo.phone)
                    updateFields.phoneNumber = personalInfo.phone;
                if (personalInfo.expertise)
                    updateFields.expertise = personalInfo.expertise;
                if (personalInfo.bio)
                    updateFields.bio = personalInfo.bio;
            }
            if (personalInfo && personalInfo.profilePicture) {
                updateFields.profilePicture = personalInfo.profilePicture.data
                    || personalInfo.profilePicture
                    || existingInstructor.profilePicture;
            }
            if (Object.keys(updateFields).length === 0) {
                this.logger.warn('No valid update fields provided');
                return {
                    personalInfo: {
                        firstName: existingInstructor.firstName,
                        lastName: existingInstructor.lastName,
                        email: existingInstructor.email,
                        phone: existingInstructor.phoneNumber,
                        expertise: existingInstructor.expertise,
                        bio: existingInstructor.bio,
                        profilePicture: existingInstructor.profilePicture ? {
                            data: existingInstructor.profilePicture,
                            contentType: 'image/jpeg',
                            originalName: 'profile_picture'
                        } : null
                    },
                    preferences: {
                        notifications: true,
                        language: 'en',
                        theme: 'light'
                    },
                    teachingProfile: {
                        phoneNumber: existingInstructor.phoneNumber,
                        experience: existingInstructor.experience,
                        education: existingInstructor.education,
                        certification: existingInstructor.certification,
                        teachingAreas: existingInstructor.teachingAreas,
                        bio: existingInstructor.bio
                    }
                };
            }
            const updatedInstructor = await this.instructorModel.findOneAndUpdate({ email }, { $set: updateFields }, {
                new: true,
                runValidators: true
            });
            if (!updatedInstructor) {
                this.logger.error(`Failed to update instructor with email: ${email}`);
                throw new common_1.InternalServerErrorException(`Instructor not found with email: ${email}`);
            }
            this.logger.log(`Instructor updated successfully: ${JSON.stringify(updatedInstructor)}`);
            return {
                personalInfo: {
                    firstName: updatedInstructor.firstName,
                    lastName: updatedInstructor.lastName,
                    email: updatedInstructor.email,
                    phone: updatedInstructor.phoneNumber,
                    expertise: updatedInstructor.expertise,
                    bio: updatedInstructor.bio,
                    profilePicture: updatedInstructor.profilePicture ? {
                        data: updatedInstructor.profilePicture,
                        contentType: 'image/jpeg',
                        originalName: 'profile_picture'
                    } : null
                },
                preferences: {
                    notifications: true,
                    language: 'en',
                    theme: 'light'
                },
                teachingProfile: {
                    phoneNumber: updatedInstructor.phoneNumber,
                    experience: updatedInstructor.experience,
                    education: updatedInstructor.education,
                    certification: updatedInstructor.certification,
                    teachingAreas: updatedInstructor.teachingAreas,
                    bio: updatedInstructor.bio
                }
            };
        }
        catch (error) {
            this.logger.error(`Comprehensive error updating instructor settings for ${email}`, {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack,
                email: email,
                settingsData: settingsData
            });
            throw new common_1.InternalServerErrorException({
                message: 'Failed to update instructor settings',
                details: {
                    email: email,
                    errorMessage: error.message
                }
            });
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