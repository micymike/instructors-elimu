import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Users, Clock, Edit, Trash2, ExternalLink, Loader } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Ensure we have valid course data and filter out any null/undefined entries
      const validCourses = (response.data || []).filter(course =>
        course && typeof course === 'object'
      );

      setCourses(validCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (courseId, updatedData) => {
    if (!courseId || !updatedData) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/courses/${courseId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course updated successfully');
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  };

  const handleDelete = async (courseId) => {
    if (!courseId) return;

    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
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
            to="/instructor/courses/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create New Course
          </Link>
        </div>

        {!Array.isArray(courses) || courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500">Get started by creating your first course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
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
                  {editingCourse?.id === courseId ? (
                    <div className="p-6">
                      <input
                        type="text"
                        value={editingCourse.title || ''}
                        onChange={(e) => setEditingCourse({
                          ...editingCourse,
                          title: e.target.value
                        })}
                        className="w-full p-2 border rounded mb-4"
                      />
                      <textarea
                        value={editingCourse.description || ''}
                        onChange={(e) => setEditingCourse({
                          ...editingCourse,
                          description: e.target.value
                        })}
                        className="w-full p-2 border rounded mb-4"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCourse(null)}
                          className="px-3 py-1 border rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEdit(courseId, editingCourse)}
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-2">
                          {course.title || 'Untitled Course'}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCourse(course)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(courseId)}
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description || 'No description available'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.enrolledStudents || 0} students</span>
                        <Clock className="w-4 h-4 ml-4 mr-1" />
                        <span>{course.duration || '0h'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/instructor/courses/${courseId}/content`}
                          className="text-indigo-600 hover:text-indigo-700 flex items-center"
                        >
                          Manage Content <ExternalLink className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                          to={`/instructor/courses/${courseId}/learn`}
                          className="text-green-600 hover:text-green-700 flex items-center"
                        >
                          View Course <Book className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;