import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api'; // Import the configured api instance
import { motion } from 'framer-motion';

const StudentCourseView = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Use the configured api instance and the correct student endpoint
        const response = await api.get(`/student/courses/${courseId}`); 
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-gray-600">{course.description}</p>
        </div>

        <div className="space-y-6">
          {course.modules.map((module, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4">
              <h2 className="text-xl font-bold text-gray-900">{module.title}</h2>
              <p className="mt-2 text-gray-600">{module.description}</p>
              <div className="mt-4 space-y-2">
                {module.content.map((item, idx) => (
                  <div key={idx} className="p-2 border rounded-md">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.type}</p>
                    {item.type === 'video' && (
                      <video controls className="w-full mt-2">
                        <source src={item.url} type={item.type} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {item.type === 'document' && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
                        View Document
                      </a>
                    )}
                    {item.type === 'image' && (
                      <img src={item.url} alt={item.title} className="w-full mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseView;
