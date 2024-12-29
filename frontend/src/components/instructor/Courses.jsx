import React from 'react';
import { Plus, Book, Clock, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage and create your courses</p>
        </div>
        <Link
          to="/instructor/courses/new"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Course
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Book, label: 'Total Courses', value: '0' },
          { icon: Users, label: 'Total Students', value: '0' },
          { icon: Clock, label: 'Hours of Content', value: '0' },
          { icon: Star, label: 'Average Rating', value: '0.0' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden 
                      hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg mb-4">
              <Book className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600">
              Start creating your first course and share your knowledge with students worldwide!
            </p>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                to="/instructor/courses/new"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 