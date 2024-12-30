import { Model } from 'mongoose';
import { Group } from './entities/group.entity';
export declare class GroupService {
    private groupModel;
    constructor(groupModel: Model<Group>);
    create(createGroupDto: {
        name: string;
        instructorId: string;
        description?: string;
        studentIds?: string[];
    }): Promise<Group>;
    findByInstructor(instructorId: string): Promise<Group[]>;
    findAll(): Promise<Group[]>;
    addStudents(groupId: string, studentIds: string[]): Promise<Group>;
    removeStudent(groupId: string, studentId: string): Promise<Group>;
    getGroupMeetings(groupId: string): Promise<any[]>;
    update(groupId: string, updateGroupDto: any): Promise<Group>;
    delete(groupId: string): Promise<Group>;
}
