import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Wand2, PenTool, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import assessmentService from '../../services/assessment.service';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [creationMode, setCreationMode] = useState(null);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [assessment, setAssessment] = useState({
    title: '',
    courseId: '',
    type: 'QUIZ',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublished: false
  });

  // Fetch instructor's courses when component mounts
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching courses - Request Details:', {
        url: `${API_URL}/courses/instructor`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get(`${API_URL}/courses/instructor`, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Fetch Courses - Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      setCourses(response.data.courses || response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      console.error('Full Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      // Set a user-friendly error message
      setErrors(prev => ({
        ...prev,
        coursesFetch: error.response?.data?.message || 'Failed to fetch courses. Please try again.'
      }));
    }
  };

  // Use useEffect to properly handle component mount and prevent infinite loops
  useEffect(() => {
    fetchCourses();
  }, []); // Empty dependency array means this runs once on mount

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    text: '',
    points: 1,
    choices: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    matchingPairs: []
  });

  const addQuestion = () => {
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    // Reset based on question type
    setNewQuestion({
      type: 'multiple_choice',
      text: '',
      points: 1,
      choices: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      matchingPairs: []
    });
  };

  const generateAIQuiz = async () => {
    try {
      // Check for extension conflicts
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        throw new Error('Browser environment not properly initialized');
      }

      setIsLoading(true);
      setErrors({ ...errors, apiError: '' });
      
      let token;
      try {
        token = window.localStorage.getItem('token');
        if (!token) throw new Error('Token not found in local storage');
      } catch (storageError) {
        console.error('Local storage access error:', storageError);
        throw new Error('Could not access authentication token');
      }

      const payload = {
        title: assessment.title || 'Untitled Assessment',
        description: assessment.description || '',
        timeLimit: assessment.timeLimit || 30,
        passingScore: assessment.passingScore || 70,
        dueDate: assessment.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        publishImmediately: assessment.isPublished || false,
        totalQuestions: 10,
        difficultyLevels: ['easy', 'medium']
      };

      console.group('Generate AI Quiz');
      console.log('Request Details:', {
        url: `${import.meta.env.VITE_BACKEND_URL}/instructor/assessments/ai-generate/${assessment.courseId}`,
        method: 'POST',
        payload: {
          title: payload.title,
          description: payload.description,
          timeLimit: payload.timeLimit,
          passingScore: payload.passingScore,
          totalQuestions: payload.totalQuestions,
          difficultyLevels: payload.difficultyLevels
        },
        courseId: assessment.courseId
      });

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/instructor/assessments/ai-generate/${assessment.courseId}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Response Status:', response.status);
        console.log('Response Data:', {
          success: response.data.success,
          questionsCount: response.data.questions?.length || 0
        });
        console.groupEnd();

        if (response.data.success) {
          setAssessment({
            ...assessment,
            questions: response.data.questions
          });
          setSuccessMessage(`✅ Success! Generated ${response.data.questions?.length || 0} AI questions`);
          setTimeout(() => setSuccessMessage(''), 5000); // Auto-dismiss after 5 seconds
        } else {
          console.warn('AI Quiz Generation did not return success');
          setErrors({
            ...errors,
            apiError: 'Failed to generate AI quiz. Please try again.'
          });
        }
      } catch (apiError) {
        console.error('API Error:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          headers: apiError.response?.headers
        });
        console.groupEnd();

        // Handle extension-related errors specifically
        if (apiError.message.includes('Extension context') || 
            apiError.message.includes('VM') || 
            apiError.stack?.includes('all-frames.js')) {
          setErrors({
            ...errors,
            apiError: 'Browser extension conflict detected. Please try disabling extensions.'
          });
        } else {
          // Your existing error handling
          setErrors({
            ...errors,
            apiError: apiError.response?.data?.message || 
                    (apiError.message.includes('token') ? 'Authentication error. Please login again.' : 
                     'Failed to generate AI quiz')
          });
        }
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      setErrors({
        ...errors,
        apiError: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAssessment({
      title: '',
      courseId: '',
      type: 'QUIZ',
      description: '',
      questions: [],
      timeLimit: 30,
      passingScore: 70,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isPublished: false
    });
    setNewQuestion({
      type: 'multiple_choice',
      text: '',
      points: 1,
      choices: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      matchingPairs: []
    });
  };

  const submitAssessment = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!assessment.title || !assessment.courseId || assessment.questions.length === 0) {
        setErrors({ apiError: 'Title, course ID, and at least one question are required' });
        return;
      }

      // Format the data according to the API schema
      const formattedData = {
        title: assessment.title,
        courseId: assessment.courseId,
        type: assessment.type,
        description: assessment.description,
        questions: assessment.questions.map(q => ({
          type: q.type,
          text: q.text,
          points: Number(q.points),
          choices: q.type === 'multiple_choice' ? q.choices.map(c => ({
            text: c.text,
            isCorrect: Boolean(c.isCorrect)
          })) : undefined,
          correctAnswer: q.type === 'true_false' ? Boolean(q.correctAnswer) : undefined,
          matchingPairs: q.type === 'matching' ? q.matchingPairs.map(p => ({
            term: p.term,
            definition: p.definition
          })) : undefined
        })),
        passingScore: Number(assessment.passingScore),
        timeLimit: Number(assessment.timeLimit),
        dueDate: new Date(assessment.dueDate).toISOString()
      };

      console.group('Submit Assessment');
      console.log('Request Payload:', {
        title: formattedData.title,
        courseId: formattedData.courseId,
        type: formattedData.type,
        questionCount: formattedData.questions.length,
        passingScore: formattedData.passingScore,
        timeLimit: formattedData.timeLimit
      });

      try {
        const response = await assessmentService.createAssessment(formattedData);
        
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        console.groupEnd();

        setSuccessMessage('Assessment created successfully!');
        
        // Reset form and navigate after a short delay
        resetForm();
        setTimeout(() => {
          navigate('/instructor/assessments/list');
        }, 1500);
      } catch (apiError) {
        console.error('API Error:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          headers: apiError.response?.headers
        });
        console.groupEnd();

        setErrors({ 
          apiError: apiError.response?.data?.message || 
                  (apiError.message.includes('token') ? 'Authentication error. Please login again.' : 
                   'Error creating assessment. Please check your input.')
        });
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      setErrors({ 
        apiError: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!creationMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Create New Assessment
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose how you'd like to create your assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Generation Option */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all"
              onClick={() => setCreationMode('ai')}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Assisted Creation</h3>
                <p className="text-gray-500 mb-4">
                  Let our AI generate a customized assessment based on your course content
                </p>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Generate with AI
                </button>
              </div>
            </motion.div>

            {/* Manual Creation Option */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-300 transition-all"
              onClick={() => setCreationMode('manual')}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <PenTool className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Manual Creation</h3>
                <p className="text-gray-500 mb-4">
                  Build your assessment from scratch with full control over every question
                </p>
                <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Create Manually
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (creationMode === 'ai') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setCreationMode(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Selection
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Create New Assessment
            </h1>

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
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Title *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={assessment.title}
                    onChange={e => setAssessment({ ...assessment, title: e.target.value })}
                    placeholder="Enter assessment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.courseId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={assessment.courseId}
                    onChange={e => setAssessment({ ...assessment, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    value={assessment.description}
                    onChange={e => setAssessment({ ...assessment, description: e.target.value })}
                    placeholder="Enter assessment description"
                  />
                </div>
              </div>

              {/* Settings Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={assessment.timeLimit}
                    onChange={e => setAssessment({ ...assessment, timeLimit: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={assessment.passingScore}
                    onChange={e => setAssessment({ ...assessment, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={assessment.dueDate.split('.')[0]}
                    min={new Date().toISOString().split('.')[0].slice(0, -3)}
                    onChange={e => setAssessment({ ...assessment, dueDate: new Date(e.target.value).toISOString() })}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={assessment.isPublished}
                      onChange={e => setAssessment({ ...assessment, isPublished: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-gray-700">Publish Immediately</span>
                  </label>
                </div>
              </div>

              {/* AI Generation Section */}
              <div className="border-t pt-6">
                <button
                  onClick={generateAIQuiz}
                  disabled={isLoading || !assessment.courseId}
                  className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : '✨ Generate AI Quiz'}
                </button>
              </div>

              {/* Added Questions Preview */}
              {assessment.questions.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Added Questions ({assessment.questions.length})
                  </h3>
                  <div className="space-y-4">
                    {assessment.questions.map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">Q{index + 1}: {question.text}</span>
                          <button
                            onClick={() => {
                              const newQuestions = [...assessment.questions];
                              newQuestions.splice(index, 1);
                              setAssessment({ ...assessment, questions: newQuestions });
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Type: {question.type}</div>
                          {question.type === 'multiple_choice' && (
                            <div>
                              {question.choices.map((choice, idx) => (
                                <div key={idx}>
                                  • {choice.text} {choice.isCorrect && '(✓)'}
                                </div>
                              ))}
                            </div>
                          )}
                          {question.type === 'matching' && (
                            <div>
                              {question.matchingPairs.map((pair, idx) => (
                                <div key={idx}>
                                  • {pair.term} ↔ {pair.definition}
                                </div>
                              ))}
                            </div>
                          )}
                          {question.type === 'true_false' && (
                            <div>Correct Answer: {question.correctAnswer ? 'True' : 'False'}</div>
                          )}
                          <div>Points: {question.points}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Section */}
              <div className="border-t pt-6">
                <button
                  onClick={submitAssessment}
                  disabled={isLoading || assessment.questions.length === 0 || !assessment.title || !assessment.courseId}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Assessment...
                    </span>
                  ) : (
                    'Create Assessment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (creationMode === 'manual') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setCreationMode(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Selection
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Create New Assessment
            </h1>

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
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Title *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={assessment.title}
                    onChange={e => setAssessment({ ...assessment, title: e.target.value })}
                    placeholder="Enter assessment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.courseId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={assessment.courseId}
                    onChange={e => setAssessment({ ...assessment, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    value={assessment.description}
                    onChange={e => setAssessment({ ...assessment, description: e.target.value })}
                    placeholder="Enter assessment description"
                  />
                </div>
              </div>

              {/* Settings Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={assessment.timeLimit}
                    onChange={e => setAssessment({ ...assessment, timeLimit: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={assessment.passingScore}
                    onChange={e => setAssessment({ ...assessment, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={assessment.dueDate.split('.')[0]}
                    min={new Date().toISOString().split('.')[0].slice(0, -3)}
                    onChange={e => setAssessment({ ...assessment, dueDate: new Date(e.target.value).toISOString() })}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={assessment.isPublished}
                      onChange={e => setAssessment({ ...assessment, isPublished: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-gray-700">Publish Immediately</span>
                  </label>
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
                      onChange={e => {
                        const type = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          type,
                          choices: type === 'multiple_choice' ? [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false }
                          ] : [],
                          matchingPairs: type === 'matching' ? [
                            { term: '', definition: '' }
                          ] : []
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="matching">Matching</option>
                      <option value="true_false">True/False</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={newQuestion.text}
                      onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="2"
                      placeholder="Enter your question here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      value={newQuestion.points}
                      onChange={e => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                    />
                  </div>

                  {newQuestion.type === 'multiple_choice' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {newQuestion.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <input
                              type="text"
                              value={choice.text}
                              onChange={e => {
                                const newChoices = [...newQuestion.choices];
                                newChoices[index].text = e.target.value;
                                setNewQuestion({ ...newQuestion, choices: newChoices });
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder={`Option ${index + 1}`}
                            />
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={choice.isCorrect}
                                onChange={e => {
                                  const newChoices = [...newQuestion.choices];
                                  newChoices[index].isCorrect = e.target.checked;
                                  setNewQuestion({ ...newQuestion, choices: newChoices });
                                }}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                              />
                              <span className="text-sm font-medium text-gray-700">Correct</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newQuestion.type === 'matching' && (
                    <div className="space-y-4">
                      {newQuestion.matchingPairs.map((pair, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={pair.term}
                            onChange={e => {
                              const newPairs = [...newQuestion.matchingPairs];
                              newPairs[index].term = e.target.value;
                              setNewQuestion({ ...newQuestion, matchingPairs: newPairs });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Term"
                          />
                          <input
                            type="text"
                            value={pair.definition}
                            onChange={e => {
                              const newPairs = [...newQuestion.matchingPairs];
                              newPairs[index].definition = e.target.value;
                              setNewQuestion({ ...newQuestion, matchingPairs: newPairs });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Definition"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setNewQuestion({
                            ...newQuestion,
                            matchingPairs: [...newQuestion.matchingPairs, { term: '', definition: '' }]
                          });
                        }}
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Add Matching Pair
                      </button>
                    </div>
                  )}

                  {newQuestion.type === 'true_false' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <select
                        value={newQuestion.correctAnswer}
                        onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value === 'true' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={addQuestion}
                    disabled={!newQuestion.text}
                    className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    ➕ Add Question
                  </button>
                </div>
              </div>

              {/* Added Questions Preview */}
              {assessment.questions.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Added Questions ({assessment.questions.length})
                  </h3>
                  <div className="space-y-4">
                    {assessment.questions.map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">Q{index + 1}: {question.text}</span>
                          <button
                            onClick={() => {
                              const newQuestions = [...assessment.questions];
                              newQuestions.splice(index, 1);
                              setAssessment({ ...assessment, questions: newQuestions });
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Type: {question.type}</div>
                          {question.type === 'multiple_choice' && (
                            <div>
                              {question.choices.map((choice, idx) => (
                                <div key={idx}>
                                  • {choice.text} {choice.isCorrect && '(✓)'}
                                </div>
                              ))}
                            </div>
                          )}
                          {question.type === 'matching' && (
                            <div>
                              {question.matchingPairs.map((pair, idx) => (
                                <div key={idx}>
                                  • {pair.term} ↔ {pair.definition}
                                </div>
                              ))}
                            </div>
                          )}
                          {question.type === 'true_false' && (
                            <div>Correct Answer: {question.correctAnswer ? 'True' : 'False'}</div>
                          )}
                          <div>Points: {question.points}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Section */}
              <div className="border-t pt-6">
                <button
                  onClick={submitAssessment}
                  disabled={isLoading || assessment.questions.length === 0 || !assessment.title || !assessment.courseId}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Assessment...
                    </span>
                  ) : (
                    'Create Assessment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CreateAssessment;
