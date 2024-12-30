import { GroupService } from './group.service';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    createGroup(createGroupDto: any): Promise<import("./entities/group.entity").Group>;
    getAllGroups(): Promise<import("./entities/group.entity").Group[]>;
    updateGroup(id: string, updateGroupDto: any): Promise<import("./entities/group.entity").Group>;
    deleteGroup(id: string): Promise<import("./entities/group.entity").Group>;
    addStudents(id: string, studentIds: string[]): Promise<import("./entities/group.entity").Group>;
    removeStudent(id: string, studentId: string): Promise<import("./entities/group.entity").Group>;
}
