import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, User, Mail, Phone, MapPin, School, Filter, Loader2, GraduationCap, TrendingUp, UserX, Book, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';
axios.defaults.baseURL = BASE_URL;

const Students = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const navigate = useNavigate();

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token 
      ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/courses/instructor', {
        headers: getHeaders()
      });
      
      // Handle different response formats like Courses.jsx
      let fetchedCourses = [];
      if (Array.isArray(response.data)) {
        fetchedCourses = response.data;
      } else if (response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedCourses = response.data.data;
      }
      
      setCourses(fetchedCourses);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch courses';
      toast.error(errorMessage);
      console.error('Courses fetch error:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForCourse = async (courseId) => {
    if (!courseId) return;

    try {
      setLoading(true);
      const response = await axios.get(`/instructor/courses/${courseId}/students`, {
        headers: getHeaders(),
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      });

      setStudents(response.data.students || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      toast.error(errorMessage);
      console.error('Students fetch error:', error);
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsForCourse(selectedCourse);
    }
  }, [selectedCourse, pagination.page]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course.id);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-blue-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="text-center">
          <UserX className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Courses Found
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't created any courses yet. Start by creating a course to view and manage students.
          </p>
          <button 
            onClick={() => navigate('/instructor/courses/new')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create First Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Students Directory
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map(course => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${selectedCourse === course.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleCourseClick(course)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{course.title || 'Untitled Course'}</h3>
                    <p className="text-sm text-gray-500">{course.category || 'No Category'}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{course.students?.length || 0} Students</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedCourse && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Students in Selected Course</h2>
            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map(student => (
                  <div key={student.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students enrolled in this course yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;