const express = require('express');
const router = express.Router();
const courseGenerationController = require('../controllers/courseGenerationController');
const authMiddleware = require('../middleware/auth');

router.post(
  '/generate',
  authMiddleware.verifyToken,
  authMiddleware.isInstructor,
  courseGenerationController.generateCourse
);

module.exports = router; 