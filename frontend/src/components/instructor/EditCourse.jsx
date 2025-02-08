import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { CourseForm } from '../../components/instructor/CourseForm';
import AIModal from '../../components/AIModal';
import ApiService from '../../services/api.service';
import toast from 'react-hot-toast';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        const courseData = await ApiService.getCourseById(courseId);
        setCourse(courseData);
      } catch (error) {
        toast.error('Failed to fetch course details');
        console.error('Course details error:', error);
        navigate('/instructor/courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const updatedCourse = await ApiService.updateCourse(courseId, formData);
      toast.success('Course updated successfully');
      navigate(`/instructor/courses/${courseId}`);
    } catch (error) {
      toast.error('Failed to update course');
      console.error('Update course error:', error);
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

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* AI Assistant Modal */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        context={{
          title: course?.title,
          category: course?.category,
          level: course?.level
        }}
        onSuggestionSelect={handleAIAssistantResponse}
      />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Edit Course
          </h1>
          <CourseForm 
            initialData={course} 
            onSubmit={handleSubmit} 
            mode="edit"
            onAIAssistantClick={() => setIsAIModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCourse;