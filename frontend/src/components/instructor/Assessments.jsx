import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

const ASSESSMENT_TYPES = {
  ASSIGNMENT: 'ASSIGNMENT',
  QUIZ: 'QUIZ'
};

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

const AssessmentCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [courses, setCourses] = useState([]);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const [aiSettings, setAISettings] = useState({
    totalQuestions: 5,
    difficultyLevels: ['easy', 'medium'],
    excludedTopics: []
  });

  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    type: ASSESSMENT_TYPES.QUIZ,
    courseId: '',
    dueDate: '',
    totalPoints: 100,
    questions: [],
    passingScore: 70,
    timeLimit: 60,
    isPublished: false
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://centralize-auth-elimu.onrender.com/courses/instructor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.courses || response.data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    }
  };

  const handleAIGenerate = async () => {
    try {
      setIsAIGenerating(true);
      setError('');
      
      if (!assessment.courseId) {
        setError('Please select a course first');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/instructor/assessments/ai-generate/${assessment.courseId}`,
        aiSettings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.questions) {
        setAssessment(prev => ({
          ...prev,
          questions: [...prev.questions, ...response.data.questions]
        }));
        setSuccess('Questions generated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        title: assessment.title,
        description: assessment.description,
        type: assessment.type,
        courseId: assessment.courseId,
        questions: assessment.questions,
        totalPoints: parseInt(assessment.totalPoints),
        passingScore: assessment.passingScore,
        timeLimit: assessment.timeLimit,
        dueDate: new Date(assessment.dueDate).toISOString(),
        isPublished: assessment.isPublished
      };

      const response = await axios.post(
        `${API_URL}/instructor/assessments/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSuccess('Assessment created successfully!');
        setTimeout(() => {
          navigate('/instructor/assessments');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setAssessment(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: 'MULTIPLE_CHOICE',
          text: '',
          points: 10,
          choices: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setAssessment(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      return {
        ...prev,
        questions: newQuestions
      };
    });
  };

  const handleChoiceChange = (questionIndex, choiceIndex, field, value) => {
    setAssessment(prev => {
      const newQuestions = [...prev.questions];
      const newChoices = [...newQuestions[questionIndex].choices];
      newChoices[choiceIndex] = {
        ...newChoices[choiceIndex],
        [field]: value
      };
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        choices: newChoices
      };
      return {
        ...prev,
        questions: newQuestions
      };
    });
  };

  const handleRemoveQuestion = (index) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Assessment</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select
                value={assessment.courseId}
                onChange={e => setAssessment(prev => ({ ...prev, courseId: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assessment Type</label>
              <select
                value={assessment.type}
                onChange={e => setAssessment(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value={ASSESSMENT_TYPES.QUIZ}>Quiz</option>
                <option value={ASSESSMENT_TYPES.ASSIGNMENT}>Assignment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={assessment.title}
                onChange={e => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={assessment.dueDate}
                onChange={e => setAssessment(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={assessment.description}
              onChange={e => setAssessment(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
        </div>

        {/* AI Generation Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">AI Question Generation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Number of Questions</label>
              <input
                type="number"
                value={aiSettings.totalQuestions}
                onChange={e => setAISettings(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded"
                min="1"
                max="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Difficulty Levels</label>
              <div className="flex gap-4">
                {DIFFICULTY_LEVELS.map(level => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.difficultyLevels.includes(level)}
                      onChange={e => {
                        const isChecked = e.target.checked;
                        setAISettings(prev => ({
                          ...prev,
                          difficultyLevels: isChecked
                            ? [...prev.difficultyLevels, level]
                            : prev.difficultyLevels.filter(l => l !== level)
                        }));
                      }}
                    />
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={isAIGenerating || !assessment.courseId}
            className={`mt-4 px-4 py-2 rounded ${
              isAIGenerating || !assessment.courseId
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isAIGenerating ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>

        {/* Questions Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {assessment.questions.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border rounded space-y-4 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>

                <div>
                  <label className="block text-sm font-medium mb-1">Question Text</label>
                  <textarea
                    value={question.text}
                    onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Question Type</label>
                    <select
                      value={question.type}
                      onChange={e => handleQuestionChange(qIndex, 'type', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True/False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Points</label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={e => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {question.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Choices</label>
                    {question.choices.map((choice, cIndex) => (
                      <div key={cIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={choice.text}
                          onChange={e => handleChoiceChange(qIndex, cIndex, 'text', e.target.value)}
                          className="flex-1 p-2 border rounded"
                          placeholder={`Choice ${cIndex + 1}`}
                          required
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={choice.isCorrect}
                            onChange={() => {
                              const newChoices = question.choices.map((c, i) => ({
                                ...c,
                                isCorrect: i === cIndex
                              }));
                              handleQuestionChange(qIndex, 'choices', newChoices);
                            }}
                            required
                          />
                          Correct
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'TRUE_FALSE' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Correct Answer</label>
                    <select
                      value={question.correctAnswer ? 'true' : 'false'}
                      onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value === 'true')}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                )}

                {question.type === 'SHORT_ANSWER' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Correct Answer</label>
                    <input
                      type="text"
                      value={question.correctAnswer || ''}
                      onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white rounded ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Creating...' : 'Create Assessment'}
        </button>
      </form>
    </div>
  );
};

export default AssessmentCreator;
