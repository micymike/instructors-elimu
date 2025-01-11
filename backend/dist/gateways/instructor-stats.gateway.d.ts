import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CourseService } from '../services/course.service';
interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class InstructorStatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly courseService;
    private readonly logger;
    server: Server;
    constructor(courseService: CourseService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    broadcastInstructorStats(instructorEmail: string): Promise<void>;
    onCourseCreated(course: any): Promise<void>;
    onCourseUpdated(course: any): Promise<void>;
    onCourseDeleted(course: any): Promise<void>;
}
export {};
