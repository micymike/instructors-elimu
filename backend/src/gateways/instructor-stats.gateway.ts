import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CourseService } from '../services/course.service';
import { Logger, Injectable } from '@nestjs/common';

// Extend Socket interface to include custom properties
interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class InstructorStatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(InstructorStatsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly courseService: CourseService
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const user = client.user;
      if (!user) {
        client.disconnect(true);
        return;
      }

      this.logger.log(`Socket connected: ${user.email}`);
      
      // Initial stats fetch
      const stats = await this.courseService.getInstructorStats(user.email);
      client.emit('instructor_stats_update', stats);
    } catch (error) {
      this.logger.error('Socket connection error', error);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Socket disconnected: ${client.user?.email || 'Unknown'}`);
  }

  // Method to broadcast stats update to a specific instructor
  async broadcastInstructorStats(instructorEmail: string) {
    try {
      const stats = await this.courseService.getInstructorStats(instructorEmail);
      
      // Find all connected sockets for this instructor
      const sockets = await this.server.fetchSockets();
      const instructorSockets = Array.from(sockets).filter(
        (socket: any) => {
          // Type assertion to access custom properties
          const userEmail = (socket as any).user?.email;
          return userEmail === instructorEmail;
        }
      );

      // Emit stats to all of instructor's sockets
      instructorSockets.forEach(socket => {
        socket.emit('instructor_stats_update', stats);
      });
    } catch (error) {
      this.logger.error('Error broadcasting instructor stats', error);
    }
  }

  // Trigger stats update after course-related events
  async onCourseCreated(course: any) {
    await this.broadcastInstructorStats(course.instructor.email);
  }

  async onCourseUpdated(course: any) {
    await this.broadcastInstructorStats(course.instructor.email);
  }

  async onCourseDeleted(course: any) {
    await this.broadcastInstructorStats(course.instructor.email);
  }
}
