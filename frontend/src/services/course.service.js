import axios from 'axios';
import { API_URL } from '../config';

const CourseService = {
  // Get all courses for an instructor
  getInstructorCourses: async (instructorId, filters = {}) => {
    const response = await axios.get(`${API_URL}/courses/instructor/${instructorId}`, { params: filters });
    return response.data;
  },

  // Get course details
  getCourseDetails: async (courseId) => {
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await axios.post(`${API_URL}/courses`, courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    const response = await axios.put(`${API_URL}/courses/${courseId}`, courseData);
    return response.data;
  },

  // Get course metrics
  getCourseMetrics: async (courseId) => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/metrics`);
    return response.data;
  },

  // Get course students
  getCourseStudents: async (courseId) => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/students`);
    return response.data;
  },

  // Add student to course
  addStudentToCourse: async (courseId, studentId) => {
    const response = await axios.post(`${API_URL}/courses/${courseId}/students`, { studentId });
    return response.data;
  },

  // Get available students (not enrolled in the course)
  getAvailableStudents: async (courseId) => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/available-students`);
    return response.data;
  },

  // Update course content
  updateCourseContent: async (courseId, content) => {
    const response = await axios.put(`${API_URL}/courses/${courseId}/content`, content);
    return response.data;
  }
};

export default CourseService;
