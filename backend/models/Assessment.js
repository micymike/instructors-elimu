const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: Number,
  type: String,
  question: String,
  options: [String],
  correctAnswer: String,
  points: Number,
});

const assessmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema],
  timeLimit: Number,
});

module.exports = mongoose.model('Assessment', assessmentSchema);
