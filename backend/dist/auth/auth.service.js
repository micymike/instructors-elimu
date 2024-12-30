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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const instructor_schema_1 = require("../instructor/instructor.schema");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(instructorModel, jwtService, configService) {
        this.instructorModel = instructorModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateOAuthUser(user) {
        let instructor = await this.instructorModel.findOne({ email: user.email.toLowerCase().trim() });
        if (!instructor) {
            instructor = new this.instructorModel({
                email: user.email.toLowerCase(),
                firstName: user.firstName,
                lastName: user.lastName,
            });
            await instructor.save();
        }
        return instructor;
    }
    async loginWithOAuth(user) {
        const payload = { email: user.email, sub: user._id, role: 'instructor' };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async loginWithEmailAndPassword(email, password) {
        try {
            const instructor = await this.instructorModel.findOne({ email: email.toLowerCase().trim() }).exec();
            if (!instructor) {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            const isValidPassword = await bcrypt.compare(password, instructor.password);
            if (!isValidPassword) {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            const jwtSecret = this.configService.get('JWT_SECRET');
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not configured');
            }
            const payload = {
                email: instructor.email,
                sub: instructor._id,
                role: 'instructor',
                isVerified: instructor.isVerified,
                status: instructor.status
            };
            return {
                success: true,
                data: {
                    access_token: this.jwtService.sign(payload, { secret: jwtSecret }),
                    instructor: {
                        id: instructor._id,
                        email: instructor.email,
                        firstName: instructor.firstName,
                        lastName: instructor.lastName,
                        isVerified: instructor.isVerified,
                        status: instructor.status
                    }
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Login failed', error instanceof common_1.UnauthorizedException ? common_1.HttpStatus.UNAUTHORIZED : common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async register(registerDto) {
        try {
            const existingUser = await this.instructorModel.findOne({
                email: registerDto.email.toLowerCase().trim()
            });
            if (existingUser) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Registration failed',
                    message: 'Email already exists'
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const newInstructor = new this.instructorModel({
                email: registerDto.email.toLowerCase().trim(),
                password: hashedPassword,
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                phoneNumber: registerDto.phoneNumber,
                expertise: registerDto.expertise,
                bio: registerDto.bio,
                education: registerDto.education,
                experience: registerDto.experience,
                teachingAreas: registerDto.teachingAreas
            });
            const savedInstructor = await newInstructor.save();
            console.log('Instructor saved successfully:', savedInstructor._id);
            const jwtSecret = this.configService.get('JWT_SECRET');
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not configured');
            }
            const payload = {
                email: savedInstructor.email,
                sub: savedInstructor._id,
                role: 'instructor'
            };
            return {
                success: true,
                message: 'Registration successful',
                data: {
                    access_token: this.jwtService.sign(payload, { secret: jwtSecret }),
                    instructor: {
                        id: savedInstructor._id,
                        email: savedInstructor.email,
                        firstName: savedInstructor.firstName,
                        lastName: savedInstructor.lastName,
                        isVerified: savedInstructor.isVerified,
                        status: savedInstructor.status
                    }
                }
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            throw new common_1.HttpException(error.response || error.message || 'Registration failed', error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(instructor_schema_1.Instructor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map