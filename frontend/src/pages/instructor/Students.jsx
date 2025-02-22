import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, User, Mail, Phone, MapPin, School, Filter, Loader2, GraduationCap, TrendingUp, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Students = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const navigate = useNavigate();

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

  // Fetch instructor's courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/instructor/courses`, {
        headers: getHeaders()
      });
      
      // Ensure courses is an array
      const fetchedCourses = Array.isArray(response.data) ? response.data : [];
      setCourses(fetchedCourses);
      
      // Auto-select first course if available
      if (fetchedCourses.length > 0) {
        setSelectedCourse(fetchedCourses[0].id);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch courses';
      toast.error(errorMessage);
      console.error('Courses fetch error:', error);
      setCourses([]);
    }
  };

  // Fetch students for selected course
  const fetchStudents = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/instructor/courses/${selectedCourse}/students`, {
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

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch students when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [selectedCourse, pagination.page]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleViewProgress = () => {
    navigate('/instructor/students/progress');
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Loading state for initial course fetch
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

  // No courses state
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
            onClick={() => navigate('/instructor/courses/create')}
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Students Directory
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Course Selector */}
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            Showing {filteredStudents.length} of {pagination.total} students
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error: {error}
          </div>
        ) : (
          <>
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <UserX className="w-24 h-24 text-gray-400 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  No Students Enrolled Yet
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  It looks like no students have enrolled in this course. 
                  Students will appear here once they join the course.
                </p>
                <button 
                  onClick={() => navigate('/instructor/courses')}
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Manage Courses
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="group bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={student.profilePhoto || 'default-avatar.png'}
                          alt={student.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            {student.name}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <School className="w-4 h-4" />
                          <span className="text-sm">Enrollment Date: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Progress</span>
                          <span className="text-sm font-semibold text-blue-600">
                            {student.progress || '0'}%
                          </span>
                          <button
                            onClick={handleViewProgress}
                            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Students;