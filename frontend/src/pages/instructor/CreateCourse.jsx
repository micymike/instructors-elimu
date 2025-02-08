import React from 'react';
import { CourseForm } from '../../components/instructor/CourseForm';
import { motion } from 'framer-motion';

const CreateCourse = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 min-h-screen"
    >
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center"
          >
            Create New Course
          </motion.h1>
          <CourseForm />
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCourse;
