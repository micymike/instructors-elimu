import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import AIModal from '../../components/AIModal';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

const CourseDetails = () => {
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
        const response = await axios.get(`${BASE_URL}/courses/instructor`, {
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

  const handleEditCourse = () => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this course?');
      if (confirmDelete) {
        await axios.delete(`${BASE_URL}/instructor/courses/${courseId}`, {
          headers: getHeaders()
        });
        toast.success('Course deleted successfully');
        navigate('/instructor/courses');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete course';
      toast.error(errorMessage);
      console.error('Delete course error:', error);
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
          {/* Navigation and Action Buttons - Responsive Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <button 
              onClick={() => navigate('/instructor/courses')}
              className="flex items-center text-gray-600 hover:text-gray-800 w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
            </button>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button 
                onClick={handleEditCourse}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Course
              </button>
              <button 
                onClick={handleDeleteCourse}
                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Course
              </button>
            </div>
          </div>

          {/* Course Details Card - Responsive Design */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{course.title}</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 break-words">{course.description}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                {/* Responsive Grid Layout for Course Details */}
                <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course.category || 'Not specified'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-4 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course.price ? `$${course.price}` : 'Free'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course.status || 'Draft'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;