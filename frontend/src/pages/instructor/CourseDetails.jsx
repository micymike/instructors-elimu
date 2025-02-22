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
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate('/instructor/courses')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
            </button>
            <div className="flex space-x-3">
              <button 
                onClick={handleEditCourse}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Course
              </button>
              <button 
                onClick={handleDeleteCourse}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Course
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{course.description}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course.category || 'Not specified'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {course.price ? `$${course.price}` : 'Free'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
