import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, BookOpen, Loader, CheckCircle, XCircle } from 'lucide-react';

const QuizManager = () => {
  const [quizCourseId, setQuizCourseId] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [questionsFile, setQuestionsFile] = useState(null);
  const [answersFile, setAnswersFile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setQuestionsFile(files[0]);
    }
  };

  const showNotification = (message, isSuccess = true) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateQuiz = async () => {
    if (!questionsFile) {
      showNotification('Questions file is required', false);
      return;
    }

    const formData = new FormData();
    formData.append('courseId', quizCourseId);
    formData.append('title', quizTitle);
    formData.append('questionsFile', questionsFile);
    if (answersFile) formData.append('answersFile', answersFile);

    setLoading(true);
    try {
      const response = await axios.post(
        'https://centralize-auth-elimu.onrender.com/instructor/quizzes/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setQuizzes([...quizzes, response.data]);
      showNotification('Quiz created successfully!');
      setQuizCourseId('');
      setQuizTitle('');
      setQuestionsFile(null);
      setAnswersFile(null);
    } catch (error) {
      showNotification(`Failed to create quiz: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    if (!selectedCourseId) {
      showNotification('Please enter a Course ID', false);
      return;
    }

    try {
      const response = await axios.get(
        `https://centralize-auth-elimu.onrender.com/instructor/quizzes/${selectedCourseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setQuizzes(response.data);
    } catch (error) {
      showNotification(`Error fetching quizzes: ${error.message}`, false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="text-blue-600 w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-800">Quiz Management</h2>
        </div>

        <div className="space-y-8">
          {/* Create Quiz Section */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Create New Quiz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Course ID *
                  </label>
                  <input
                    type="text"
                    value={quizCourseId}
                    onChange={(e) => setQuizCourseId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter course ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter quiz title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadCloud className="mx-auto text-gray-400 mb-4" size={32} />
                  <p className="text-gray-600 mb-2">
                    {questionsFile ? (
                      <span className="text-blue-600 flex items-center justify-center">
                        <FileText className="inline mr-2" />
                        {questionsFile.name}
                      </span>
                    ) : (
                      'Drag & drop questions file or click to upload'
                    )}
                  </p>
                  <input
                    type="file"
                    onChange={(e) => e.target.files && setQuestionsFile(e.target.files[0])}
                    className="hidden"
                    id="questionsFile"
                    accept=".pdf,.docx,.txt"
                    required
                  />
                  <label
                    htmlFor="questionsFile"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    Supported formats: .docx, .pdf, .txt (max 5MB)
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Optional Answers File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => e.target.files && setAnswersFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.docx,.txt"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handleCreateQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !quizCourseId || !quizTitle || !questionsFile}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-5 h-5" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} />
                    Create Quiz
                  </>
                )}
              </motion.button>
            </div>
          </motion.section>

          {/* View Quizzes Section */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xl font-semibold text-gray-700 mb-6">View Course Quizzes</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter course ID to view quizzes"
              />
              <motion.button
                onClick={fetchQuizzes}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2"
              >
                <BookOpen size={18} />
                Load Quizzes
              </motion.button>
            </div>

            <AnimatePresence>
              {quizzes.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{quiz.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Course ID: {quiz.courseId}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {quiz.questions?.length || 0} Questions
                            </span>
                            <span className="text-xs text-gray-400">
                              Created: {new Date(quiz.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <FileText className="text-gray-600" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-400">{quizzes.length === 0 && 'No quizzes found for this course'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </motion.div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6"
          >
            <div
              className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
                notification.isSuccess ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
              }`}
            >
              {notification.isSuccess ? (
                <CheckCircle className="text-green-600 w-5 h-5" />
              ) : (
                <XCircle className="text-red-600 w-5 h-5" />
              )}
              <span className="text-sm font-medium text-gray-700">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizManager;