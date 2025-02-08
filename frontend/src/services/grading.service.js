import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class GradingService {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
    });
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return token 
      ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };
  }

  handleError(error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    toast.error(errorMessage);
    throw error;
  }

  async getAssignmentSubmissions(courseId, assignmentId) {
    try {
      const response = await this.axios.get(
        `/courses/${courseId}/assignments/${assignmentId}/submissions`,
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async submitGrade(courseId, assignmentId, studentId, gradeData) {
    try {
      const response = await this.axios.post(
        `/courses/${courseId}/assignments/${assignmentId}/students/${studentId}/grade`,
        gradeData,
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRubric(courseId, assignmentId) {
    try {
      const response = await this.axios.get(
        `/courses/${courseId}/assignments/${assignmentId}/rubric`,
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async saveRubric(courseId, assignmentId, rubricData) {
    try {
      const response = await this.axios.post(
        `/courses/${courseId}/assignments/${assignmentId}/rubric`,
        rubricData,
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async provideFeedback(courseId, assignmentId, studentId, feedback) {
    try {
      const response = await this.axios.post(
        `/courses/${courseId}/assignments/${assignmentId}/students/${studentId}/feedback`,
        feedback,
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getGradeStatistics(courseId, assignmentId) {
    try {
      const response = await this.axios.get(
        `/courses/${courseId}/assignments/${assignmentId}/statistics`,
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new GradingService();
