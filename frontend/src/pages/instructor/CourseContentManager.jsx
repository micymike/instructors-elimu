import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Upload,
  Eye,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  IconButton,
  Tabs,
  Tab,
  TextField,
  Grid,
  Paper,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { courseAPI, liveSessionAPI, resourceAPI } from '../../services/api';

const CourseContentManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [liveSessionDialog, setLiveSessionDialog] = useState({
    open: false,
    mode: 'create', // 'create' or 'edit'
    sessionData: {
      topic: '',
      startTime: null,
      duration: 45, // default 45 minutes
    }
  });
  const [activeTab, setActiveTab] = useState(0);

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

        // Fetch course details
        const courseResponse = await courseAPI.getCourse(id);
        setCourse(courseResponse);

        // If there are modules, set the first one as active
        if (courseResponse.modules?.length > 0) {
          setActiveModule(courseResponse.modules[0]._id);
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
      const response = await resourceAPI.downloadResource(id, resourceId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.filename);
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
      const metadata = {
        type: 'article',
        subject: course?.category?.toLowerCase().replace(/\s+/g, '') || 'general',
        level: course?.level || 'beginner',
        courseId: id
      };

      const response = await resourceAPI.uploadResource(id, file, metadata);
      toast.success('Resource uploaded successfully');
      setResources([...resources, response]);
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resource');
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
      const params = {
        subject: course?.category?.toLowerCase().replace(/\s+/g, '') || 'general',
        type: 'article',
        level: course?.level || 'beginner',
        isFree: 'true'
      };

      const response = await resourceAPI.getResources(params);
      setResources(response);
    } catch (error) {
      console.error('Error fetching course resources:', error);
      toast.error('Failed to fetch resources');
    }
  };

  useEffect(() => {
    if (course?.category) {
      fetchCourseResources();
    }
  }, [course]);

  const handlePreviewResource = async (resourceId) => {
    try {
      const response = await resourceAPI.previewResource(id, resourceId);
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
      setSelectedPdfUrl(url);
    } catch (error) {
      console.error('Error previewing resource:', error);
      toast.error('Failed to preview resource');
    }
  };

  const renderResourceItem = (resource) => {
    const fileExtension = resource.filename.split('.').pop().toLowerCase();
    
    return (
      <div 
        key={resource._id} 
        className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition"
      >
        <div className="flex items-center space-x-3">
          {getResourceIcon(fileExtension)}
          <span>{resource.filename}</span>
        </div>
        <div className="flex items-center space-x-2">
          {fileExtension === 'pdf' && (
            <IconButton 
              onClick={() => handlePreviewResource(resource._id)}
              title="Preview PDF"
            >
              <Eye className="w-5 h-5 text-blue-500" />
            </IconButton>
          )}
          <IconButton 
            onClick={() => handleDownloadResource(resource._id)}
            title="Download"
          >
            <Download className="w-5 h-5 text-green-500" />
          </IconButton>
        </div>
      </div>
    );
  };

  const handleCreateLiveSession = async () => {
    try {
      const response = await liveSessionAPI.createLiveSession(id, liveSessionDialog.sessionData);
      
      // Update course state with new live session
      setCourse(prev => ({
        ...prev,
        liveSessions: [...(prev.liveSessions || []), response]
      }));

      toast.success('Live session created successfully');
      setLiveSessionDialog({ 
        open: false, 
        mode: 'create', 
        sessionData: { topic: '', startTime: null, duration: 45 } 
      });
    } catch (error) {
      toast.error('Failed to create live session');
    }
  };

  const handleUpdateLiveSession = async () => {
    try {
      const sessionId = liveSessionDialog.sessionData._id;
      const response = await liveSessionAPI.updateLiveSession(id, sessionId, {
        topic: liveSessionDialog.sessionData.topic,
        startTime: liveSessionDialog.sessionData.startTime,
        duration: liveSessionDialog.sessionData.duration
      });

      // Update course state with updated live session
      setCourse(prev => ({
        ...prev,
        liveSessions: prev.liveSessions.map(session => 
          session._id === sessionId ? response : session
        )
      }));

      toast.success('Live session updated successfully');
      setLiveSessionDialog({ 
        open: false, 
        mode: 'create', 
        sessionData: { topic: '', startTime: null, duration: 45 } 
      });
    } catch (error) {
      toast.error('Failed to update live session');
    }
  };

  const handleDeleteLiveSession = async (sessionId) => {
    try {
      await liveSessionAPI.deleteLiveSession(id, sessionId);
      toast.success('Live session deleted successfully');
      
      // Remove session from course state
      setCourse(prev => ({
        ...prev,
        liveSessions: prev.liveSessions.filter(session => session._id !== sessionId)
      }));
    } catch (error) {
      toast.error('Failed to delete live session');
    }
  };

  const renderLiveSessions = () => (
    <Box>
      <Button 
        variant="contained" 
        startIcon={<Calendar />}
        onClick={() => setLiveSessionDialog({ 
          open: true, 
          mode: 'create', 
          sessionData: { topic: '', startTime: null, duration: 45 } 
        })}
        sx={{ mb: 2 }}
      >
        Schedule Live Session
      </Button>

      {course?.liveSessions?.map((session, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1">{session.topic}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(session.startTime).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Edit Session">
              <IconButton 
                color="primary"
                onClick={() => setLiveSessionDialog({
                  open: true,
                  mode: 'edit',
                  sessionData: {
                    _id: session._id,
                    topic: session.topic,
                    startTime: session.startTime,
                    duration: session.duration
                  }
                })}
              >
                <Edit3 size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy Meeting Link">
              <IconButton 
                color="secondary"
                onClick={() => navigator.clipboard.writeText(session.meetingLink)}
              >
                <Link className="w-5 h-5" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Session">
              <IconButton 
                color="error"
                onClick={() => handleDeleteLiveSession(session._id)}
              >
                <Trash2 size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}

      <Dialog 
        open={liveSessionDialog.open} 
        onClose={() => setLiveSessionDialog(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {liveSessionDialog.mode === 'create' 
            ? 'Schedule New Live Session' 
            : 'Edit Live Session'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Session Topic"
                value={liveSessionDialog.sessionData.topic}
                onChange={(e) => setLiveSessionDialog(prev => ({
                  ...prev,
                  sessionData: { ...prev.sessionData, topic: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Session Start Time"
                  value={liveSessionDialog.sessionData.startTime}
                  onChange={(newValue) => setLiveSessionDialog(prev => ({
                    ...prev,
                    sessionData: { ...prev.sessionData, startTime: newValue }
                  }))}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Session Duration (minutes)"
                value={liveSessionDialog.sessionData.duration}
                onChange={(e) => setLiveSessionDialog(prev => ({
                  ...prev,
                  sessionData: { 
                    ...prev.sessionData, 
                    duration: parseInt(e.target.value) 
                  }
                }))}
                inputProps={{ min: 15, max: 120 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLiveSessionDialog(prev => ({ ...prev, open: false }))}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={liveSessionDialog.mode === 'create' 
              ? handleCreateLiveSession 
              : handleUpdateLiveSession
            }
          >
            {liveSessionDialog.mode === 'create' ? 'Schedule' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

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
          {resources.map((resource) => renderResourceItem(resource))}
        </div>
      )}
    </div>
  );

  return (
    <>
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
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ mb: 3 }}
              >
                <Tab label="Modules" />
                <Tab label="Live Sessions" />
                <Tab label="Resources" />
              </Tabs>

              {activeTab === 0 && (
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
              )}

              {activeTab === 1 && renderLiveSessions()}

              {activeTab === 2 && (
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

      {/* PDF Preview Dialog */}
      <Dialog 
        open={!!selectedPdfUrl} 
        onClose={() => setSelectedPdfUrl(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          PDF Preview
          <IconButton 
            onClick={() => setSelectedPdfUrl(null)} 
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPdfUrl && (
            <iframe 
              src={selectedPdfUrl} 
              width="100%" 
              height="600px" 
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseContentManager;
