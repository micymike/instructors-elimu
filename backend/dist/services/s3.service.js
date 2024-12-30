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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('AWS_REGION'),
        });
    }
    async uploadProfilePicture(file, instructorId) {
        const key = `profile-pictures/${instructorId}/${(0, uuid_1.v4)()}-${file.originalname}`;
        const params = {
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        const result = await this.s3.upload(params).promise();
        return result.Location;
    }
    async deleteProfilePicture(url) {
        const key = url.split('/').slice(-2).join('/');
        const params = {
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            Key: key,
        };
        await this.s3.deleteObject(params).promise();
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map