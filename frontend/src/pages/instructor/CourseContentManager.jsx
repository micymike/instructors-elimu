import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ContentSection } from '../../components/content/ContentSection';
import { AssessmentModal } from '../../components/content/AssessmentModal';
import { useToast } from '../../hooks/useToast';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const contentIcons = {
  video: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <motion.path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <motion.path
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
    </svg>
  ),
  quiz: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <motion.path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
    </svg>
  )
};

const CourseContentManager = () => {
  const [sections, setSections] = useState([]);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!courseId) {
      toast.error('No course selected');
      navigate('/instructor/courses');
      return;
    }
    fetchCourseContent();
  }, [courseId, navigate]);

  const fetchCourseContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/courses/${courseId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        // Ensure all sections have valid IDs
        const sections = (response.data.sections || []).map(section => ({
          ...section,
          id: section.id || `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));

        const modules = (response.data.modules || []).map(module => ({
          id: module.id || `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: module.title,
          items: module.content || []
        }));

        const content = response.data.content || [];

        // Combine all content sources with guaranteed IDs
        const allSections = [
          ...sections,
          ...modules,
          ...(content.length > 0 ? [{
            id: 'main-content',
            title: 'Main Content',
            items: content.map(item => ({
              ...item,
              id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }))
          }] : [])
        ];

        setSections(allSections);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      toast.error('Failed to fetch course content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newSections = [...sections];

    if (source.droppableId === destination.droppableId) {
      // Reorder within same section
      const section = newSections.find(s => s.id === source.droppableId);
      if (section) {
        const [removed] = section.items.splice(source.index, 1);
        section.items.splice(destination.index, 0, removed);
      }
    } else {
      // Move between sections
      const sourceSection = newSections.find(s => s.id === source.droppableId);
      const destSection = newSections.find(s => s.id === destination.droppableId);
      if (sourceSection && destSection) {
        const [removed] = sourceSection.items.splice(source.index, 1);
        destSection.items.splice(destination.index, 0, removed);
      }
    }

    setSections(newSections);
    try {
      await axios.put(`http://localhost:3000/api/courses/${courseId}/content`, {
        sections: newSections
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Content order updated');
    } catch (error) {
      toast.error('Failed to update content order');
    }
  };

  const addNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Section',
      description: '',
      items: []
    };
    setSections([...sections, newSection]);
  };

  const handleBack = () => {
    navigate('/instructor/courses');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Courses</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Content</h1>
          <button
            onClick={addNewSection}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Section
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent"
            />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {sections.map((section) => (
                <ContentSection
                  key={section.id}
                  section={section}
                  onUpdate={(updatedSection) => {
                    const newSections = sections.map(s =>
                      s.id === updatedSection.id ? updatedSection : s
                    );
                    setSections(newSections);
                  }}
                  onDelete={() => {
                    setSections(sections.filter(s => s.id !== section.id));
                  }}
                  contentIcons={contentIcons}
                />
              ))}
            </div>
          </DragDropContext>
        )}

        <AssessmentModal
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
          section={selectedSection}
          onSave={(assessment) => {
            // Handle assessment save
          }}
        />
      </div>
    </div>
  );
};

export default CourseContentManager;