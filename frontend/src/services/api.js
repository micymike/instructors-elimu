import axios from 'axios';

const API_BASE_URL = 'https://centralize-auth-elimu.onrender.com';

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

export const instructorAPI = {
  async getDashboard() {
    const response = await api.get('/api/instructors/profile/dashboard');
    return response.data;
  },

  async getDashboardStatistics() {
    const response = await api.get('/api/instructors/profile/dashboard-statistics');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/api/instructors/profile/update', profileData);
    return response.data;
  },

  async updateProfilePicture(pictureData) {
    const formData = new FormData();
    formData.append('profilePhoto', pictureData);
    const response = await api.put('/api/instructors/profile/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const instructorCourseAPI = {
  async createCourse(courseData) {
    const response = await api.post('/courses/instructor', courseData);
    return response.data;
  },

  async getAllCourses() {
    const response = await api.get('/courses/instructor');
    return response.data;
  },

  async getCourse(id) {
    const response = await api.get(`/courses/instructor/${id}`);
    return response.data;
  },

  async updateCourse(id, courseData) {
    const response = await api.patch(`/courses/instructor/${id}`, courseData);
    return response.data;
  },

  async deleteCourse(id) {
    const response = await api.delete(`/courses/instructor/${id}`);
    return response.data;
  },

  async getCourseAnalytics(courseId) {
    const response = await api.get(`/courses/instructor/${courseId}/analytics`);
    return response.data;
  }
};

// Course management methods
export const instructorCourseManagementAPI = {
  async getInstructorStats() {
    const response = await api.get('/api/instructors/profile/dashboard-statistics');
    return response.data;
  },

  async updateCourseContent(id, content) {
    const response = await api.put(`/instructor/courses/${id}/content`, content);
    return response.data;
  },

  async getCourseContent(id) {
    const response = await api.get(`/instructor/courses/${id}/content`);
    return response.data;
  },

  async uploadCourseFile(id, fileData) {
    const formData = new FormData();
    formData.append('file', fileData);
    const response = await api.post(`/instructor/courses/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async generateContent(params) {
    const response = await api.post('/instructor/ai-assistant/summarize', params);
    return response.data;
  },

  async getCourseMaterials(courseId) {
    const response = await api.get(`/instructor/multimedia/${courseId}`);
    return response.data;
  },

  async uploadCourseMaterial(courseId, materialData) {
    const response = await api.post('/instructor/multimedia/create', {
      courseId,
      ...materialData
    });
    return response.data;
  }
};

// Handle API requests for Instructor Profile-related functionalities
export const instructorAssessmentAPI = {
  // Course assessments
  async createAssessment(courseId, assessmentData) {
    const response = await api.post(`/instructor/assessments/course/${courseId}`, assessmentData);
    return response.data;
  },

  async getCourseAssessments(courseId) {
    const response = await api.get(`/instructor/assessments/course/${courseId}`);
    return response.data;
  },

  async getAssessmentSubmissions(assessmentId) {
    const response = await api.get(`/instructor/assessments/${assessmentId}/submissions`);
    return response.data;
  },

  async gradeSubmission(assessmentId, submissionId, gradeData) {
    const response = await api.put(
      `/instructor/assessments/${assessmentId}/submissions/${submissionId}/grade`, 
      gradeData
    );
    return response.data;
  },

  async getAssessmentStats(courseId) {
    const response = await api.get(`/instructor/assessments/stats/course/${courseId}`);
    return response.data;
  },

  // AI-assisted assessment generation
  async generateAssessment(courseId) {
    const response = await api.post(`/instructor/assessments/ai-generate/${courseId}`);
    return response.data;
  }
};

export const instructorMultimediaAPI = {
  async createContent(contentData) {
    const response = await api.post('/instructor/multimedia/create', contentData);
    return response.data;
  },

  async getCourseContent(courseId) {
    const response = await api.get(`/instructor/multimedia/${courseId}`);
    return response.data;
  }
};

export const instructorQuizAPI = {
  async createQuiz(quizData) {
    const response = await api.post('/instructor/quizzes/create', quizData);
    return response.data;
  },

  async getCourseQuizzes(courseId) {
    const response = await api.get(`/instructor/quizzes/${courseId}`);
    return response.data;
  }
};

export const instructorInteractiveAPI = {
  async createElement(elementData) {
    const response = await api.post('/instructor/interactive-elements/create', elementData);
    return response.data;
  },

  async getCourseElements(courseId) {
    const response = await api.get(`/instructor/interactive-elements/${courseId}`);
    return response.data;
  }
};

export const instructorSettingsAPI = {
  // Get the Instructor's Profile
  async getProfile() {
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
  async updateProfilePicture(file) {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await api.put('/api/instructors/profile/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid file format or size');
      }
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

export const instructorProfileAPI = {
  // Get the Instructor's Profile
  async getProfile() {
    const response = await api.get('/api/instructors/profile');
    return response.data;
  },

  // Update Instructor Profile
  async updateProfile(profileData) {
    const response = await api.put('/api/instructors/profile/update', profileData);
    return response.data;
  },

  // Get Instructor Dashboard Stats
  async getDashboardStats() {
    const response = await api.get('/api/instructors/profile/dashboard');
    return response.data;
  },

  // Update Profile Picture
  async updateProfilePicture(file) {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await api.put('/api/instructors/profile/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid file format or size');
      }
      throw new Error('Failed to update profile picture');
    }
  }
};

export const instructorDocumentsAPI = {
  async getAllDocuments() {
    const response = await api.get('/api/instructors/documents');
    return response.data;
  },

  async uploadDocument(fileData) {
    const formData = new FormData();
    formData.append('file', fileData);
    const response = await api.post('/api/instructors/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async checkPlagiarism(documentData) {
    const response = await api.post('/api/instructors/documents/check-plagiarism', documentData);
    return response.data;
  },

  async previewDocument(id) {
    const response = await api.get(`/api/instructors/documents/${id}/preview`);
    return response.data;
  },

  async downloadDocument(id) {
    const response = await api.get(`/api/instructors/documents/${id}/download`);
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/api/instructors/documents/${id}`);
    return response.data;
  }
};

export const instructorAuthAPI = {
  async login(credentials) {
    const authService = await import('./auth.service');
    return authService.default.login(credentials);
  },

  async register(instructorData) {
    const response = await api.post('/auth/register/instructor', instructorData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async uploadCV(id, cvData) {
    const formData = new FormData();
    formData.append('cv', cvData);
    const response = await api.post(`/auth/register/instructor/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  async verifyEmail(email) {
    const response = await api.post('/auth/verify-email', { email });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export const virtualClassAPI = {
  async getAllClasses() {
    const response = await api.get('/api/instructors/virtual-classes');
    return response.data;
  },

  async createClass(classData) {
    const response = await api.post('/api/instructors/virtual-classes', classData);
    return response.data;
  },

  async getClassDetails(classId) {
    const response = await api.get(`/api/instructors/virtual-classes/${classId}`);
    return response.data;
  },

  async updateClass(classId, classData) {
    const response = await api.patch(`/api/instructors/virtual-classes/${classId}`, classData);
    return response.data;
  },

  async deleteClass(classId) {
    const response = await api.delete(`/api/instructors/virtual-classes/${classId}`);
    return response.data;
  },

  async getJoinUrl(classId) {
    const response = await api.get(`/api/instructors/virtual-classes/${classId}/join`);
    return response.data;
  },

  async createGroupClass(groupId, classData) {
    const response = await api.post(`/api/instructors/virtual-classes/group/${groupId}`, classData);
    return response.data;
  }
};

export const instructorScheduleAPI = {
  async getInstructorSchedule() {
    const response = await api.get('/api/instructors/schedule');
    return response.data;
  },

  async createInstructorEvent(eventData) {
    const response = await api.post('/api/instructors/schedule', eventData);
    return response.data;
  }
};

export const instructorResourceAPI = {
  async downloadResource(courseId, resourceId) {
    const response = await api.get(`/api/instructor/courses/${courseId}/resources/${resourceId}/download`, {
      responseType: 'blob'
    });
    return {
      data: response.data,
      filename: response.headers['x-filename'] || 'resource'
    };
  },

  async uploadResource(courseId, file, metadata) {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => formData.append(key, metadata[key]));
    
    const response = await api.post(`/api/instructor/courses/${courseId}/resources`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getResources(params) {
    const response = await api.get('/api/instructor/content/resources', { params });
    return response.data;
  },

  async previewResource(courseId, resourceId) {
    const response = await api.get(`/api/instructor/courses/${courseId}/resources/${resourceId}/preview`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export const instructorLiveSessionAPI = {
  async createLiveSession(courseId, sessionData) {
    const response = await api.post(`/api/instructor/live-sessions/${courseId}`, sessionData);
    return response.data;
  },

  async updateLiveSession(courseId, sessionId, sessionData) {
    const response = await api.put(`/api/instructor/live-sessions/${courseId}/${sessionId}`, sessionData);
    return response.data;
  },

  async deleteLiveSession(courseId, sessionId) {
    const response = await api.delete(`/api/instructor/live-sessions/${courseId}/${sessionId}`);
    return response.data;
  },

  async getLiveSessions(courseId) {
    const response = await api.get(`/api/instructor/live-sessions/${courseId}`);
    return response.data;
  }
};

export const instructorGroupAPI = {
  async getInstructorGroups() {
    const response = await api.get('/api/instructors/groups');
    return response.data;
  },

  async createInstructorGroup(groupData) {
    const response = await api.post('/api/instructors/groups', groupData);
    return response.data;
  }
};

export const instructorContentGenerationAPI = {
  async generateContent(content) {
    const response = await api.post('/instructor/ai-assistant/generate', content);
    return response.data;
  },

  async summarizeContent(content) {
    const response = await api.post('/instructor/ai-assistant/summarize', content);
    return response.data;
  }
};

export const instructorModuleAPI = {
  async createModule(moduleData) {
    const response = await api.post('/instructor/modules', moduleData);
    return response.data;
  },

  async getAllModules() {
    const response = await api.get('/instructor/modules');
    return response.data;
  },

  async getModule(id) {
    const response = await api.get(`/instructor/modules/${id}`);
    return response.data;
  },

  async updateModule(id, moduleData) {
    const response = await api.put(`/instructor/modules/${id}`, moduleData);
    return response.data;
  },

  async deleteModule(id) {
    const response = await api.delete(`/instructor/modules/${id}`);
    return response.data;
  },

  async addLessonToModule(moduleId, lessonId) {
    const response = await api.post(`/instructor/modules/${moduleId}/lessons/${lessonId}`);
    return response.data;
  },

  async removeLessonFromModule(moduleId, lessonId) {
    const response = await api.delete(`/instructor/modules/${moduleId}/lessons/${lessonId}`);
    return response.data;
  }
};

export const instructorLessonAPI = {
  async createLesson(lessonData) {
    const response = await api.post('/instructor/lessons', lessonData);
    return response.data;
  },

  async getAllLessons() {
    const response = await api.get('/instructor/lessons');
    return response.data;
  },

  async getLesson(id) {
    const response = await api.get(`/instructor/lessons/${id}`);
    return response.data;
  },

  async getLessonsByModule(moduleId) {
    const response = await api.get(`/instructor/lessons/module/${moduleId}`);
    return response.data;
  },

  async updateLesson(id, lessonData) {
    const response = await api.put(`/instructor/lessons/${id}`, lessonData);
    return response.data;
  },

  async deleteLesson(id) {
    const response = await api.delete(`/instructor/lessons/${id}`);
    return response.data;
  }
};

export const instructorNotesAPI = {
  async createNote(noteData) {
    const response = await api.post('/api/instructors/notes', noteData);
    return response.data;
  },

  async getAllNotes() {
    const response = await api.get('/api/instructors/notes');
    return response.data;
  },

  async searchNotes(query) {
    const response = await api.get('/api/instructors/notes/search', { params: { query } });
    return response.data;
  },

  async getNote(id) {
    const response = await api.get(`/api/instructors/notes/${id}`);
    return response.data;
  },

  async updateNote(id, noteData) {
    const response = await api.put(`/api/instructors/notes/${id}`, noteData);
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/api/instructors/notes/${id}`);
    return response.data;
  }
};

export const instructorAIChatAPI = {
  async sendMessage(message) {
    const response = await api.post('/instructor/ai-chat', message);
    return response.data;
  },

  async provideFeedback(chatId, feedback) {
    const response = await api.post(`/instructor/ai-chat/${chatId}/feedback`, feedback);
    return response.data;
  }
};

export const instructorAnalyticsAPI = {
  async getCourseAnalytics(courseId) {
    const response = await api.get(`/instructor/courses/${courseId}/analytics`);
    return response.data;
  }
};

export const instructorAccessibilityAPI = {
  async transcribe(data) {
    const response = await api.post('/accessibility/transcribe', data);
    return response.data;
  },

  async generateCaptions(data) {
    const response = await api.post('/accessibility/captions', data);
    return response.data;
  },

  async synthesizeSpeech(data) {
    const response = await api.post('/accessibility/synthesize', data);
    return response.data;
  }
};

// Course progress API implementation
export const instructorCourseProgressAPI = {
  async getCourseProgress(courseId) {
    const response = await api.get(`/instructor/courses/${courseId}/progress`);
    return response.data;
  },

  async updateCourseProgress(courseId, progressData) {
    const response = await api.put(`/instructor/courses/${courseId}/progress`, progressData);
    return response.data;
  }
};

// Zoom API
export const zoomAPI = {
  async getAllMeetings() {
    const response = await api.get('/zoom/meetings');
    return response;
  },

  async createMeeting(meetingData) {
    const response = await api.post('/zoom/meetings', meetingData);
    return response;
  },

  async getMeetingDetails(meetingId) {
    const response = await api.get(`/zoom/meetings/${meetingId}`);
    return response;
  },

  async updateMeeting(meetingId, meetingData) {
    const response = await api.patch(`/zoom/meetings/${meetingId}`, meetingData);
    return response;
  },

  async deleteMeeting(meetingId) {
    const response = await api.delete(`/zoom/meetings/${meetingId}`);
    return response;
  },

  async createGroupMeeting(groupId, meetingData) {
    const response = await api.post(`/zoom/meetings/group/${groupId}`, meetingData);
    return response;
  }
};

export const instructorStudentAnalysisAPI = {
  async getStudentAnalysis(courseId, studentId) {
    if (!courseId || !studentId) {
      throw new Error('Course ID and Student ID are required');
    }

    try {
      const response = await api.get(`/instructor/student-analysis/course/${courseId}/student/${studentId}`);
      return response.data;
    } catch (error) {
      // Handle various error cases
      if (error.response?.status === 404) {
        throw new Error('Student analysis data not found');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request. Please check the course and student IDs');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view this student\'s data');
      }
      throw error;
    }
  },

  async getCourseAnalytics(courseId) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId(courseId)) {
      throw new Error('Invalid course ID format');
    }

    try {
      const response = await api.get(`/instructor/student-analysis/course/${courseId}/analytics`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Course analytics data not found');
      }
      throw error;
    }
  }
};

// Backwards compatibility exports
export const courseProgressAPI = instructorCourseProgressAPI;
export const liveSessionAPI = instructorLiveSessionAPI;
export const resourceAPI = instructorResourceAPI;
export const authAPI = instructorAuthAPI;
export const courseAPI = instructorCourseAPI;
export const assessmentAPI = instructorAssessmentAPI;
export const multimediaAPI = instructorMultimediaAPI;
export const quizAPI = instructorQuizAPI;
export const interactiveAPI = instructorInteractiveAPI;
export const settingsAPI = instructorSettingsAPI;
export const documentsAPI = instructorDocumentsAPI;
export const classAPI = virtualClassAPI;
export const notesAPI = instructorNotesAPI;
export const aiChatAPI = instructorAIChatAPI;
export const groupAPI = instructorGroupAPI;
export const scheduleAPI = instructorScheduleAPI;
export const moduleAPI = instructorModuleAPI;
export const lessonAPI = instructorLessonAPI;
export const analyticsAPI = instructorAnalyticsAPI;
export const accessibilityAPI = instructorAccessibilityAPI;
export const contentGenerationAPI = instructorContentGenerationAPI;

export { api };
