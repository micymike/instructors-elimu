import { api } from './api';

const CourseService = {
  /**
   * Get course analytics
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Object>} Course analytics
   */
  async getCourseAnalytics(courseId) {
    try {
      console.group('Course Analytics Request');
      console.log('Fetching analytics for courseId:', courseId);
      
      if (!courseId) {
        throw new Error('Course ID is undefined');
      }

      const response = await api.get(`/courses/instructor/${courseId}/analytics`);
      
      console.log('Raw Response:', response);
      console.log('Response Data:', response.data);
      console.groupEnd();

      // Normalize the response to ensure all expected fields exist
      return {
        totalEnrollments: response.data.totalEnrollments || 0,
        completedEnrollments: response.data.completedEnrollments || 0,
        averageProgress: response.data.averageProgress || 0,
        recentEnrollments: response.data.recentEnrollments || 0,
        completionRate: response.data.performanceMetrics?.completionRate || 0,
        averageQuizScore: response.data.performanceMetrics?.averageQuizScore || 0,
        studentDemographics: response.data.studentDemographics || {
          ageGroups: {},
          countries: {}
        }
      };
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      console.log('Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        courseId: courseId
      });
      throw error;
    }
  },

  /**
   * Get course details
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Object>} Course details
   */
  async getCourseDetails(courseId) {
    try {
      console.group('Course Details Request');
      console.log('Fetching details for courseId:', courseId);
      
      if (!courseId) {
        throw new Error('Course ID is undefined');
      }

      const response = await api.get(`/courses/instructor/${courseId}`);
      
      console.log('Raw Response:', response);
      console.log('Response Data:', response.data);
      console.groupEnd();

      // Normalize the response to ensure all expected fields exist
      return {
        id: response.data.id,
        title: response.data.title || 'Untitled Course',
        description: response.data.description || '',
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      };
    } catch (error) {
      console.error('Error fetching course details:', error);
      console.log('Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        courseId: courseId
      });
      throw error;
    }
  },

  /**
   * Get all courses
   * @returns {Promise<Object>} All courses
   */
  async getAllCourses() {
    try {
      console.log('Fetching all courses');
      const response = await api.get('/courses/instructor');
      
      console.group('All Courses Response');
      console.log('Raw Response:', response);
      console.log('Response Data:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      console.log('Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
};

export default CourseService;
