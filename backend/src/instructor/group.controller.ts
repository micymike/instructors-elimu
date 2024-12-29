import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post()
    createGroup(@Body() createGroupDto: any) {
        return this.groupService.create(createGroupDto);
    }

    @Get()
    getAllGroups() {
        return this.groupService.findAll();
    }

    @Patch(':id')
    updateGroup(@Param('id') id: string, @Body() updateGroupDto: any) {
        return this.groupService.update(id, updateGroupDto);
    }

    @Delete(':id')
    deleteGroup(@Param('id') id: string) {
        return this.groupService.delete(id);
    }

    @Post(':id/students')
    addStudents(@Param('id') id: string, @Body() studentIds: string[]) {
        return this.groupService.addStudents(id, studentIds);
    }

    @Delete(':id/students/:studentId')
    removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
        return this.groupService.removeStudent(id, studentId);
    }
}