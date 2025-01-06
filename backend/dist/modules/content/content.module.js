"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const content_controller_1 = require("./content.controller");
const content_service_1 = require("./content.service");
const document_schema_1 = require("./schemas/document.schema");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
let ContentModule = class ContentModule {
};
exports.ContentModule = ContentModule;
exports.ContentModule = ContentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: document_schema_1.Document.name, schema: document_schema_1.DocumentSchema }]),
            cloudinary_module_1.CloudinaryModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' }
            })
        ],
        controllers: [content_controller_1.ContentController],
        providers: [content_service_1.ContentService],
        exports: [content_service_1.ContentService]
    })
], ContentModule);
//# sourceMappingURL=content.module.js.map