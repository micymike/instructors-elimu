import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variables safely
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
    this.axios = axios.create({
      baseURL: this.baseURL,
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
    
    // Log the error for debugging
    console.error('API Error:', error);

    // Show user-friendly toast
    toast.error(errorMessage);

    // Throw the error for further handling
    throw error;
  }

  // Authentication Endpoints
  async login(credentials) {
    try {
      const response = await this.axios.post('/auth/login', credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await this.axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Users Endpoints
  async getCurrentUser() {
    try {
      const response = await this.axios.get('/users/me', {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Courses Endpoints
  async getAllCourses(filters = {}) {
    try {
      const response = await this.axios.get('/courses', {
        headers: this.getHeaders(),
        params: filters
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createCourse(courseData) {
    try {
      const response = await this.axios.post('/courses', courseData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await this.axios.put(`/courses/${courseId}`, courseData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await this.axios.get(`/courses/${courseId}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await this.axios.delete(`/courses/${courseId}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCourseContent(courseId, contentData) {
    try {
      const response = await this.axios.put(`/courses/${courseId}/content`, contentData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Swagger Documentation
  async getApiDocumentation() {
    try {
      const response = await axios.get(`${this.baseURL.replace('/api', '')}/api-docs`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch API documentation', error);
      return null;
    }
  }
}

export default new ApiService();
