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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
let GroupsController = class GroupsController {
    constructor() {
        this.groups = [
            { _id: '1', name: 'Group A', instructorId: 'Instructor 1', studentIds: ['Student 1', 'Student 2'] },
            { _id: '2', name: 'Group B', instructorId: 'Instructor 2', studentIds: ['Student 3'] },
        ];
    }
    findAll() {
        return this.groups;
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findAll", null);
exports.GroupsController = GroupsController = __decorate([
    (0, common_1.Controller)('api/groups')
], GroupsController);
//# sourceMappingURL=groups.controller.js.map