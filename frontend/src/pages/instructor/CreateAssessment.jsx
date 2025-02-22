import React, { useState } from 'react';
import axios from 'axios';

const CreateAssessment = () => {
  const [assessment, setAssessment] = useState({
    title: '',
    courseId: '',
    type: 'quiz',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70
  });

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    text: '',
    points: 1,
    choices: ['', '', '', ''],
    correctAnswer: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const addQuestion = () => {
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setNewQuestion({
      type: 'multiple_choice',
      text: '',
      points: 1,
      choices: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const generateAIQuiz = async () => {
    try {
      const response = await axios.post(`'https://centralize-auth-elimu.onrender.com/api/instructor/assessments/ai-generate/${assessment.courseId}`, {
        // AI generation options
      });
      setAssessment(prev => ({
        ...prev,
        questions: response.data.questions
      }));
    } catch (error) {
      console.error('Error generating AI quiz:', error);
    }
  };

  const submitAssessment = async () => {
    try {
      await axios.post('https://centralize-auth-elimu.onrender.com/api/instructor/assessments', assessment);
      alert('Assessment created successfully!');
    } catch (error) {
      console.error('Error creating assessment:', error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Title
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                value={assessment.title}
                onChange={e => setAssessment({ ...assessment, title: e.target.value })}
                placeholder="Midterm Exam"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.courseId ? 'border-red-500' : 'border-gray-300'
                }`}
                value={assessment.courseId}
                onChange={e => setAssessment({ ...assessment, courseId: e.target.value })}
                placeholder="CS-101"
              />
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
              )}
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
                onChange={e => setAssessment({ ...assessment, timeLimit: e.target.value })}
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
                onChange={e => setAssessment({ ...assessment, passingScore: e.target.value })}
              />
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="border-t pt-6">
            <button
              onClick={generateAIQuiz}
              disabled={isLoading}
              className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                  onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  value={newQuestion.text}
                  onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="2"
                  placeholder="Enter your question here..."
                />
                {errors.questionText && (
                  <p className="mt-1 text-sm text-red-600">{errors.questionText}</p>
                )}
              </div>

              {newQuestion.type === 'multiple_choice' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {newQuestion.choices.map((choice, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Option {index + 1}
                        </label>
                        <input
                          type="text"
                          value={choice}
                          onChange={e => {
                            const newChoices = [...newQuestion.choices];
                            newChoices[index] = e.target.value;
                            setNewQuestion({ ...newQuestion, choices: newChoices });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Correct Answer</option>
                      {newQuestion.choices.map((choice, index) => (
                        <option key={index} value={choice}>
                          Option {index + 1}
                        </option>
                      ))}
                    </select>
                    {errors.correctAnswer && (
                      <p className="mt-1 text-sm text-red-600">{errors.correctAnswer}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={addQuestion}
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                      {question.type === 'multiple_choice' && (
                        <div>
                          Options: {question.choices.join(', ')}
                          <br />
                          Correct Answer: {question.correctAnswer}
                        </div>
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
              disabled={isLoading}
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