const geminiService = require('../services/geminiService');

class CourseGenerationController {
  async generateCourse(req, res) {
    try {
      const { subject, educationLevel, term } = req.body;

      if (!subject || !educationLevel || !term) {
        return res.status(400).json({
          error: 'Missing required parameters'
        });
      }

      const courseContent = await geminiService.generateCourseContent({
        subject,
        educationLevel,
        term
      });

      res.json({
        success: true,
        data: courseContent
      });

    } catch (error) {
      console.error('Course generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate course content'
      });
    }
  }
}

module.exports = new CourseGenerationController(); 