import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

class AssessmentService {
  // Traditional Assignment endpoints
  async createAssignment(data) {
    const response = await axios.post(`${API_URL}/assignments`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  async updateAssignment(id, data) {
    const response = await axios.put(`${API_URL}/assignments/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  async getAssignment(id) {
    const response = await axios.get(`${API_URL}/assignments/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async getAssignmentSubmissions(id) {
    const response = await axios.get(`${API_URL}/assignments/${id}/submissions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async getSubmissionDetails(submissionId) {
    const response = await axios.get(`${API_URL}/assignments/submissions/${submissionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  // Assessment endpoints (quizzes and assignments)
  async createAssessment(data) {
    const response = await axios.post(`${API_URL}/instructor/assessments`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  async getAllAssessments() {
    const response = await axios.get(`${API_URL}/instructor/assessments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async getCourseAssessments(courseId) {
    const response = await axios.get(`${API_URL}/instructor/assessments/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async getAssessmentDetails(courseId) {
    const response = await axios.get(`${API_URL}/instructor/assessments/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async updateAssessment(id, data) {
    const response = await axios.put(`${API_URL}/instructor/assessments/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  async deleteAssessment(id) {
    const response = await axios.delete(`${API_URL}/instructor/assessments/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async generateAIQuiz(courseId, options) {
    const response = await axios.post(`${API_URL}/instructor/assessments/ai-generate/${courseId}`, options, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  async getAssessmentSubmissions(assessmentId) {
    const response = await axios.get(`${API_URL}/instructor/assessments/${assessmentId}/submissions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }

  async gradeSubmission(assessmentId, submissionId, gradeData) {
    const response = await axios.put(
      `${API_URL}/instructor/assessments/${assessmentId}/submissions/${submissionId}/grade`, 
      {
        earnedPoints: gradeData.totalPoints,
        feedback: gradeData.feedback
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  }

  async getCourseAssessmentStats(courseId) {
    const response = await axios.get(`${API_URL}/instructor/assessments/stats/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  }
}

export default new AssessmentService();
