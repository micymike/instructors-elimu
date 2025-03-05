import React, { useState, useEffect } from 'react';
import assessmentService from '../../services/assessment.service';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
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
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/courses/instructor`, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
        setCourses(response.data.courses || response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrors({ apiError: 'Failed to fetch courses. Please try again later.' });
      }
    };

    fetchCourses();
  }, []);

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

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      setIsLoading(true);
      const result = await assessmentService.generateAIQuiz(assessment.courseId);
      setAssessment(prev => ({
        ...prev,
        questions: result.data.questions
      }));
      setSuccessMessage('AI quiz questions generated successfully');
    } catch (error) {
      setErrors({ apiError: error.message || 'Error generating AI quiz' });
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

      await assessmentService.createAssessment(formattedData);
      setSuccessMessage('Assessment created successfully!');
      
      // Reset form and navigate after a short delay
      resetForm();
      setTimeout(() => {
        navigate('/instructor/assessments/list');
      }, 1500);
    } catch (error) {
      console.error('Error creating assessment:', error);
      setErrors({ 
        apiError: error.response?.data?.message || 'Error creating assessment. Please check your input.'
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
  );
};

export default CreateAssessment;
