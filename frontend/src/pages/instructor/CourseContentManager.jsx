import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Video,
  FileText,
  File,
  Download,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Settings,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseContentManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          setError('No course ID provided');
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setIsLoading(false);
          navigate('/login');
          return;
        }

        // Fetch course details
        const courseResponse = await axios.get(
          `http://localhost:3000/api/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourse(courseResponse.data.data);

        // If there are modules, set the first one as active
        if (courseResponse.data.data.modules?.length > 0) {
          setActiveModule(courseResponse.data.data.modules[0]._id);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        let errorMessage = 'Failed to load course content';
        
        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = 'Invalid course ID';
              break;
            case 401:
              errorMessage = 'Please log in to view this course';
              navigate('/login');
              break;
            case 403:
              errorMessage = 'You do not have permission to view this course';
              navigate('/instructor/courses');
              break;
            case 404:
              errorMessage = 'Course not found';
              navigate('/instructor/courses');
              break;
            default:
              errorMessage = error.response.data?.message || errorMessage;
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  const handleDownloadResource = async (resourceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/courses/${id}/resources/${resourceId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['x-filename'] || 'resource');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Failed to download resource');
    }
  };

  const handleAddResource = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:3000/api/courses/${id}/resources`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Resource uploaded successfully');
      setResources([...resources, response.data.data]);
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error('Failed to upload resource');
    }
  };

  const getResourceIcon = (fileType) => {
    const iconMap = {
      'pdf': <FileText className="w-6 h-6 text-red-500" />,
      'doc': <File className="w-6 h-6 text-blue-500" />,
      'docx': <File className="w-6 h-6 text-blue-500" />,
      'ppt': <File className="w-6 h-6 text-orange-500" />,
      'pptx': <File className="w-6 h-6 text-orange-500" />,
      'xls': <File className="w-6 h-6 text-green-500" />,
      'xlsx': <File className="w-6 h-6 text-green-500" />,
      'default': <File className="w-6 h-6 text-gray-500" />
    };

    const extension = fileType.split('.').pop().toLowerCase();
    return iconMap[extension] || iconMap['default'];
  };

  const fetchCourseResources = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Normalize course category to match resource schema
      const normalizedSubject = course?.category 
        ? course.category.toLowerCase().replace(/\s+/g, '')
        : 'general';

      const response = await axios.get(
        `http://localhost:3000/api/content/resources`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            subject: normalizedSubject,
            type: 'article',
            level: course?.level || 'beginner',
            isFree: 'true'  // Only fetch free resources by default
          }
        }
      );

      // If no resources found, try a more generic search
      const resources = response.data.length > 0 
        ? response.data 
        : await axios.get(
            `http://localhost:3000/api/content/resources`, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                type: 'article',
                level: 'beginner',
                isFree: 'true'
              }
            }
          ).then(res => res.data);

      setResources(resources);
    } catch (error) {
      console.error('Error fetching course resources:', error);
      toast.error('Failed to load course resources');
      setResources([]);  // Ensure resources is an empty array on error
    }
  };

  useEffect(() => {
    if (course?.category) {
      fetchCourseResources();
    }
  }, [course]);

  // Render Resources Section
  const renderResourceSection = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Course Resources</h3>
        <label className="cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => handleAddResource(e.target.files[0])}
          />
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Resource</span>
          </div>
        </label>
      </div>
      {resources.length === 0 ? (
        <div className="text-center text-gray-500">
          No resources uploaded yet
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div 
              key={resource._id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getResourceIcon(resource.fileType)}
                <div>
                  <p className="text-sm font-medium">{resource.fileName}</p>
                  <p className="text-xs text-gray-500">{resource.fileSize} KB</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownloadResource(resource._id)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {course?.title || 'Course Content'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {course?.description || 'Manage your course content'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(`/instructor/courses/${id}/settings`)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              title="Course Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Course Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Modules List */}
          <div className="col-span-4 space-y-6">
            {/* Modules Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Modules</h2>
                </div>
              </div>
              <div className="divide-y">
                {course?.modules?.map((module, index) => (
                  <div
                    key={module._id || index}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeModule === module._id
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveModule(module._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {module.content?.length || 0} items
                        </p>
                      </div>
                      {activeModule === module._id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            {renderResourceSection()}
          </div>

          {/* Content Area */}
          <div className="col-span-8 space-y-6">
            {activeModule ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  {/* Module Details */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900">
                      {course?.modules?.find((m) => m._id === activeModule)?.title}
                    </h2>
                    <p className="mt-2 text-gray-600">
                      {course?.modules?.find((m) => m._id === activeModule)?.description}
                    </p>
                  </div>

                  {/* Content List */}
                  <div className="space-y-4">
                    {course?.modules
                      ?.find((m) => m._id === activeModule)
                      ?.content?.map((content, index) => (
                        <motion.div
                          key={content._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 rounded-lg border ${
                            activeContent === content._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                          onClick={() => setActiveContent(content._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Video className="w-6 h-6 text-gray-500" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {content.title}
                                </h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-gray-500 flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {content.duration || 0} min
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {content.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Select a Module
                </h3>
                <p className="mt-2 text-gray-500">
                  Choose a module from the list to view its content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentManager;