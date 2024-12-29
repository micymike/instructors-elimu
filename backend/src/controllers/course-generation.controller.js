const { GeminiService } = require('../services/gemini.service');
const courseService = require('../services/course.service');

class CourseGenerationController {
  constructor() {
    this.geminiService = new GeminiService();
  }

  async generateCourse(req, res) {
    try {
      const { message, context } = req.body;
      const instructorId = req.user.sub; // Get instructor ID from JWT token

      // Determine what stage of the conversation we're in
      const stage = this.determineConversationStage(context);
      
      // Generate appropriate response based on stage
      const response = await this.geminiService.generateResponse(message, stage);

      // If this is the final stage, generate and save course structure
      if (stage === 'final') {
        const courseData = await this.geminiService.generateCourseStructure(context);
        
        // Save the course to MongoDB
        const savedCourse = await courseService.createCourse(courseData, instructorId);

        return res.json({
          message: "I've generated your course structure! You can now review and customize it.",
          courseData: savedCourse
        });
      }

      // Otherwise, return the next question
      return res.json({
        message: response
      });

    } catch (error) {
      console.error('Course generation error:', error);
      res.status(500).json({
        message: 'Failed to generate course content',
        error: error.message
      });
    }
  }

  determineConversationStage(context) {
    // Analyze context to determine what information we already have
    const messages = context.map(msg => msg.content.toLowerCase());
    
    if (!messages.some(msg => msg.includes('subject'))) return 'subject';
    if (!messages.some(msg => msg.includes('audience'))) return 'audience';
    if (!messages.some(msg => msg.includes('duration'))) return 'duration';
    if (!messages.some(msg => msg.includes('objectives'))) return 'objectives';
    return 'final';
  }
}

module.exports = new CourseGenerationController(); 