const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateCourseContent({ subject, educationLevel, term, additionalPreferences = {} }) {
    const generationConfig = {
      temperature: 0.7, // Reduced for more consistent output
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const chatSession = this.model.startChat({ generationConfig });

    // Build course structure prompt
    const prompt = this._buildCoursePrompt(subject, educationLevel, term, additionalPreferences);

    try {
      // Generate initial course structure
      const courseStructureResult = await chatSession.sendMessage(prompt);
      const courseContent = JSON.parse(courseStructureResult.response.text());

      // Generate additional content for each unit
      for (const section of courseContent.curriculum.sections) {
        await this._enrichUnitContent(chatSession, section);
      }

      // Generate assessments
      const assessments = await this._generateAssessments(chatSession, courseContent);
      courseContent.assessments = assessments;

      // Generate resources and materials
      const resources = await this._generateResources(chatSession, courseContent);
      courseContent.resources = resources;

      return courseContent;
    } catch (error) {
      console.error('Error generating course content:', error);
      throw new Error('Failed to generate course content');
    }
  }

  _buildCoursePrompt(subject, educationLevel, term, preferences) {
    return `
      Create a detailed course curriculum for ${subject} at ${educationLevel} level for ${term}.
      Additional preferences: ${JSON.stringify(preferences)}
      
      Format the response as a JSON object with the following structure:
      {
        "basic": {
          "title": "",
          "description": "",
          "category": "${subject}",
          "educationLevel": "${educationLevel}",
          "term": "${term}",
          "totalDuration": "", // Expected course duration
          "weeklyCommitment": "", // Hours per week
          "prerequisites": [],
          "skillLevel": "" // Beginner/Intermediate/Advanced
        },
        "curriculum": {
          "sections": [
            {
              "unit": "Unit 1",
              "title": "",
              "duration": "", // Time estimate for the unit
              "learningObjectives": [],
              "lectures": [
                {
                  "title": "",
                  "type": "", // Lecture/Workshop/Lab/Discussion
                  "duration": "", // Time estimate
                  "description": "",
                  "keyTopics": [],
                  "activities": []
                }
              ]
            }
          ]
        },
        "requirements": {
          "technical": [],
          "knowledge": [],
          "equipment": []
        },
        "outcomes": {
          "skills": [],
          "knowledge": [],
          "projects": []
        }
      }`;
  }

  async _enrichUnitContent(chatSession, section) {
    const unitEnrichmentPrompt = `
      For the unit "${section.title}", provide detailed content including:
      1. Specific learning activities
      2. Hands-on exercises
      3. Discussion topics
      4. Practical examples
      5. Key terminology
      
      Format as JSON matching the existing structure.
    `;

    const enrichmentResult = await chatSession.sendMessage(unitEnrichmentPrompt);
    const enrichedContent = JSON.parse(enrichmentResult.response.text());
    Object.assign(section, enrichedContent);
  }

  async _generateAssessments(chatSession, courseContent) {
    const assessmentPrompt = `
      Based on the course content, generate comprehensive assessment plans including:
      1. Quizzes for each unit
      2. Assignments
      3. Projects
      4. Final assessment
      5. Grading rubrics
      
      Return as JSON with this structure:
      {
        "quizzes": [
          {
            "unit": "",
            "questions": [],
            "duration": "",
            "totalPoints": 0
          }
        ],
        "assignments": [
          {
            "title": "",
            "description": "",
            "objectives": [],
            "deliverables": [],
            "dueWeek": 0,
            "points": 0,
            "rubric": []
          }
        ],
        "projects": [],
        "finalAssessment": {},
        "gradingSchema": {}
      }
    `;

    const assessmentResult = await chatSession.sendMessage(assessmentPrompt);
    return JSON.parse(assessmentResult.response.text());
  }

  async _generateResources(chatSession, courseContent) {
    const resourcesPrompt = `
      Generate a comprehensive list of learning resources for this course including:
      1. Required materials
      2. Recommended readings
      3. Online resources
      4. Tools and software
      5. Additional reference materials
      
      Return as JSON with this structure:
      {
        "required": {
          "textbooks": [],
          "software": [],
          "materials": []
        },
        "recommended": {
          "readings": [],
          "tutorials": [],
          "tools": []
        },
        "supplementary": {
          "references": [],
          "websites": [],
          "communities": []
        }
      }
    `;

    const resourcesResult = await chatSession.sendMessage(resourcesPrompt);
    return JSON.parse(resourcesResult.response.text());
  }

  async validateCourseContent(courseContent) {
    // Implement validation logic here
    const requiredFields = [
      'basic.title',
      'basic.description',
      'curriculum.sections',
      'requirements',
      'outcomes'
    ];

    const errors = [];
    for (const field of requiredFields) {
      if (!this._getNestedValue(courseContent, field)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate section structure
    if (courseContent.curriculum?.sections) {
      for (const [index, section] of courseContent.curriculum.sections.entries()) {
        if (!section.title || !section.lectures || !Array.isArray(section.lectures)) {
          errors.push(`Invalid structure in section ${index + 1}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

module.exports = new GeminiService();