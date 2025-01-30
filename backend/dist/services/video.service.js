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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_schema_1 = require("../schemas/video.schema");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let VideoService = class VideoService {
    constructor(videoModel, configService) {
        this.videoModel = videoModel;
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async create(createVideoDto, instructorId) {
        const video = new this.videoModel(Object.assign(Object.assign({}, createVideoDto), { instructor: instructorId }));
        const savedVideo = await video.save();
        return Object.assign(Object.assign({}, savedVideo.toObject()), { id: savedVideo._id.toString() });
    }
    async findAll(instructorId, query) {
        const { visibility, tags, search, page = 1, limit = 10, sort = '-createdAt', } = query;
        const filter = { instructor: instructorId };
        if (visibility) {
            filter.visibility = visibility;
        }
        if (tags && tags.length > 0) {
            filter.tags = { $all: tags };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [videos, total] = await Promise.all([
            this.videoModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('instructor', 'firstName lastName email')
                .populate('courses', 'title'),
            this.videoModel.countDocuments(filter),
        ]);
        const videosWithId = videos.map(video => (Object.assign(Object.assign({}, video.toObject()), { id: video._id.toString() })));
        return { videos: videosWithId, total };
    }
    async findOne(id, instructorId) {
        const video = await this.videoModel
            .findOne({ _id: id, instructor: instructorId })
            .populate('instructor', 'firstName lastName email')
            .populate('courses', 'title');
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return Object.assign(Object.assign({}, video.toObject()), { id: video._id.toString() });
    }
    async update(id, updateVideoDto, instructorId) {
        const video = await this.videoModel.findOneAndUpdate({ _id: id, instructor: instructorId }, { $set: updateVideoDto }, { new: true });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return Object.assign(Object.assign({}, video.toObject()), { id: video._id.toString() });
    }
    async remove(id, instructorId) {
        const video = await this.videoModel.findOne({ _id: id, instructor: instructorId });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        try {
            await cloudinary_1.v2.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
        }
        catch (error) {
            console.error('Error deleting video from Cloudinary:', error);
        }
        await video.deleteOne();
    }
    async getCloudinarySignature() {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const params = {
            timestamp,
            folder: 'videos',
            resource_type: 'video',
        };
        const signature = cloudinary_1.v2.utils.api_sign_request(params, this.configService.get('CLOUDINARY_API_SECRET'));
        return {
            signature,
            timestamp,
            cloudName: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            apiKey: this.configService.get('CLOUDINARY_API_KEY'),
        };
    }
    async incrementViews(id) {
        await this.videoModel.updateOne({ _id: id }, { $inc: { views: 1 } });
    }
    async addToCourse(videoId, courseId, instructorId) {
        const video = await this.videoModel.findOneAndUpdate({ _id: videoId, instructor: instructorId }, { $addToSet: { courses: courseId } }, { new: true });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return Object.assign(Object.assign({}, video.toObject()), { id: video._id.toString() });
    }
    async removeFromCourse(videoId, courseId, instructorId) {
        const video = await this.videoModel.findOneAndUpdate({ _id: videoId, instructor: instructorId }, { $pull: { courses: courseId } }, { new: true });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return Object.assign(Object.assign({}, video.toObject()), { id: video._id.toString() });
    }
    async validateVideo(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size should be less than 100MB');
        }
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Allowed types: MP4, WebM, QuickTime');
        }
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], VideoService);
//# sourceMappingURL=video.service.js.map