const express = require('express');
const router = express.Router();
const courseGenerationController = require('../controllers/course-generation.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Course generation endpoint
router.post('/generate', verifyToken, courseGenerationController.generateCourse.bind(courseGenerationController));

module.exports = router; 