import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  Button,
  Paper,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  Divider,
  Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  Book as BookIcon, 
  FileText as FileTextIcon, 
  Upload as UploadIcon, 
  MessageSquare as MessageSquareIcon, 
  X as XIcon,
  Video as VideoIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import axios from 'axios';
import AIAssistant from '../course-generator/AIAssistant';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

const CourseWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    deliveryMethod: 'on-demand',
    topics: [],
    resources: [],
    duration: {
      totalHours: 0,
      weeksDuration: 1,
      selfPacedDeadline: null
    },
    courseSettings: {
      isEnrollmentOpen: true,
      startDate: null,
      endDate: null,
      maxStudents: null,
      prerequisites: [],
      objectives: [],
      certificateAvailable: false,
      completionCriteria: {
        minAttendance: 80,
        minAssignments: 70,
        minQuizScore: 60
      }
    },
    modules: [],
    liveSessions: []
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitting: false,
    success: false,
    error: null
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const steps = [
    'Basic Information',
    'Course Structure',
    'Content Upload',
    'Schedule & Delivery',
    'Settings & Requirements'
  ];

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setCourseData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleModuleAdd = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: '',
          description: '',
          content: []
        }
      ]
    }));
  };

  const handleContentAdd = (moduleIndex, contentType) => {
    const newContent = {
      type: contentType,
      title: '',
      description: '',
      url: '',
      duration: 0
    };

    if (contentType === 'video') {
      newContent.maxDuration = 45; // 45 minutes max
    }

    if (contentType === 'live-session') {
      newContent.scheduledTime = null;
      newContent.meetingLink = '';
    }

    setCourseData(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].content.push(newContent);
      return { ...prev, modules: newModules };
    });
  };

  const handleLiveSessionAdd = () => {
    setCourseData(prev => ({
      ...prev,
      liveSessions: [
        ...prev.liveSessions,
        {
          sessionDate: null,
          startTime: '',
          endTime: '',
          topic: '',
          meetingLink: '',
          materials: []
        }
      ]
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return !!(courseData.title && courseData.description && courseData.category && courseData.level);
      case 1:
        return courseData.modules.length > 0;
      case 2:
        return courseData.modules.every(module => 
          module.content.every(content => 
            content.title && (content.url || content.type === 'live-session')
          )
        );
      case 3:
        if (courseData.deliveryMethod === 'live') {
          return courseData.liveSessions.length > 0;
        }
        return true;
      case 4:
        return !!(courseData.courseSettings.startDate && courseData.courseSettings.endDate);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmissionStatus({ 
      isSubmitting: true, 
      success: false, 
      error: null 
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:3000/api/courses', 
        courseData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSubmissionStatus({
        isSubmitting: false,
        success: true,
        error: null
      });

      toast.success('Course created successfully!');
      navigate('/instructor/courses');

    } catch (error) {
      console.error('Error creating course:', error);
      setSubmissionStatus({
        isSubmitting: false,
        success: false,
        error: error.response?.data?.message || 'Failed to create course'
      });
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleContentUpload = (moduleIndex, contentType) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    // Set file type based on content type
    switch(contentType) {
      case 'video':
        input.accept = 'video/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt,.ppt,.pptx';
        break;
      case 'quiz':
        input.accept = '.json,.csv,.xlsx';
        break;
      default:
        input.accept = '*/*';
    }

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Create a file URL
        const fileUrl = URL.createObjectURL(file);

        // Update course data
        setCourseData(prevData => {
          const newModules = [...prevData.modules];
          
          // Ensure module exists
          if (!newModules[moduleIndex]) {
            newModules[moduleIndex] = {
              title: `Module ${moduleIndex + 1}`,
              description: '',
              content: []
            };
          }

          // Add new content
          const newContent = {
            type: contentType,
            title: file.name,
            file: file,
            url: fileUrl,
            ...(contentType === 'video' ? { 
              duration: 0, 
              maxDuration: 45 
            } : {})
          };

          newModules[moduleIndex].content.push(newContent);

          return {
            ...prevData,
            modules: newModules
          };
        });

        // Show success message
        toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} uploaded successfully`);
      }
    };

    // Trigger file selection
    input.click();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Course Description"
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={courseData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <MenuItem value="programming">Programming</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="mathematics">Mathematics</MenuItem>
                  <MenuItem value="science">Science</MenuItem>
                  <MenuItem value="language">Language</MenuItem>
                  <MenuItem value="arts">Arts</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="personal-development">Personal Development</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  value={courseData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Delivery Method</InputLabel>
                <Select
                  value={courseData.deliveryMethod}
                  onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                >
                  <MenuItem value="on-demand">On-Demand</MenuItem>
                  <MenuItem value="live">Live Virtual Sessions</MenuItem>
                  <MenuItem value="self-paced">Self-Paced</MenuItem>
                </Select>
                <FormHelperText>
                  {courseData.deliveryMethod === 'on-demand' && 'Pre-recorded videos and materials available anytime'}
                  {courseData.deliveryMethod === 'live' && 'Scheduled live virtual sessions with instructor'}
                  {courseData.deliveryMethod === 'self-paced' && 'Flexible learning with extended access'}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<BookIcon />} 
              onClick={handleModuleAdd}
              sx={{ mb: 3 }}
            >
              ADD MODULE
            </Button>
            {courseData.modules.map((module, moduleIndex) => (
              <Paper key={moduleIndex} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Module Title"
                      value={module.title}
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].title = e.target.value;
                        handleInputChange('modules', newModules);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Module Description"
                      value={module.description}
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].description = e.target.value;
                        handleInputChange('modules', newModules);
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>Content</Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    startIcon={<VideoIcon />}
                    onClick={() => handleContentUpload(moduleIndex, 'video')}
                    variant="text"
                    color="primary"
                    size="small"
                  >
                    ADD VIDEO
                  </Button>
                  <Button
                    startIcon={<FileTextIcon />}
                    onClick={() => handleContentUpload(moduleIndex, 'document')}
                    variant="text"
                    color="primary"
                    size="small"
                  >
                    ADD DOCUMENT
                  </Button>
                  <Button
                    startIcon={<MessageSquareIcon />}
                    onClick={() => handleContentUpload(moduleIndex, 'quiz')}
                    variant="text"
                    color="primary"
                    size="small"
                  >
                    ADD QUIZ
                  </Button>
                </Box>

                {module.content.map((content, contentIndex) => (
                  <Paper key={contentIndex} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={`${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Title`}
                          value={content.title}
                          onChange={(e) => {
                            const newModules = [...courseData.modules];
                            newModules[moduleIndex].content[contentIndex].title = e.target.value;
                            handleInputChange('modules', newModules);
                          }}
                        />
                      </Grid>
                      {content.type === 'video' && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Duration (minutes)"
                            value={content.duration}
                            onChange={(e) => {
                              const duration = Math.min(parseInt(e.target.value), 45);
                              const newModules = [...courseData.modules];
                              newModules[moduleIndex].content[contentIndex].duration = duration;
                              handleInputChange('modules', newModules);
                            }}
                            helperText="Maximum duration: 45 minutes"
                          />
                        </Grid>
                      )}
                      {content.url && (
                        <Grid item xs={12}>
                          <Box sx={{ mt: 1 }}>
                            {content.type === 'video' ? (
                              <video 
                                src={content.url} 
                                controls 
                                style={{ maxWidth: '100%', maxHeight: '200px' }} 
                              />
                            ) : (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {content.type === 'document' ? '📄' : '📝'}
                                {content.title}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                ))}
              </Paper>
            ))}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<BookIcon />} 
              onClick={handleModuleAdd}
              sx={{ mb: 3 }}
            >
              Add Module
            </Button>
            {courseData.modules.map((module, moduleIndex) => (
              <Paper key={moduleIndex} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Module Title"
                      value={module.title}
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].title = e.target.value;
                        handleInputChange('modules', newModules);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Module Description"
                      value={module.description}
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].description = e.target.value;
                        handleInputChange('modules', newModules);
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Module Content
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<VideoIcon />}
                        onClick={() => handleContentAdd(moduleIndex, 'video')}
                        sx={{ mr: 1 }}
                      >
                        Add Video
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<FileTextIcon />}
                        onClick={() => handleContentAdd(moduleIndex, 'document')}
                        sx={{ mr: 1 }}
                      >
                        Add Document
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<MessageSquareIcon />}
                        onClick={() => handleContentAdd(moduleIndex, 'quiz')}
                      >
                        Add Quiz
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => handleContentUpload(moduleIndex, 'video')}
                        sx={{ mr: 1 }}
                      >
                        Upload Video
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => handleContentUpload(moduleIndex, 'document')}
                        sx={{ mr: 1 }}
                      >
                        Upload Document
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => handleContentUpload(moduleIndex, 'quiz')}
                      >
                        Upload Quiz
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {module.content.map((content, contentIndex) => (
                  <Paper key={contentIndex} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={`${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Title`}
                          value={content.title}
                          onChange={(e) => {
                            const newModules = [...courseData.modules];
                            newModules[moduleIndex].content[contentIndex].title = e.target.value;
                            handleInputChange('modules', newModules);
                          }}
                        />
                      </Grid>
                      {content.type === 'video' && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Duration (minutes)"
                            value={content.duration}
                            onChange={(e) => {
                              const duration = Math.min(parseInt(e.target.value), 45);
                              const newModules = [...courseData.modules];
                              newModules[moduleIndex].content[contentIndex].duration = duration;
                              handleInputChange('modules', newModules);
                            }}
                            helperText="Maximum duration: 45 minutes"
                          />
                        </Grid>
                      )}
                      {content.url && (
                        <Grid item xs={12}>
                          {content.type === 'video' ? (
                            <video 
                              src={content.url} 
                              controls 
                              style={{ maxWidth: '100%', maxHeight: '300px' }} 
                            />
                          ) : content.type === 'document' ? (
                            <Typography variant="body2">
                              📄 {content.title}
                            </Typography>
                          ) : content.type === 'quiz' ? (
                            <Typography variant="body2">
                              📝 Quiz: {content.title}
                            </Typography>
                          ) : null}
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                ))}
              </Paper>
            ))}
          </Box>
        );

      case 3:
        return (
          <Box>
            {courseData.deliveryMethod === 'live' && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CalendarIcon />}
                  onClick={handleLiveSessionAdd}
                  sx={{ mb: 3 }}
                >
                  Add Live Session
                </Button>
                {courseData.liveSessions.map((session, index) => (
                  <Paper key={index} sx={{ p: 3, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label="Session Date"
                            value={session.sessionDate}
                            onChange={(newValue) => {
                              const newSessions = [...courseData.liveSessions];
                              newSessions[index].sessionDate = newValue;
                              handleInputChange('liveSessions', newSessions);
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Topic"
                          value={session.topic}
                          onChange={(e) => {
                            const newSessions = [...courseData.liveSessions];
                            newSessions[index].topic = e.target.value;
                            handleInputChange('liveSessions', newSessions);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Course Start Date"
                    value={courseData.courseSettings.startDate}
                    onChange={(newValue) => {
                      handleNestedInputChange('courseSettings', 'startDate', newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Course End Date"
                    value={courseData.courseSettings.endDate}
                    onChange={(newValue) => {
                      handleNestedInputChange('courseSettings', 'endDate', newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Students"
                value={courseData.courseSettings.maxStudents}
                onChange={(e) => handleNestedInputChange('courseSettings', 'maxStudents', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Prerequisites (one per line)"
                value={courseData.courseSettings.prerequisites.join('\n')}
                onChange={(e) => handleNestedInputChange('courseSettings', 'prerequisites', e.target.value.split('\n'))}
                helperText="Enter each prerequisite on a new line"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Learning Objectives (one per line)"
                value={courseData.courseSettings.objectives.join('\n')}
                onChange={(e) => handleNestedInputChange('courseSettings', 'objectives', e.target.value.split('\n'))}
                helperText="Enter each objective on a new line"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Completion Criteria
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Attendance (%)"
                    value={courseData.courseSettings.completionCriteria.minAttendance}
                    onChange={(e) => {
                      const newCriteria = {
                        ...courseData.courseSettings.completionCriteria,
                        minAttendance: parseInt(e.target.value)
                      };
                      handleNestedInputChange('courseSettings', 'completionCriteria', newCriteria);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Assignment Score (%)"
                    value={courseData.courseSettings.completionCriteria.minAssignments}
                    onChange={(e) => {
                      const newCriteria = {
                        ...courseData.courseSettings.completionCriteria,
                        minAssignments: parseInt(e.target.value)
                      };
                      handleNestedInputChange('courseSettings', 'completionCriteria', newCriteria);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Quiz Score (%)"
                    value={courseData.courseSettings.completionCriteria.minQuizScore}
                    onChange={(e) => {
                      const newCriteria = {
                        ...courseData.courseSettings.completionCriteria,
                        minQuizScore: parseInt(e.target.value)
                      };
                      handleNestedInputChange('courseSettings', 'completionCriteria', newCriteria);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Course
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Box>
            {!showAIAssistant && (
              <Button
                variant="outlined"
                onClick={() => setShowAIAssistant(true)}
                sx={{ mr: 2 }}
              >
                AI Assistant
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submissionStatus.isSubmitting || !validateStep()}
              >
                Create Course
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep()}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        {showAIAssistant && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">AI Assistant</Typography>
              <Button onClick={() => setShowAIAssistant(false)}>
                <XIcon />
              </Button>
            </Box>
            <AIAssistant
              courseData={courseData}
              onSuggestionsApply={(suggestions) => {
                setCourseData(prev => ({
                  ...prev,
                  ...suggestions
                }));
              }}
            />
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={submissionStatus.success ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {submissionStatus.success
            ? "Course created successfully!"
            : submissionStatus.error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseWizard;
