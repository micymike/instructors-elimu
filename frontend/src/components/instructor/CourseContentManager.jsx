import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Video, FileText, Link, Download, 
  ChevronRight, BookOpen, ChevronDown, Plus, Pencil, Trash2, GripVertical, Save, AlertCircle
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
axios.defaults.baseURL = API_BASE_URL;

const contentTypes = {
  video: { icon: Video, label: "Video", description: "Upload a video lesson" },
  document: { icon: FileText, label: "Document", description: "Upload a PDF or text document" },
  link: { icon: Link, label: "External Link", description: "Add a web resource" },
  download: { icon: Download, label: "Downloadable Resource", description: "Provide a downloadable file" }
};

const CourseContentManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState(new Set(["section-1"]));
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  // Centralized token management
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      fetchCourses();
    } else {
      navigate('/login');
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/instructor/courses');
      
      // Robust response handling
      let validCourses = [];
      if (Array.isArray(response.data)) {
        validCourses = response.data;
      } else if (response.data && Array.isArray(response.data.courses)) {
        validCourses = response.data.courses;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        validCourses = response.data.data;
      }

      setCourses(validCourses);
    } catch (error) {
      toast.error('Failed to load courses');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch content for selected course
  const fetchCourseContent = async (courseId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/instructor/multimedia/${courseId}`);
      setCourseContent(response.data);
      setSelectedCourse(courseId);
    } catch (error) {
      toast.error('Failed to load course content');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload new content
  const uploadContent = async (contentData) => {
    try {
      const response = await axios.post('/instructor/multimedia/create', {
        ...contentData,
        courseId: selectedCourse
      });
      
      toast.success('Content uploaded successfully');
      // Refresh course content
      fetchCourseContent(selectedCourse);
    } catch (error) {
      toast.error('Failed to upload content');
      console.error(error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceSection = courseContent.sections.find(s => s.id === source.droppableId);
    const destSection = courseContent.sections.find(s => s.id === destination.droppableId);

    if (!sourceSection || !destSection) return;

    const newCourseContent = { ...courseContent };
    const [movedItem] = sourceSection.items.splice(source.index, 1);
    destSection.items.splice(destination.index, 0, movedItem);

    setCourseContent(newCourseContent);
    setIsEditing(true);
  };

  const addNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      items: []
    };
    setCourseContent({ ...courseContent, sections: [...courseContent.sections, newSection] });
    setExpandedSections(new Set([...expandedSections, newSection.id]));
    setIsEditing(true);
  };

  const addContentItem = (sectionId, type) => {
    const newItem = {
      id: `item-${Date.now()}`,
      type,
      title: `New ${contentTypes[type].label}`,
      ...(type === 'video' ? { duration: "0:00" } : {}),
      ...(type === 'document' ? { size: "0 KB" } : {}),
      ...(type === 'link' ? { url: "" } : {})
    };

    setCourseContent({ ...courseContent, sections: courseContent.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    }) });
    setIsEditing(true);
  };

  const saveChanges = async () => {
    try {
      // Update course content
      const updatedCourse = await axios.put(`/instructor/multimedia/${selectedCourse}`, courseContent);
      
      toast.success('Course content updated successfully');
      setIsEditing(false);
      
      // Optionally refresh the course data
      setCourseContent(updatedCourse.data);
    } catch (error) {
      toast.error('Failed to update course content');
      console.error('Update error:', error);
    }
  };

  const startEditingItem = (sectionId, itemId) => {
    const section = courseContent.sections.find(s => s.id === sectionId);
    const item = section.items.find(i => i.id === itemId);
    setEditingItem({ sectionId, ...item });
  };

  const updateEditingItem = (field, value) => {
    if (!editingItem) return;

    const updatedItem = { ...editingItem, [field]: value };
    setEditingItem(updatedItem);

    // Update the item in sections
    setCourseContent({ ...courseContent, sections: courseContent.sections.map(section => {
      if (section.id === editingItem.sectionId) {
        return {
          ...section,
          items: section.items.map(item => 
            item.id === editingItem.id ? updatedItem : item
          )
        };
      }
      return section;
    }) });

    setIsEditing(true);
  };

  // Render course selection view
  const renderCoursesView = () => (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select a Course to Manage Content</h2>
      {isLoading ? (
        <div>Loading courses...</div>
      ) : (
        <div className="grid gap-4">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => fetchCourseContent(course.id)}
            >
              <div className="flex items-center">
                <BookOpen className="mr-3 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-gray-500 text-sm">{course.description}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render course content management view
  const renderCourseContentView = () => (
    <div className="container mx-auto p-4">
      <button 
        onClick={() => setSelectedCourse(null)} 
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Courses
      </button>
      
      <h2 className="text-2xl font-bold mb-4">Manage Course Content</h2>
      
      {/* Content upload section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Upload New Content</h3>
        {/* Add content upload form or modal here */}
      </div>

      {/* Existing content list */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Content</h3>
        {courseContent.sections && courseContent.sections.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            {courseContent.sections.map((section) => (
              <div key={section.id} className="border rounded-lg">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => {
                    const newExpanded = new Set(expandedSections);
                    if (newExpanded.has(section.id)) {
                      newExpanded.delete(section.id);
                    } else {
                      newExpanded.add(section.id);
                    }
                    setExpandedSections(newExpanded);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <h3 className="font-medium">{section.title}</h3>
                    <span className="text-sm text-gray-500">
                      {section.items.length} items
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.has(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Droppable droppableId={section.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="p-4 space-y-2"
                          >
                            {section.items.map((item, index) => {
                              const ContentIcon = contentTypes[item.type].icon;
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center space-x-3 p-3 bg-white border rounded-lg"
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="text-gray-400"
                                      >
                                        <GripVertical className="h-5 w-5" />
                                      </div>
                                      <ContentIcon className="h-5 w-5 text-gray-500" />
                                      <div className="flex-1">
                                        <h4 className="font-medium">{item.title}</h4>
                                        <p className="text-sm text-gray-500">
                                          {item.duration || item.size || item.url}
                                        </p>
                                      </div>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => startEditingItem(section.id, item.id)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                        >
                                          <Pencil className="h-4 w-4 text-gray-500" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                          <Trash2 className="h-4 w-4 text-gray-500" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                            <div className="flex space-x-2 pt-2">
                              {Object.entries(contentTypes).map(([type, { icon: Icon, label }]) => (
                                <button
                                  key={type}
                                  onClick={() => addContentItem(section.id, type)}
                                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
                                >
                                  <Plus className="h-3 w-3" />
                                  <Icon className="h-3 w-3" />
                                  <span>{label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </DragDropContext>
        ) : (
          <p className="text-gray-500">No content uploaded yet</p>
        )}
      </div>

      {isEditing && (
        <button
          onClick={saveChanges}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      )}
      <button
        onClick={addNewSection}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        <span>Add Section</span>
      </button>
    </div>
  );

  return (
    <div>
      {selectedCourse === null 
        ? renderCoursesView() 
        : renderCourseContentView()}
    </div>
  );
};

export default CourseContentManager;