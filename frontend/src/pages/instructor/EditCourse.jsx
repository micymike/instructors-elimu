import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';
import { CourseForm } from '../../components/instructor/CourseForm';
import AIModal from '../../components/AIModal';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Validate MongoDB ObjectId
  const isValidObjectId = (id) => {
    // Check if the id is a valid 24-character hex string
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Get authentication headers
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token 
      ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };
  };

  // Filter out properties not allowed in update request
  const prepareUpdateData = (formData) => {
    const allowedProperties = ['title', 'description'];
    
    return Object.keys(formData)
      .filter(key => allowedProperties.includes(key))
      .reduce((obj, key) => {
        obj[key] = formData[key];
        return obj;
      }, {});
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      // Validate courseId before making the request
      if (!courseId || !isValidObjectId(courseId)) {
        setError('Invalid course ID');
        setIsLoading(false);
        navigate('/instructor/courses');
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/instructor/courses/${courseId}`, {
          headers: getHeaders()
        });
        setCourse(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch course details';
        toast.error(errorMessage);
        console.error('Course details error:', error);
        setError(errorMessage);
        navigate('/instructor/courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // Prepare data with only allowed properties
      const cleanedData = prepareUpdateData(formData);

      const response = await axios.put(`${BASE_URL}/instructor/courses/${courseId}`, cleanedData, {
        headers: getHeaders()
      });
      
      toast.success('Course updated successfully');
      navigate(`/instructor/courses/${courseId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      toast.error(errorMessage);
      console.error('Update course error:', error);
      
      // Log the full error response for debugging
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleAIAssistantResponse = (suggestion) => {
    // Update course description 
    setCourse(prev => ({
      ...prev,
      description: suggestion
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">{error || 'Course not found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* AI Assistant Modal */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        context={{
          title: course.title,
          category: course.category,
          level: course.level
        }}
        onSuggestionSelect={handleAIAssistantResponse}
      />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Edit Course
          </h1>
          <CourseForm 
            initialData={course} 
            onSubmit={handleSubmit} 
            mode="edit"
            onAIAssistantClick={() => setIsAIModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
