import React from 'react';
import { CourseForm } from '../../components/instructor/CourseForm';

const CreateCourse = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Course
          </h1>
          <CourseForm />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;