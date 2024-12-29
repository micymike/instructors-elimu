const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateCourseContent(params) {
    try {
      const { subject, educationLevel, term } = params;
      
      const generationConfig = {
        temperature: 0.9,
        topP: 1,
        topK: 40,
        maxOutputTokens: 8192,
      };

      const prompt = `
        Create a detailed course curriculum for ${subject} at ${educationLevel} level for ${term}.
        Include:
        1. Course description (engaging and comprehensive)
        2. Learning objectives (specific and measurable)
        3. Prerequisites
        4. Course outline with:
           - Units/Chapters (well-structured)
           - Topics for each unit
           - Detailed descriptions
           - Learning activities
           - Assessment methods
        Format as JSON with this structure:
        {
          "title": "string",
          "description": "string",
          "category": "${subject}",
          "level": "${educationLevel}",
          "term": "${term}",
          "requirements": ["string"],
          "outcomes": ["string"],
          "sections": [
            {
              "title": "string",
              "description": "string",
              "lectures": [
                {
                  "title": "string",
                  "description": "string",
                  "type": "video|document|quiz",
                  "duration": "number"
                }
              ]
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const courseContent = JSON.parse(response.text());

      return courseContent;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate course content');
    }
  }
}

module.exports = new GeminiService(); 