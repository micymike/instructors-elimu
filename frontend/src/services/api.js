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

export const settingsAPI = {
  async getSettings() {
    const response = await api.get('/api/settings');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.post('/api/settings', {
      personalInfo: profileData
    });
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('/api/settings', {
      passwordChange: passwordData
    });
    return response.data;
  },

  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post('/api/settings', 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
};

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
    const response = await api.post('/api/instructors/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/instructors/register', userData);
    return response.data;
  },

  async verifyEmail(email) {
    const response = await api.post('/api/auth/verify-email', { email });
    return response.data;
  },

  async verifyEmailToken(token) {
    const response = await api.get(`/api/auth/verify-email-token?token=${token}`);
    return response.data;
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