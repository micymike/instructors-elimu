import ApiService from './api.service';

class GradingService {
  async getAssignmentSubmissions(courseId, assignmentId) {
    try {
      const response = await ApiService.axios.get(
        `/courses/${courseId}/assignments/${assignmentId}/submissions`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async submitGrade(courseId, assignmentId, studentId, gradeData) {
    try {
      const response = await ApiService.axios.post(
        `/courses/${courseId}/assignments/${assignmentId}/students/${studentId}/grade`,
        gradeData,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async getRubric(courseId, assignmentId) {
    try {
      const response = await ApiService.axios.get(
        `/courses/${courseId}/assignments/${assignmentId}/rubric`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async saveRubric(courseId, assignmentId, rubricData) {
    try {
      const response = await ApiService.axios.post(
        `/courses/${courseId}/assignments/${assignmentId}/rubric`,
        rubricData,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async provideFeedback(courseId, assignmentId, studentId, feedback) {
    try {
      const response = await ApiService.axios.post(
        `/courses/${courseId}/assignments/${assignmentId}/students/${studentId}/feedback`,
        feedback,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async getGradeStatistics(courseId, assignmentId) {
    try {
      const response = await ApiService.axios.get(
        `/courses/${courseId}/assignments/${assignmentId}/statistics`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }
}

export default new GradingService();
