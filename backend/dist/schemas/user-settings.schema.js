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
exports.UserSettingsSchema = exports.UserSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let UserSettings = class UserSettings {
};
exports.UserSettings = UserSettings;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserSettings.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserSettings.prototype, "displayName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserSettings.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserSettings.prototype, "profileVisibility", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "showRatings", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "emailNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "courseUpdates", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "studentMessages", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "marketingEmails", void 0);
exports.UserSettings = UserSettings = __decorate([
    (0, mongoose_1.Schema)()
], UserSettings);
exports.UserSettingsSchema = mongoose_1.SchemaFactory.createForClass(UserSettings);
//# sourceMappingURL=user-settings.schema.js.map