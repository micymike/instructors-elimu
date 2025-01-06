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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cloudinary_1 = require("cloudinary");
let ContentService = class ContentService {
    constructor(documentModel) {
        this.documentModel = documentModel;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    async getDocuments({ search, type, priceRange, sortBy, instructorId }) {
        const query = { instructorId: new mongoose_2.Types.ObjectId(instructorId) };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
        if (type && type !== 'all') {
            query.type = type;
        }
        if (priceRange && priceRange !== 'all') {
            switch (priceRange) {
                case 'free':
                    query.price = 0;
                    break;
                case 'paid':
                    query.price = { $gt: 0 };
                    break;
                case 'under10':
                    query.price = { $lt: 10 };
                    break;
                case 'over10':
                    query.price = { $gte: 10 };
                    break;
            }
        }
        const sort = {};
        switch (sortBy) {
            case 'newest':
                sort.createdAt = -1;
                break;
            case 'oldest':
                sort.createdAt = 1;
                break;
            case 'priceAsc':
                sort.price = 1;
                break;
            case 'priceDesc':
                sort.price = -1;
                break;
            case 'downloads':
                sort.downloadCount = -1;
                break;
            default:
                sort.createdAt = -1;
        }
        return this.documentModel.find(query).sort(sort);
    }
    async uploadDocument({ file, title, type, price, instructorId, tags }) {
        try {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: 'raw',
                    folder: 'documents',
                    allowed_formats: ['pdf', 'doc', 'docx']
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(file.buffer);
            });
            const document = new this.documentModel({
                title,
                type,
                price,
                instructorId: new mongoose_2.Types.ObjectId(instructorId),
                fileUrl: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                tags: tags || []
            });
            return await document.save();
        }
        catch (error) {
            throw new common_1.BadRequestException(`Document upload failed: ${error.message}`);
        }
    }
    async findDocumentById(documentId, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(documentId)) {
            throw new common_1.BadRequestException('Invalid document ID');
        }
        const document = await this.documentModel.findOne({
            _id: new mongoose_2.Types.ObjectId(documentId),
            instructorId: new mongoose_2.Types.ObjectId(userId)
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found or access denied');
        }
        return document;
    }
    async checkPlagiarism(documentId) {
        try {
            const document = await this.documentModel.findById(documentId);
            if (!document) {
                throw new common_1.BadRequestException('Document not found');
            }
            return {
                score: Math.random() * 10,
                results: []
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Plagiarism check failed: ${error.message}`);
        }
    }
    async deleteDocument(id, instructorId) {
        try {
            const document = await this.documentModel.findOne({
                _id: id,
                instructorId: new mongoose_2.Types.ObjectId(instructorId)
            });
            if (!document) {
                throw new common_1.BadRequestException('Document not found or unauthorized');
            }
            if (document.publicId) {
                await cloudinary_1.v2.uploader.destroy(document.publicId, { resource_type: 'raw' });
            }
            await document.deleteOne();
            return { message: 'Document deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Document deletion failed: ${error.message}`);
        }
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Document')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContentService);
//# sourceMappingURL=content.service.js.map