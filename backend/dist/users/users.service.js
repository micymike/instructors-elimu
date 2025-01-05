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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    findByEmail(email) {
        throw new Error('Method not implemented.');
    }
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword
        });
        return createdUser.save();
    }
    async findOne(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }
    async updatePreferences(id, preferences) {
        return this.userModel
            .findByIdAndUpdate(id, { preferences }, { new: true })
            .exec();
    }
    async addCourse(userId, courseId) {
        return this.userModel
            .findByIdAndUpdate(userId, { $addToSet: { courses: courseId } }, { new: true })
            .exec();
    }
    async removeCourse(userId, courseId) {
        return this.userModel
            .findByIdAndUpdate(userId, { $pull: { courses: courseId } }, { new: true })
            .exec();
    }
    async verifyEmail(token) {
        return this.userModel
            .findOneAndUpdate({ verificationToken: token }, { isVerified: true, verificationToken: null }, { new: true })
            .exec();
    }
    async setResetPasswordToken(email, token, expires) {
        return this.userModel
            .findOneAndUpdate({ email }, {
            resetPasswordToken: token,
            resetPasswordExpires: expires
        }, { new: true })
            .exec();
    }
    async resetPassword(token, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.userModel
            .findOneAndUpdate({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        }, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }, { new: true })
            .exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map