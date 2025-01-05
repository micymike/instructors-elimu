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
exports.InstructorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const instructor_schema_1 = require("../schemas/instructor.schema");
let InstructorService = class InstructorService {
    constructor(instructorModel) {
        this.instructorModel = instructorModel;
    }
    async findAll() {
        return this.instructorModel.find().exec();
    }
    async findOne(id) {
        const instructor = await this.instructorModel.findById(id).exec();
        if (!instructor) {
            throw new common_1.NotFoundException(`Instructor with ID ${id} not found`);
        }
        return instructor;
    }
    async update(id, updateInstructorDto) {
        const updatedInstructor = await this.instructorModel
            .findByIdAndUpdate(id, updateInstructorDto, { new: true })
            .exec();
        if (!updatedInstructor) {
            throw new common_1.NotFoundException(`Instructor with ID ${id} not found`);
        }
        return updatedInstructor;
    }
    async updateProfilePicture(id, url) {
        const updatedInstructor = await this.instructorModel
            .findByIdAndUpdate(id, { profilePicture: url }, { new: true })
            .exec();
        if (!updatedInstructor) {
            throw new common_1.NotFoundException(`Instructor with ID ${id} not found`);
        }
        return updatedInstructor;
    }
    async remove(id) {
        const deletedInstructor = await this.instructorModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedInstructor) {
            throw new common_1.NotFoundException(`Instructor with ID ${id} not found`);
        }
        return deletedInstructor;
    }
    async getDashboardStats(instructorId) {
        return {
            coursesCreated: 0,
            studentsEnrolled: 0,
            revenueGenerated: 0,
        };
    }
    async getUserDetails(instructorId) {
        try {
            const instructor = await this.instructorModel
                .findById(instructorId)
                .select('-password')
                .exec();
            if (!instructor) {
                throw new common_1.NotFoundException('Instructor not found');
            }
            return {
                id: instructor._id,
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                email: instructor.email,
                profilePicture: instructor.profilePicture,
                expertise: instructor.expertise,
                bio: instructor.bio,
                isVerified: instructor.isVerified,
                status: instructor.status
            };
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not retrieve instructor details');
        }
    }
};
exports.InstructorService = InstructorService;
exports.InstructorService = InstructorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(instructor_schema_1.Instructor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InstructorService);
//# sourceMappingURL=instructor.service.js.map