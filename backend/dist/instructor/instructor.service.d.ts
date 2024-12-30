import { Repository } from 'typeorm';
import { Instructor } from './instructor.entity';
interface DashboardStats {
    coursesCreated: number;
    studentsEnrolled: number;
    revenueGenerated: number;
}
export declare class InstructorService {
    private readonly instructorRepository;
    constructor(instructorRepository: Repository<Instructor>);
    findAll(): Promise<Instructor[]>;
    findOne(id: number): Promise<Instructor>;
    update(id: number, updateInstructorDto: any): Promise<Instructor>;
    remove(id: number): Promise<void>;
    getDashboardStats(instructorId: string): Promise<DashboardStats>;
}
export {};
