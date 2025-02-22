import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateAssessment = () => {
  const [assessment, setAssessment] = useState({
    title: '',
    courseId: '',
    type: 'quiz',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    dueDate: null,
    isPublished: false,
    totalPoints: 0
  });

  const [aiOptions, setAiOptions] = useState({
    topic: '',
    difficulty: 'medium',
    numberOfQuestions: 10,
    questionTypes: ['multiple_choice']
  });

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    text: '',
    points: 1,
    choices: ['', '', '', ''],
    correctAnswer: '',
    matchingPairs: [{ left: '', right: '' }]
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate total points whenever questions change
  useEffect(() => {
    const total = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    setAssessment(prev => ({ ...prev, totalPoints: total }));
  }, [assessment.questions]);

  const addQuestion = () => {
    const questionError = validateQuestion(newQuestion);
    if (questionError) {
      setErrors({ questions: questionError });
      return;
    }

    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setNewQuestion({
      type: 'multiple_choice',
      text: '',
      points: 1,
      choices: ['', '', '', ''],
      correctAnswer: '',
      matchingPairs: [{ left: '', right: '' }]
    });
  };

  const validateQuestion = (question) => {
    if (!question.text) return 'Question text is required';
    if (question.points < 1) return 'Points must be at least 1';
    
    switch(question.type) {
      case 'multiple_choice':
        if (!question.correctAnswer) return 'Select correct answer';
        if (question.choices.some(c => !c)) return 'All choices must be filled';
        break;
      case 'matching':
        if (question.matchingPairs.some(p => !p.left || !p.right)) 
          return 'All matching pairs must be filled';
        break;
      case 'true_false':
        if (typeof question.correctAnswer !== 'boolean')
          return 'Select true/false answer';
        break;
    }
    return null;
  };

  const handleMatchingPairChange = (index, field, value) => {
    const newPairs = [...newQuestion.matchingPairs];
    newPairs[index][field] = value;
    setNewQuestion({ ...newQuestion, matchingPairs: newPairs });
  };

  const generateAIAssessment = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      
      if (!assessment.courseId) {
        setErrors({ apiError: 'Course ID is required for AI generation' });
        return;
      }

      const response = await axios.post(
        `${API_URL}/instructor/assessments/ai-generate/${assessment.courseId}`,
        aiOptions,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setAssessment(prev => ({
        ...prev,
        questions: response.data.questions
      }));
      setSuccessMessage('AI Assessment generated successfully!');
    } catch (error) {
      console.error('Error generating AI assessment:', error);
      setErrors({ apiError: error.response?.data?.message || 'Failed to generate AI assessment' });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAssessment = async () => {
    const formErrors = {
      title: !assessment.title && 'Title is required',
      courseId: !assessment.courseId && 'Course ID is required',
      questions: assessment.questions.length === 0 && 'At least one question is required'
    };

    if (Object.values(formErrors).some(e => e)) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.post(`${API_URL}/instructor/assessments`, assessment, config);
      setSuccessMessage('Assessment created successfully!');
      
      // Reset form
      setAssessment({
        title: '',
        courseId: '',
        type: 'quiz',
        description: '',
        questions: [],
        timeLimit: 30,
        passingScore: 70,
        dueDate: null,
        isPublished: false,
        totalPoints: 0
      });
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        apiError: error.response?.data?.message || 
                 'Failed to create assessment. Check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Create New Assessment
        </h1>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {errors.apiError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {errors.apiError}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Title*
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                value={assessment.title}
                onChange={e => setAssessment({ ...assessment, title: e.target.value })}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID*
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.courseId ? 'border-red-500' : 'border-gray-300'
                }`}
                value={assessment.courseId}
                onChange={e => setAssessment({ ...assessment, courseId: e.target.value })}
              />
              {errors.courseId && <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <DatePicker
                selected={assessment.dueDate}
                onChange={date => setAssessment({ ...assessment, dueDate: date })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                minDate={new Date()}
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={assessment.isPublished}
                onChange={e => setAssessment({ ...assessment, isPublished: e.target.checked })}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-700">
                Publish Immediately
              </label>
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Assessment Generation</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              {/* AI Options UI remains similar but with enhanced question type selection */}
            </div>
          </div>

          {/* Question Creation Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Questions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={newQuestion.type}
                  onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="essay">Essay</option>
                  <option value="matching">Matching</option>
                </select>
              </div>

              {/* Question Input Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text*
                </label>
                <textarea
                  value={newQuestion.text}
                  onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>

              {/* Dynamic Fields Based on Question Type */}
              {newQuestion.type === 'multiple_choice' && (
                <div className="space-y-4">
                  {/* Multiple Choice UI */}
                </div>
              )}

              {newQuestion.type === 'true_false' && (
                <div className="space-y-4">
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={e => setNewQuestion({ 
                      ...newQuestion, 
                      correctAnswer: e.target.value === 'true' 
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Correct Answer</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}

              {newQuestion.type === 'matching' && (
                <div className="space-y-4">
                  {newQuestion.matchingPairs.map((pair, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <input
                        value={pair.left}
                        onChange={e => handleMatchingPairChange(index, 'left', e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        placeholder="Left item"
                      />
                      <input
                        value={pair.right}
                        onChange={e => handleMatchingPairChange(index, 'right', e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        placeholder="Matching right item"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewQuestion({
                      ...newQuestion,
                      matchingPairs: [...newQuestion.matchingPairs, { left: '', right: '' }]
                    })}
                    className="text-indigo-600 text-sm"
                  >
                    + Add Pair
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points*
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newQuestion.points}
                    onChange={e => setNewQuestion({
                      ...newQuestion,
                      points: parseInt(e.target.value) || 1
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {errors.questions && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {errors.questions}
                </div>
              )}

              <button
                onClick={addQuestion}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 rounded-lg"
              >
                Add Question
              </button>
            </div>
          </div>

          {/* Submit Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total Points: {assessment.totalPoints}</span>
              <span className="font-medium">
                Passing Score: {assessment.passingScore}%
              </span>
            </div>
            
            <button
              onClick={submitAssessment}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessment;