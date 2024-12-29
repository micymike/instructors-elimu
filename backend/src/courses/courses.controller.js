import { Course } from './course.schema';
import { HttpException } from '../utils/HttpException';

export class CoursesController {
  async createCourse(req, res) {
    try {
      const courseData = {
        ...req.body,
        instructor: req.user._id, // Assuming you have auth middleware setting req.user
      };

      const course = await Course.create(courseData);
      await course.populate('instructor', 'firstName lastName avatar department');
      
      res.status(201).json(course);
    } catch (error) {
      throw new HttpException('Failed to create course', 500);
    }
  }

  async getCourses(req, res) {
    try {
      const courses = await Course.find({ instructor: req.user._id })
        .populate('instructor', 'firstName lastName avatar department');
      
      res.json(courses);
    } catch (error) {
      throw new HttpException('Failed to fetch courses', 500);
    }
  }
} 