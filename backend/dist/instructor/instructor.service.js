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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const instructor_entity_1 = require("./instructor.entity");
let InstructorService = class InstructorService {
    constructor(instructorRepository) {
        this.instructorRepository = instructorRepository;
    }
    async findAll() {
        return this.instructorRepository.find();
    }
    async findOne(id) {
        return this.instructorRepository.findOne({ where: { id } });
    }
    async update(id, updateInstructorDto) {
        const instructor = await this.instructorRepository.findOne({ where: { id } });
        if (!instructor) {
            throw new Error('Instructor not found');
        }
        Object.assign(instructor, updateInstructorDto);
        return this.instructorRepository.save(instructor);
    }
    async remove(id) {
        await this.instructorRepository.delete(id);
    }
    async getDashboardStats(instructorId) {
        return {
            coursesCreated: 0,
            studentsEnrolled: 0,
            revenueGenerated: 0,
        };
    }
};
exports.InstructorService = InstructorService;
exports.InstructorService = InstructorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(instructor_entity_1.Instructor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InstructorService);
//# sourceMappingURL=instructor.service.js.map