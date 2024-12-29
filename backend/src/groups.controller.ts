import { Controller, Get } from '@nestjs/common';

@Controller('api/groups')
export class GroupsController {
    private readonly groups = [
        { _id: '1', name: 'Group A', instructorId: 'Instructor 1', studentIds: ['Student 1', 'Student 2'] },
        { _id: '2', name: 'Group B', instructorId: 'Instructor 2', studentIds: ['Student 3'] },
    ];

    @Get()
    findAll() {
        return this.groups;
    }
}
