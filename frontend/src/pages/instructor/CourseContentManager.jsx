import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ContentSection from '../../components/content/ContentSection';
import { AssessmentModal } from '../../components/content/AssessmentModal';
import { useToast } from '../../hooks/useToast';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  Edit, 
  X, 
  PlusCircle,
  AlertTriangle,
  FileVideo,
  FileText,
  Image as ImageIcon,
  Loader2,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';
import ChatInterface from '../../components/course-generator/ChatInterface';

const ALLOWED_FILE_TYPES = {
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf', '.doc', '.docx', 'text/plain'],
  image: ['image/jpeg', 'image/png', 'image/gif']
};

const contentIcons = {
  video: FileVideo,
  document: FileText,
  image: ImageIcon,
};

const CourseContentManager = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State Management
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // API Functions
  const api = {
    fetchCourse: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch course details');
        toast.error('Failed to fetch course details');
      }
    },

    fetchContent: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/courses/${courseId}/content`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSections(Array.isArray(response.data) ? response.data : [response.data]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch course content');
        toast.error('Failed to fetch course content');
      } finally {
        setIsLoading(false);
      }
    },

    saveChanges: async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        await axios.put(
          `http://localhost:3000/api/courses/${courseId}/content`,
          { sections },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnsavedChanges(false);
        toast.success('Changes saved successfully');
      } catch (err) {
        toast.error('Failed to save changes');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handlers
  const handlers = {
    dragEnd: (result) => {
      if (!result.destination) return;
      
      const { source, destination } = result;
      const newSections = [...sections];
      const sourceSection = newSections.find(section => section.id === source.droppableId);
      const destSection = newSections.find(section => section.id === destination.droppableId);
      
      if (sourceSection && destSection) {
        const sourceItems = [...sourceSection.items];
        const destItems = source.droppableId === destination.droppableId ? 
          sourceItems : [...destSection.items];
        
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        
        sourceSection.items = sourceItems;
        destSection.items = destItems;
        
        setSections(newSections);
        setUnsavedChanges(true);
      }
    },

    addSection: () => {
      const newSection = {
        id: `section-${Date.now()}`,
        title: 'New Section',
        items: []
      };
      setSections([...sections, newSection]);
      setUnsavedChanges(true);
    },

    updateSection: (updatedSection) => {
      setSections(sections.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      ));
      setUnsavedChanges(true);
    },

    deleteSection: (sectionId) => {
      if (window.confirm('Are you sure you want to delete this section?')) {
        setSections(sections.filter(s => s.id !== sectionId));
        setUnsavedChanges(true);
      }
    },

    uploadFile: async (file, sectionId) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sectionId', sectionId);
      formData.append('courseId', courseId);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://localhost:3000/api/courses/${courseId}/content/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
            }
          }
        );

        if (response.data.content) {
          setSections(sections.map(section => 
            section.id === sectionId 
              ? { ...section, items: [...section.items, response.data.content] }
              : section
          ));
          setUnsavedChanges(true);
          toast.success('File uploaded successfully');
        }
      } catch (err) {
        toast.error('Failed to upload file');
      } finally {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }
  };

  const handleAISuggestion = (suggestion) => {
    // Handle AI suggestions here
    console.log('AI Suggestion:', suggestion);
  };

  // Effects
  useEffect(() => {
    if (!courseId) {
      toast.error('No course selected');
      navigate('/instructor/courses');
      return;
    }

    api.fetchCourse();
    api.fetchContent();

    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/instructor/courses')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Courses
              </button>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  isEditMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {isEditMode && (
                <button
                  onClick={handlers.addSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Section
                </button>
              )}
              {unsavedChanges && (
                <button
                  onClick={api.saveChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
            <p className="mt-2 text-gray-600">{course?.description}</p>
          </div>
        </header>

        {/* Content Sections */}
        <DragDropContext onDragEnd={handlers.dragEnd}>
          <AnimatePresence>
            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ContentSection
                    section={section}
                    isEditMode={isEditMode}
                    onUpdate={handlers.updateSection}
                    onDelete={() => handlers.deleteSection(section.id)}
                    onFileUpload={(file) => handlers.uploadFile(file, section.id)}
                    uploadProgress={uploadProgress}
                    contentIcons={contentIcons}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </DragDropContext>

        {/* Modals */}
        <AssessmentModal
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
          section={selectedSection}
          onSave={(assessment) => {
            setIsAssessmentModalOpen(false);
            setUnsavedChanges(true);
          }}
        />
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <ChatInterface
            onClose={() => setShowChat(false)}
            onSuggestion={handleAISuggestion}
          />
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default CourseContentManager;