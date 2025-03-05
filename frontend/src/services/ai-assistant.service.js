import { contentGenerationAPI } from './api';

export const AIAssistantService = {
  async generateContent(data) {
    return contentGenerationAPI.generateContent(data);
  },

  async summarizeContent(content) {
    return contentGenerationAPI.summarizeContent(content);
  },

  async generateQuiz(courseId) {
    return contentGenerationAPI.generateQuiz(courseId);
  }
};

export default AIAssistantService;
