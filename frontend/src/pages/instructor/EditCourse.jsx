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
      if (!courseId || !isValidObjectId(courseId)) {
        setError('Invalid course ID');
        setIsLoading(false);
        navigate('/instructor/courses');
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/courses/instructor/${courseId}`, {
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
      const cleanedData = prepareUpdateData(formData);

      const response = await axios.put(`${BASE_URL}/courses/instructor/${courseId}`, cleanedData, {
        headers: getHeaders()
      });
      
      toast.success('Course updated successfully');
      navigate(`/instructor/courses/${courseId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      toast.error(errorMessage);
      console.error('Update course error:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleAIAssistantResponse = (suggestion) => {
    setCourse(prev => ({
      ...prev,
      description: suggestion
    }));
  };

  // Loading State - Mobile-first responsive design
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Error State - Mobile-first responsive design
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-sm sm:text-base text-gray-600 text-center">
          {error || 'Course not found'}
        </p>
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

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-xl mx-auto lg:max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Edit Course
          </h1>
          <CourseForm 
            initialData={course} 
            onSubmit={handleSubmit} 
            mode="edit"
            onAIAssistantClick={() => setIsAIModalOpen(true)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default EditCourse;