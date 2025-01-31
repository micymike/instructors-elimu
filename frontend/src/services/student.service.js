import ApiService from './api.service';

class StudentService {
  async getStudentProgress(studentId, courseId) {
    try {
      const response = await ApiService.axios.get(
        `/students/${studentId}/courses/${courseId}/progress`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async getStudentEngagement(studentId, courseId) {
    try {
      const response = await ApiService.axios.get(
        `/students/${studentId}/courses/${courseId}/engagement`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async getStudentAnalytics(studentId, courseId) {
    try {
      const response = await ApiService.axios.get(
        `/students/${studentId}/courses/${courseId}/analytics`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async getStudentAssignments(studentId, courseId) {
    try {
      const response = await ApiService.axios.get(
        `/students/${studentId}/courses/${courseId}/assignments`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async getStudentModuleProgress(studentId, courseId, moduleId) {
    try {
      const response = await ApiService.axios.get(
        `/students/${studentId}/courses/${courseId}/modules/${moduleId}/progress`,
        {
          headers: ApiService.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      ApiService.handleError(error);
    }
  }

  async updateStudentProgress(studentId, courseId, progressData) {
    try {
      const response = await ApiService.axios.put(
        `/students/${studentId}/courses/${courseId}/progress`,
        progressData,
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

export default new StudentService();
