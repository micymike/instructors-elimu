import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Plus, Eye, Save, Library, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AssessmentModal } from '../../components/content/AssessmentModal';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const socket = io('https://centralize-auth-elimu.onrender.com')

const AssessmentCreator = () => {
  const history = useNavigate();
  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    questions: [],
    timeLimit: 60,
  });
  

  const [questionBank, setQuestionBank] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimit * 60);
  const [score, setScore] = useState(0);
  const [assessments, setAssessments] = useState([]);

  const questionTypes = [
    { id: 'multiple-choice', label: 'Multiple Choice' },
    { id: 'true-false', label: 'True/False' },
    { id: 'short-answer', label: 'Short Answer' },
    { id: 'fill-in-the-blanks', label: 'Fill in the Blanks' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    socket.on('update', (data) => {
      // Handle real-time updates
      console.log('Real-time update:', data);
    });

    return () => {
      socket.off('update');
    };
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('https://centralize-auth-elimu.onrender.com/instructor/assessments');
        setAssessments(response.data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, or PDF files.';
    }
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 5MB.';
    }
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);
      
      if (error) {
        alert(error);
        return;
      }

      // Handle file upload logic here
      console.log('File uploaded:', file.name);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
    };
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (questionId) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const saveToQuestionBank = (question) => {
    setQuestionBank(prev => [...prev, { ...question, id: Date.now() }]);
  };

  const handlePreview = () => {
    if (assessment.questions.length === 0) {
      alert("Please add at least one question before previewing."); // Replace toast with alert
      return;
    }
    setShowPreview(true);
    // Store current assessment in localStorage for preview
    localStorage.setItem('previewAssessment', JSON.stringify(assessment));
    history.push('/assessment-preview');
  };

  const handleSave = async () => {
    try {
      if (!assessment.title) {
        alert("Please add a title for your assessment."); // Replace toast with alert
        return;
      }

      if (assessment.questions.length === 0) {
        alert("Please add at least one question before saving."); // Replace toast with alert
        return;
      }

      const response = await axios.post('https://centralize-auth-elimu.onrender.com/instructor/assessments', assessment);
      alert("Assessment saved successfully!"); // Replace toast with alert
      
      // Emit socket event for real-time updates
      socket.emit('assessment-created', response.data);
      
      // Redirect to the assessments list page
      history.push('/assessments');
    } catch (error) {
      alert("Failed to save assessment. Please try again."); // Replace toast with alert
      console.error('Error saving assessment:', error);
    }
  };

  const handleEdit = (id) => {
    const assessmentToEdit = assessments.find(a => a.id === id);
    setAssessment(assessmentToEdit);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete-assessment/${id}`);
      setAssessments(prev => prev.filter(a => a.id !== id));
      console.log('Deleted assessment:', id);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  const handleSubmit = () => {
    // Submit the assessment
    console.log('Assessment submitted');
  };

  const handleAutoSave = useCallback(() => {
    // Auto-save logic
    console.log('Auto-saving assessment');
  }, [assessment]);

  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [handleAutoSave]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-800">Create Assessment</h1>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
              >
                <Eye size={20} /> Preview
              </button>
              <button
                onClick={() => handleSave(assessment.questions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save size={20} /> Save Assessment
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Assessment Title"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              value={assessment.title}
              onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
            />
            <textarea
              placeholder="Assessment Description"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              value={assessment.description}
              onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Time Limit (minutes)"
                className="w-32 p-3 border border-gray-300 rounded-md"
                value={assessment.timeLimit}
                onChange={(e) => setAssessment(prev => ({ ...prev, timeLimit: e.target.value }))}
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveToQuestionBank(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Library size={20} />
                    </button>
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <select
                  className="w-full p-3 border border-gray-300 rounded-md mb-4"
                  value={question.type}
                  onChange={(e) => {
                    const updatedQuestions = assessment.questions.map(q =>
                      q.id === question.id ? { ...q, type: e.target.value } : q
                    );
                    setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                  }}
                >
                  {questionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Enter your question"
                  className="w-full p-3 border border-gray-300 rounded-md mb-4"
                  value={question.question}
                  onChange={(e) => {
                    const updatedQuestions = assessment.questions.map(q =>
                      q.id === question.id ? { ...q, question: e.target.value } : q
                    );
                    setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                  }}
                />

                {/* File Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto mb-2" size={24} />
                  <p className="text-gray-600">
                    Drag and drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPEG, PNG, PDF (max 5MB)
                  </p>
                </div>

                {question.type === 'multiple-choice' && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 p-3 border border-gray-300 rounded-md"
                          value={option}
                          onChange={(e) => {
                            const updatedOptions = [...question.options];
                            updatedOptions[optionIndex] = e.target.value;
                            const updatedQuestions = assessment.questions.map(q =>
                              q.id === question.id ? { ...q, options: updatedOptions } : q
                            );
                            setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                          }}
                        />
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === option}
                          onChange={() => {
                            const updatedQuestions = assessment.questions.map(q =>
                              q.id === question.id ? { ...q, correctAnswer: option } : q
                            );
                            setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          value="true"
                          className="mr-2"
                          checked={question.correctAnswer === 'true'}
                          onChange={(e) => {
                            const updatedQuestions = assessment.questions.map(q =>
                              q.id === question.id ? { ...q, correctAnswer: e.target.value } : q
                            );
                            setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                          }}
                        />
                        True
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`tf-${question.id}`}
                          value="false"
                          className="mr-2"
                          checked={question.correctAnswer === 'false'}
                          onChange={(e) => {
                            const updatedQuestions = assessment.questions.map(q =>
                              q.id === question.id ? { ...q, correctAnswer: e.target.value } : q
                            );
                            setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                          }}
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}

                {question.type === 'short-answer' && (
                  <textarea
                    placeholder="Enter the correct answer"
                    className="w-full p-3 border border-gray-300 rounded-md mb-4"
                    value={question.correctAnswer}
                    onChange={(e) => {
                      const updatedQuestions = assessment.questions.map(q =>
                        q.id === question.id ? { ...q, correctAnswer: e.target.value } : q
                      );
                      setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                    }}
                  />
                )}

                {question.type === 'fill-in-the-blanks' && (
                  <textarea
                    placeholder="Enter the correct answer"
                    className="w-full p-3 border border-gray-300 rounded-md mb-4"
                    value={question.correctAnswer}
                    onChange={(e) => {
                      const updatedQuestions = assessment.questions.map(q =>
                        q.id === question.id ? { ...q, correctAnswer: e.target.value } : q
                      );
                      setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                    }}
                  />
                )}

                <input
                  type="number"
                  placeholder="Points"
                  className="w-32 p-3 border border-gray-300 rounded-md mt-4"
                  value={question.points}
                  onChange={(e) => {
                    const updatedQuestions = assessment.questions.map(q =>
                      q.id === question.id ? { ...q, points: parseInt(e.target.value) } : q
                    );
                    setAssessment(prev => ({ ...prev, questions: updatedQuestions }));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            onClick={addQuestion}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
          >
            <Plus size={20} /> Add Question
          </button>

          {/* Question Bank */}
          {questionBank.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Question Bank</h2>
              <div className="space-y-4">
                {questionBank.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{question.question}</h3>
                      <button
                        onClick={() => {
                          setAssessment(prev => ({
                            ...prev,
                            questions: [...prev.questions, { ...question, id: Date.now() }]
                          }));
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Add to Assessment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Assessments */}
          {assessments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Saved Assessments</h2>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{assessment.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(assessment.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assessment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>{assessment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AssessmentCreator;