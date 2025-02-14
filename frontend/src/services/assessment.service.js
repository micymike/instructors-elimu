import api from './api';

class AssessmentService {
  // Traditional Assignment endpoints
  async createAssignment(data) {
    return api.post('/assignments', data);
  }

  async updateAssignment(id, data) {
    return api.put(`/assignments/${id}`, data);
  }

  async getAssignment(id) {
    return api.get(`/assignments/${id}`);
  }

  async getAssignmentSubmissions(id) {
    return api.get(`/assignments/${id}/submissions`);
  }

  async getSubmissionDetails(submissionId) {
    return api.get(`/assignments/submissions/${submissionId}`);
  }

  // Assessment endpoints (quizzes and assignments)
  async createAssessment(data) {
    return api.post('/instructor/assessments', data);
  }

  async getAllAssessments() {
    return api.get('/instructor/assessments');
  }

  async getCourseAssessments(courseId) {
    return api.get(`/instructor/assessments/course/${courseId}`);
  }

  async getAssessmentDetails(id) {
    return api.get(`/instructor/assessments/${id}`);
  }

  async updateAssessment(id, data) {
    return api.put(`/instructor/assessments/${id}`, data);
  }

  async deleteAssessment(id) {
    return api.delete(`/instructor/assessments/${id}`);
  }

  async generateAIQuiz(courseId, options) {
    return api.post(`/instructor/assessments/ai-generate/${courseId}`, options);
  }
}

export default new AssessmentService();
