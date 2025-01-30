const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// Get all assessments
router.get('/get-assessments', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments' });
  }
});

// Create a new assessment
router.post('/assessments', async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    const savedAssessment = await newAssessment.save();
    res.status(201).json(savedAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Error saving assessment' });
  }
});

// Delete an assessment
router.delete('/delete-assessment/:id', async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assessment' });
  }
});

module.exports = router;
