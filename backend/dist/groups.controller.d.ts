export declare class GroupsController {
    private readonly groups;
    findAll(): {
        _id: string;
        name: string;
        instructorId: string;
        studentIds: string[];
    }[];
}
