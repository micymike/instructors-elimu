const Course = require('../models/course.model');

class CourseService {
  async createCourse(courseData, instructorId) {
    try {
      const course = new Course({
        ...courseData,
        instructor: instructorId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await course.save();
      return course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async getCoursesByInstructor(instructorId) {
    try {
      return await Course.find({ instructor: instructorId })
        .populate('instructor', 'firstName lastName email')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }

  async getCourseById(courseId) {
    try {
      return await Course.findById(courseId)
        .populate('instructor', 'firstName lastName email');
    } catch (error) {
      console.error('Error getting course:', error);
      throw error;
    }
  }

  async updateCourse(courseId, updateData) {
    try {
      return await Course.findByIdAndUpdate(
        courseId,
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      await Course.findByIdAndDelete(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
}

module.exports = new CourseService(); 