import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Book, FileText, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AIAssistant from '../course-generator/AIAssistant';

const CourseWizard = ({ onClose = () => {} }) => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    topics: [],
    resources: []
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitting: false,
    success: false,
    error: null
  });

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTopicChange = useCallback((topics) => {
    setCourseData(prev => ({
      ...prev,
      topics
    }));
  }, []);

  const handleResourceUpload = useCallback(async (files) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('resources', file);
      });

      const response = await axios.post(
        'http://localhost:3000/api/courses/resources/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setCourseData(prev => ({
        ...prev,
        resources: [...prev.resources, ...response.data.urls]
      }));

      toast.success('Resources uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resources');
      console.error('Upload error:', error.response ? error.response.data : error);
    }
  }, []);

  const handleSubmit = async () => {
    // Reset submission status
    setSubmissionStatus({
      isSubmitting: true,
      success: false,
      error: null
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Validate required fields
      const requiredFields = ['title', 'description', 'category'];
      const missingFields = requiredFields.filter(field => !courseData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      const response = await axios.post(
        'http://localhost:3000/api/courses',
        courseData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      // Update submission status
      setSubmissionStatus({
        isSubmitting: false,
        success: true,
        error: null
      });

      // Show success toast
      toast.success('Course created successfully!', {
        icon: () => <CheckCircle className="text-green-500" />,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Close the wizard
      onClose();

      // Redirect to course dashboard
      window.location.href = `/instructor/courses/${response.data.data.course._id || response.data.data.course.id}`;
    } catch (error) {
      // Determine error message
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to create course. Please try again.';

      // Update submission status
      setSubmissionStatus({
        isSubmitting: false,
        success: false,
        error: errorMessage
      });

      // Show error toast
      toast.error(errorMessage, {
        icon: () => <AlertCircle className="text-red-500" />,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.error('Course Creation Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Create New Course</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Main Form */}
        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Book size={20} />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title *</label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a descriptive title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  value={courseData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="programming">Programming</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="language">Language</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts & Design</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a detailed description of your course"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  value={courseData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} />
              Course Content
            </h3>
            <div className="border rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">Topics</label>
              <div className="space-y-2">
                {courseData.topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => {
                        const newTopics = [...courseData.topics];
                        newTopics[index] = e.target.value;
                        handleTopicChange(newTopics);
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const newTopics = courseData.topics.filter((_, i) => i !== index);
                        handleTopicChange(newTopics);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleTopicChange([...courseData.topics, ''])}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Topic
                </button>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload size={20} />
              Resources
            </h3>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => handleResourceUpload(e.target.files)}
                className="hidden"
                id="resource-upload"
              />
              <label
                htmlFor="resource-upload"
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                Click to upload or drag and drop
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Support for PDF, DOC, PPT, images, and videos
              </p>
            </div>
            {courseData.resources.length > 0 && (
              <div className="space-y-2">
                {courseData.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate">{resource.split('/').pop()}</span>
                    <button
                      onClick={() => {
                        const newResources = courseData.resources.filter((_, i) => i !== index);
                        setCourseData(prev => ({ ...prev, resources: newResources }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Status Indicators */}
          {submissionStatus.isSubmitting && (
            <div className="flex items-center text-blue-500">
              <span className="mr-2">Creating course...</span>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          {submissionStatus.error && (
            <div className="text-red-500 flex items-center">
              <AlertCircle className="mr-2" />
              {submissionStatus.error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              <MessageSquare size={20} />
              AI Assistant
            </button>
            <button
              onClick={handleSubmit}
              disabled={submissionStatus.isSubmitting}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50`}
            >
              {submissionStatus.isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">AI Course Assistant</h3>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <AIAssistant courseData={courseData} onUpdate={setCourseData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseWizard;
