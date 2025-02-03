import axios from 'axios';
import { API_URL } from '../config';

const AIAssistantService = {
  // Get AI response for a query
  getResponse: async (query, context) => {
    const response = await axios.post(`${API_URL}/ai/chat`, {
      query,
      context
    });
    return response.data;
  },

  // Get course-specific guidance
  getCourseGuidance: async (courseId, topic) => {
    const response = await axios.post(`${API_URL}/ai/course-guidance`, {
      courseId,
      topic
    });
    return response.data;
  },

  // Get personalized learning recommendations
  getLearningRecommendations: async (studentId) => {
    const response = await axios.get(`${API_URL}/ai/recommendations/${studentId}`);
    return response.data;
  },

  // Get instant assignment feedback
  getAssignmentFeedback: async (assignmentId, submission) => {
    const response = await axios.post(`${API_URL}/ai/assignment-feedback`, {
      assignmentId,
      submission
    });
    return response.data;
  }
};

export default AIAssistantService;
