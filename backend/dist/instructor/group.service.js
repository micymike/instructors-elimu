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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_entity_1 = require("./entities/group.entity");
let GroupService = class GroupService {
    constructor(groupModel) {
        this.groupModel = groupModel;
    }
    async create(createGroupDto) {
        const group = new this.groupModel(createGroupDto);
        return group.save();
    }
    async findByInstructor(instructorId) {
        return this.groupModel.find({ instructorId }).exec();
    }
    async findAll() {
        return this.groupModel.find().exec();
    }
    async addStudents(groupId, studentIds) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        group.studentIds = [...new Set([...group.studentIds, ...studentIds])];
        return group.save();
    }
    async removeStudent(groupId, studentId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        group.studentIds = group.studentIds.filter(id => id !== studentId);
        return group.save();
    }
    async getGroupMeetings(groupId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        return group.meetingIds;
    }
    async update(groupId, updateGroupDto) {
        const group = await this.groupModel.findByIdAndUpdate(groupId, updateGroupDto, { new: true });
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        return group;
    }
    async delete(groupId) {
        const group = await this.groupModel.findByIdAndDelete(groupId);
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${groupId} not found`);
        }
        return group;
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_entity_1.Group.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GroupService);
//# sourceMappingURL=group.service.js.map