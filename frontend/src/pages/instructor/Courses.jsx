import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Users, Clock, Edit, Trash2, ExternalLink, Loader } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';

// Configure axios base URL and defaults
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
axios.defaults.baseURL = API_BASE_URL;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Centralized token management
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      fetchCourses();
    } else {
      navigate('/login');
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching courses with token:', axios.defaults.headers.common['Authorization']);
      
      const response = await axios.get('/courses/instructor');
      console.log('Full response:', response);

      // Robust response handling
      let validCourses = [];
      if (Array.isArray(response.data)) {
        validCourses = response.data;
      } else if (response.data && Array.isArray(response.data.courses)) {
        validCourses = response.data.courses;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        validCourses = response.data.data;
      }

      console.log('Parsed courses:', validCourses);
      setCourses(validCourses);
    } catch (error) {
      console.error('Course fetch error FULL:', error);

      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }

      // Improved error handling
      if (error.response) {
        // Server responded with an error
        const errorMessage = error.response.data?.message || 'Failed to fetch courses';
        toast.error(errorMessage);

        // Handle unauthorized access
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else if (error.request) {
        // Request made but no response received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something else went wrong
        toast.error('An unexpected error occurred');
      }

      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCourseAnalytics = async (courseId) => {
    try {
      const response = await axios.get(`/courses/${courseId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Course analytics fetch error:', error);
      toast.error('Failed to fetch course analytics');
      return null;
    }
  };

  const handleEdit = async (courseId, updatedData) => {
    if (!courseId || !updatedData) return;

    try {
      await axios.patch(`/courses/${courseId}`, updatedData);
      toast.success('Course updated successfully');
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (courseId) => {
    if (!courseId) return;

    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/courses/${courseId}`);
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        
        const errorMessage = error.response?.data?.message || 'Failed to delete course';
        toast.error(errorMessage);
      }
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await axios.post('/courses', courseData);
      toast.success('Course created successfully');
      fetchCourses();
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create course';
      toast.error(errorMessage);
      return null;
    }
  };

  const renderCourseCard = (course) => {
    // Skip rendering if course is invalid
    if (!course || typeof course !== 'object') return null;

    const courseId = course._id || course.id;
    if (!courseId) return null;

    return (
      <motion.div
        key={courseId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{course.title || 'Untitled Course'}</h3>
              <p className="text-sm text-gray-500">{course.category || 'No Category'}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingCourse(course)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Edit Course"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(courseId)}
                className="p-1 hover:bg-red-100 rounded"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Book className="w-4 h-4 mr-2" />
              <span>{course.level || 'Level Not Set'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{course.duration || 'Duration Not Set'}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{course.students?.length || 0} Students</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            {course.description || 'No description available'}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Price: {course.price ? `$${course.price}` : 'Free'}
            </span>
            <Link 
              to={`/instructor/courses/${courseId}`} 
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
            >
              View Details <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize your courses
            </p>
          </div>
          <Link
            to="/instructor/create-course"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create New Course
          </Link>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500">Get started by creating your first course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(renderCourseCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;