"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path = require("path");
const fs = require("fs");
const common_1 = require("@nestjs/common");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        if (!file) {
            return callback(new common_1.BadRequestException('No file uploaded'), false);
        }
        const allowedMimeTypes = ['application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new common_1.BadRequestException('Only PDF files are allowed'), false);
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return callback(new common_1.BadRequestException('File size exceeds 10MB limit'), false);
        }
        if (!file.buffer || file.buffer.length === 0) {
            return callback(new common_1.BadRequestException('Empty file'), false);
        }
        callback(null, true);
    }
};
//# sourceMappingURL=multer.config.js.map