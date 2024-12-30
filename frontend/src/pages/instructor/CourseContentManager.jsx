import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ContentSection from '../../components/content/ContentSection'; // Correct import statement
import { AssessmentModal } from '../../components/content/AssessmentModal';
import { useToast } from '../../hooks/useToast';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Edit, X } from 'lucide-react';
import axios from 'axios';

const ALLOWED_FILE_TYPES = {
  'video': ['video/mp4', 'video/webm'],
  'document': ['application/pdf', '.doc', '.docx', 'text/plain'],
  'image': ['image/jpeg', 'image/png', 'image/gif']
};

const handleDragEnd = (sections, result) => {
  if (!result.destination) return;

  const { source, destination } = result;
  const newSections = [...sections];

  const sourceSection = newSections.find((section) => section.id === source.droppableId);
  const destinationSection = newSections.find((section) => section.id === destination.droppableId);

  if (sourceSection && destinationSection) {
    const sourceItems = [...sourceSection.items];
    const destinationItems = [...destinationSection.items];

    const [removed] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, removed);

    sourceSection.items = sourceItems;
    destinationSection.items = destinationItems;

    setSections(newSections);
    setUnsavedChanges(true);
  }
};

const contentIcons = {
  video: 'video-icon',
  document: 'document-icon',
  image: 'image-icon',
};

const CourseContentManager = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!courseId) {
      toast.error('No course selected');
      navigate('/instructor/courses');
      return;
    }
    
    fetchCourseData();
    fetchCourseContent();

    // Prompt user about unsaved changes
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [courseId, navigate, unsavedChanges]);

  const fetchCourseContent = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/api/courses/${courseId}/content`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data) {
      if (Array.isArray(response.data)) {
        setSections(response.data);
      } else {
        setSections([response.data]);
      }
    }
  } catch (error) {
    console.error('Error fetching course content:', error);
    toast.error('Failed to fetch course content');
  }
};

const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setCourse(response.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to fetch course details');
    }
  };

  const handleFileUpload = async (file, sectionId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sectionId', sectionId);
    formData.append('courseId', courseId);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/courses/${courseId}/content/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          }
        }
      );

      // Update sections with new content
      if (response.data.content) {
        const newSections = sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              items: [...section.items, response.data.content]
            };
          }
          return section;
        });
        setSections(newSections);
        setUnsavedChanges(true);
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      // Clear progress after upload
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    }
  };

  const handleContentAdd = async (sectionId, contentType) => {
    const newContent = {
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: contentType,
      title: `New ${contentType}`,
      description: '',
      content: ''
    };

    try {
      const newSections = sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: [...section.items, newContent]
          };
        }
        return section;
      });
      setSections(newSections);
      setUnsavedChanges(true);
      toast.success('Content added');
    } catch (error) {
      toast.error('Failed to add content');
    }
  };

  const handleContentRemove = async (sectionId, contentId) => {
    try {
      const newSections = sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter(item => item.id !== contentId)
          };
        }
        return section;
      });
      setSections(newSections);
      setUnsavedChanges(true);
      toast.success('Content removed');
    } catch (error) {
      toast.error('Failed to remove content');
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `http://localhost:3000/api/courses/${courseId}/content`,
        { sections },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setUnsavedChanges(false);
      toast.success('Changes saved successfully');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/instructor/courses')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isEditMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Edit className="w-4 h-4 mr-2 inline-block" />
              {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
            </button>
          </div>
          {unsavedChanges && (
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2 inline-block" />
              Save Changes
            </button>
          )}
        </div>

        {/* Course Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
          <p className="mt-2 text-gray-600">{course?.description}</p>
        </div>

        {/* Content Sections */}
        <DragDropContext onDragEnd={(result) => handleDragEnd(sections, result)}>
          <div className="space-y-6">
{sections.map((section, index) => (
  <ContentSection
    key={`${section.id}-${index}`}
    section={section}
    isEditMode={isEditMode}
    onUpdate={(updatedSection) => {
      const newSections = sections.map(s =>
        s.id === updatedSection.id ? updatedSection : s
      );
      setSections(newSections);
      setUnsavedChanges(true);
    }}
    onDelete={() => {
      setSections(sections.filter(s => s.id !== section.id));
      setUnsavedChanges(true);
    }}
    onFileUpload={(file) => handleFileUpload(file, section.id)}
    onContentAdd={(contentType) => handleContentAdd(section.id, contentType)}
    onContentRemove={(contentId) => handleContentRemove(section.id, contentId)}
    uploadProgress={uploadProgress}
    contentIcons={contentIcons}
  />
))}
          </div>
        </DragDropContext>

        {/* Assessment Modal */}
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
    </div>
  );
};

export default CourseContentManager;
