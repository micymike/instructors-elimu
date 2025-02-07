import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const courseAPI = {
  // Course Management
  async getCourseToLearn(id) {
    const response = await api.get(`/api/courses/${id}/learn`);
    return response.data;
  },

  async createCourse(courseData) {
    const response = await api.post('/api/courses', courseData);
    return response.data;
  },

  async getAllCourses() {
    const response = await api.get('/api/courses/all');
    return response.data;
  },

  async getCoursesList() {
    const response = await api.get('/api/courses/list');
    return response.data;
  },

  async generateCourse(params) {
    const response = await api.post('/api/courses/generate', params);
    return response.data;
  },

  async getCourse(id) {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  },

  async updateCourse(id, courseData) {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
  },

  async deleteCourse(id) {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
  },

  async getInstructorStats() {
    const response = await api.get('/api/courses/instructor/stats');
    return response.data;
  },

  async updateCourseContent(id, content) {
    const response = await api.put(`/api/courses/${id}/content`, content);
    return response.data;
  },

  async getCourseContent(id) {
    const response = await api.get(`/api/courses/${id}/content`);
    return response.data;
  },

  async uploadCourseFile(id, fileData) {
    const formData = new FormData();
    formData.append('file', fileData);
    const response = await api.post(`/api/courses/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async generateContent(params) {
    const response = await api.post('/api/courses/generate-content', params);
    return response.data;
  },

  async getCourseMaterials(courseId) {
    const response = await api.get(`/api/courses/${courseId}/materials`);
    return response.data;
  },

  async uploadCourseMaterial(courseId, materialData) {
    const response = await api.post(`/api/courses/${courseId}/materials`, materialData);
    return response.data;
  }
};

// Handle API requests for Instructor Profile-related functionalities
export const settingsAPI = {
  // Get the Instructor's Profile
  async getSettings() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.get('/api/instructors/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data', error);
      throw error;
    }
  },

  // Update Instructor Profile
  async updateProfile(updateProfileDto, profilePhoto) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('updateProfileDto', JSON.stringify(updateProfileDto));

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      const response = await api.put('/api/instructors/profile/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile', error);
      throw error;
    }
  },

  // Get Instructor Dashboard Stats
  async getDashboardStats() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.get('/api/instructors/profile/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
      throw error;
    }
  },

  // Withdraw Funds
  async withdrawFunds(amount, phoneNumber) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.post('/api/instructors/profile/withdraw', {
        amount,
        phoneNumber,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error withdrawing funds', error);
      throw error;
    }
  },

  // Check Withdrawal Status
  async checkWithdrawalStatus(checkoutRequestId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.get(`/api/instructors/profile/withdraw/status/${checkoutRequestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking withdrawal status', error);
      throw error;
    }
  },

  // Get All Withdrawal Transactions
  async getWithdrawalStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.get('/api/instructors/profile/withdraw/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting withdrawal transactions', error);
      throw error;
    }
  },

  // Delete Instructor Profile
  async deleteProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.delete('/api/instructors/profile/delete', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting profile', error);
      throw error;
    }
  },

  // Update Profile Picture
  async updateProfilePicture(profilePhoto) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto);

    try {
      const response = await api.put('/api/instructors/profile/profile-picture', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile picture', error);
      throw error;
    }
  },


  async requestPasswordReset(passwordData) {
    try {
      const response = await api.post('/api/auth/request-password-reset', 
        {
          email: passwordData.email,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Log successful password reset request
      console.log('Password reset request sent successfully', response.data);

      return response.data;
    } catch (error) {
      // Enhanced error logging
      console.error('Password reset request error:', error.response ? error.response.data : error.message);
      
      // Throw a more informative error
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to request password reset');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error('Error setting up password reset request');
      }
    }
  },

  async changePassword(passwordData) {
    // Note: Backend doesn't currently support password change
    throw new Error('Password change is not currently supported.');
  }
};
// src/api/auth.js

// src/api/index.js (main API configuration)

export const documentsAPI = {
  async getAllDocuments() {
    const response = await api.get('/api/documents');
    return response.data;
  },

  async uploadDocument(fileData) {
    const formData = new FormData();
    formData.append('file', fileData);
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async checkPlagiarism(documentData) {
    const response = await api.post('/api/documents/check-plagiarism', documentData);
    return response.data;
  },

  async previewDocument(id) {
    const response = await api.get(`/api/documents/${id}/preview`);
    return response.data;
  },

  async downloadDocument(id) {
    const response = await api.get(`/api/documents/${id}/download`);
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/api/documents/${id}`);
    return response.data;
  }
};

export const authAPI = {
  async login(credentials) {
    try {
      // Log base URL and credentials for debugging
      console.log('Login Configuration:', {
        baseURL: API_BASE_URL,
        loginEndpoint: '/auth/login/instructor',
        email: credentials.email,
        passwordLength: credentials.password.length
      });

      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Attempt to log in with full configuration logging
      const response = await api.post('/auth/login/instructor', credentials, {
        // Explicitly remove Authorization header
        headers: {
          'Authorization': undefined,
          // Ensure correct content type
          'Content-Type': 'application/json'
        },
        // Add timeout to catch network issues
        timeout: 10000
      });
      
      // Log full response details
      console.log('Login API Full Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      // Validate response structure more comprehensively
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      // Check for token in multiple possible locations
      const token = 
        response.data.token || 
        response.data.access_token || 
        response.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new Error('No authentication token found in response');
      }

      // Store token in local storage
      localStorage.setItem('token', token);
      
      return response.data;
    } catch (error) {
      // Comprehensive error logging
      console.error('Login API Detailed Error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });

      // Clear any existing tokens
      localStorage.removeItem('token');

      // Detailed error handling
      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid credentials. Please check your email and password.');
          case 403:
            throw new Error('Access denied. Your account may be locked or inactive.');
          case 404:
            throw new Error('Login service not found. Please contact support.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        // Request made but no response received
        throw new Error('No response from server. Please check your network connection.');
      } else if (error.code === 'ECONNABORTED') {
        // Request timed out
        throw new Error('Login request timed out. Please check your internet connection.');
      } else {
        // Something else went wrong
        throw new Error('An unexpected error occurred during login. Please try again.');
      }
    }
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    // Store token in local storage after registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async registerInstructor(instructorData) {
    const response = await api.post('/auth/register/instructor', instructorData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    // Store token in local storage after instructor registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async verifyEmail(email) {
    const response = await api.post('/auth/verify-email', { email });
    return response.data;
  },

  async verifyEmailToken(token) {
    const response = await api.post('/auth/verify-email-token', { token });
    return response.data;
  },

  // Add a logout method to clear the token
  logout() {
    localStorage.removeItem('token');
  }
};

export const zoomAPI = {
  async getAllMeetings() {
    const response = await api.get('/api/zoom/meetings');
    return response.data;
  },

  async createMeeting(meetingData) {
    const response = await api.post('/api/zoom/meetings', meetingData);
    return response.data;
  },

  async getMeetingDetails(meetingId) {
    const response = await api.get(`/api/zoom/meetings/${meetingId}`);
    return response.data;
  },

  async updateMeeting(meetingId, meetingData) {
    const response = await api.patch(`/api/zoom/meetings/${meetingId}`, meetingData);
    return response.data;
  },

  async deleteMeeting(meetingId) {
    const response = await api.delete(`/api/zoom/meetings/${meetingId}`);
    return response.data;
  },

  async getJoinUrl(meetingId) {
    const response = await api.get(`/api/zoom/meetings/${meetingId}/join`);
    return response.data;
  },

  async createGroupMeeting(groupId, meetingData) {
    const response = await api.post(`/api/zoom/meetings/group/${groupId}`, meetingData);
    return response.data;
  }
};

export const scheduleAPI = {
  async getSchedule() {
    const response = await api.get('/api/schedule');
    return response.data;
  },

  async createEvent(eventData) {
    const response = await api.post('/api/schedule', eventData);
    return response.data;
  }
};

export const groupAPI = {
  async getAllGroups() {
    const response = await api.get('/api/groups');
    return response.data;
  },

  async createGroup(groupData) {
    const response = await api.post('/api/groups', groupData);
    return response.data;
  }
};

export const courseProgressAPI = {
  async getCourseProgress(courseId) {
    const response = await api.get(`/api/courses/${courseId}/progress`);
    return response.data;
  },

  async updateCourseProgress(courseId, progressData) {
    const response = await api.post(`/api/courses/${courseId}/progress`, progressData);
    return response.data;
  }
};

export const liveSessionAPI = {
  async deleteLiveSession(courseId, sessionId) {
    const response = await api.delete(`/api/live-sessions/${courseId}/${sessionId}`);
    return response.data;
  }
};



