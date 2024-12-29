import express from 'express';
import { CoursesController } from '../courses/courses.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const coursesController = new CoursesController();

router.post('/courses', authMiddleware, coursesController.createCourse);
router.get('/courses', authMiddleware, coursesController.getCourses);

export default router; 