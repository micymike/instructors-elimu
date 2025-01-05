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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const instructor_schema_1 = require("../schemas/instructor.schema");
let UserService = UserService_1 = class UserService {
    constructor(instructorModel) {
        this.instructorModel = instructorModel;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async getUser() {
        return this.instructorModel.findOne();
    }
    async findByEmail(email) {
        try {
            if (!email) {
                this.logger.warn('Attempted to find user with empty email');
                return null;
            }
            const instructor = await this.instructorModel.findOne({ email }).lean();
            if (!instructor) {
                this.logger.log(`No instructor found with email: ${email}`);
                return null;
            }
            return {
                id: instructor._id?.toString() || '',
                sub: instructor._id?.toString() || '',
                email: instructor.email,
                role: instructor.status === 'active' ? 'instructor' : 'pending'
            };
        }
        catch (error) {
            this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
            return null;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(instructor_schema_1.Instructor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map