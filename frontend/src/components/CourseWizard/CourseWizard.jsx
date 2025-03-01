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
  LinearProgress,
  IconButton,
  CircularProgress
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
  const [courseFile, setCourseFile] = useState(null);
  const [extractRaw, setExtractRaw] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    sections: [],
    price: 0,
    durationInWeeks: 0,
    learningOutcomes: [],
    prerequisites: [],
    difficulty: 'Beginner',
    category: 'Web Development',
    tags: [],
    isPublished: false
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
    'Course Materials',
    'Review & Publish'
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

  const handleSectionAdd = () => {
    setCourseData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          content: '',
          subsections: []
        }
      ]
    }));
  };

  const handleSubsectionAdd = (sectionIndex) => {
    setCourseData(prev => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].subsections.push({
        title: '',
        content: ''
      });
      return {
        ...prev,
        sections: newSections
      };
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCourseFile(file);
      toast.success('Course material file uploaded successfully');
    }
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
        return !!(courseData.title && courseData.description && courseData.category && courseData.difficulty);
      case 1:
        return courseData.sections.length > 0 && courseData.sections.every(section => section.title && section.content);
      case 2:
        return !!courseFile;
      case 3:
        return true;
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

      const formData = new FormData();
      formData.append('file', courseFile);
      formData.append('extractRaw', extractRaw);
      formData.append('course', JSON.stringify(courseData));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/courses/instructor`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
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
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={courseData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="Mobile Development">Mobile Development</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="Cloud Computing">Cloud Computing</MenuItem>
                  <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                  <MenuItem value="Artificial Intelligence">Artificial Intelligence</MenuItem>
                  <MenuItem value="Blockchain">Blockchain</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required size="small">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={courseData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                value={courseData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <span>$</span>
                }}
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (weeks)"
                value={courseData.durationInWeeks}
                onChange={(e) => handleInputChange('durationInWeeks', parseInt(e.target.value))}
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Prerequisites (one per line)"
                value={courseData.prerequisites.join('\n')}
                onChange={(e) => handleInputChange('prerequisites', e.target.value.split('\n'))}
                helperText="Enter each prerequisite on a new line"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Learning Outcomes (one per line)"
                value={courseData.learningOutcomes.join('\n')}
                onChange={(e) => handleInputChange('learningOutcomes', e.target.value.split('\n'))}
                helperText="Enter each learning outcome on a new line"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={courseData.tags.join(', ')}
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                helperText="Enter tags separated by commas"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Button
              variant="outlined"
              startIcon={<BookIcon />}
              onClick={handleSectionAdd}
              sx={{
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              size="small"
            >
              Add Section
            </Button>
            {courseData.sections.map((section, sectionIndex) => (
              <Paper
                key={sectionIndex}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 2,
                  borderRadius: { xs: 1, sm: 2 }
                }}
                elevation={1}
              >
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...courseData.sections];
                        newSections[sectionIndex].title = e.target.value;
                        handleInputChange('sections', newSections);
                      }}
                      size="small"
                      sx={{
                        '& .MuiInputBase-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Section Content"
                      value={section.content}
                      onChange={(e) => {
                        const newSections = [...courseData.sections];
                        newSections[sectionIndex].content = e.target.value;
                        handleInputChange('sections', newSections);
                      }}
                      size="small"
                      sx={{
                        '& .MuiInputBase-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSubsectionAdd(sectionIndex)}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Add Subsection
                  </Button>
                </Box>

                {section.subsections.map((subsection, subsectionIndex) => (
                  <Paper
                    key={subsectionIndex}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      mt: { xs: 1.5, sm: 2 },
                      bgcolor: 'grey.50',
                      borderRadius: { xs: 1, sm: 2 }
                    }}
                    elevation={0}
                  >
                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subsection Title"
                          value={subsection.title}
                          onChange={(e) => {
                            const newSections = [...courseData.sections];
                            newSections[sectionIndex].subsections[subsectionIndex].title = e.target.value;
                            handleInputChange('sections', newSections);
                          }}
                          size="small"
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Subsection Content"
                          value={subsection.content}
                          onChange={(e) => {
                            const newSections = [...courseData.sections];
                            newSections[sectionIndex].subsections[subsectionIndex].content = e.target.value;
                            handleInputChange('sections', newSections);
                          }}
                          size="small"
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                          }}
                        />
                      </Grid>
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
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                mb: { xs: 2, sm: 3 }
              }}
            >
              Upload Course Materials
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <input
                  accept=".pdf,.doc,.docx,.txt,.md"
                  style={{ display: 'none' }}
                  id="course-material-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="course-material-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    size="small"
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Upload Course Material
                  </Button>
                </label>
                {courseFile && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Selected file: {courseFile.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl size="small">
                  <FormHelperText sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Extract raw content from the uploaded file
                  </FormHelperText>
                  <Select
                    value={extractRaw}
                    onChange={(e) => setExtractRaw(e.target.value)}
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      minWidth: { xs: 120, sm: 150 }
                    }}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                mb: { xs: 2, sm: 3 }
              }}
            >
              Review Course Details
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ mb: { xs: 2, sm: 3 } }}
                >
                  <FormHelperText sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Publish course immediately after creation
                  </FormHelperText>
                  <Select
                    value={courseData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.value)}
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: { xs: 1, sm: 2 }
                  }}
                  elevation={1}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      mb: { xs: 1.5, sm: 2 }
                    }}
                  >
                    Course Summary
                  </Typography>
                  <Grid container spacing={1}>
                    {[
                      { label: 'Title', value: courseData.title },
                      { label: 'Category', value: courseData.category },
                      { label: 'Difficulty', value: courseData.difficulty },
                      { label: 'Price', value: `$${courseData.price}` },
                      { label: 'Duration', value: `${courseData.durationInWeeks} weeks` },
                      { label: 'Number of Sections', value: courseData.sections.length }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            {item.label}:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              fontWeight: 500
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: { xs: 1, sm: 2 }
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            mb: { xs: 2, sm: 3 }
          }}
        >
          Create New Course
        </Typography>

        {/* Mobile Stepper Progress */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Step {activeStep + 1} of {steps.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(activeStep + 1) * (100 / steps.length)}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {steps[activeStep]}
          </Typography>
        </Box>

        {/* Desktop Stepper */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel={window.innerWidth < 600}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Content */}
        <Box sx={{ minHeight: { xs: 'auto', md: '400px' } }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 0 },
            mt: { xs: 3, sm: 4 }
          }}
        >
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            fullWidth={window.innerWidth < 600}
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            Back
          </Button>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {!showAIAssistant && (
              <Button
                variant="outlined"
                onClick={() => setShowAIAssistant(true)}
                fullWidth={window.innerWidth < 600}
              >
                AI Assistant
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submissionStatus.isSubmitting || !validateStep()}
                fullWidth={window.innerWidth < 600}
                sx={{
                  minWidth: { sm: '150px' }
                }}
              >
                {submissionStatus.isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Course'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep()}
                fullWidth={window.innerWidth < 600}
                sx={{
                  minWidth: { sm: '150px' }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <Box
            sx={{
              mt: { xs: 3, sm: 4 },
              p: { xs: 2, sm: 3 },
              bgcolor: 'background.default',
              borderRadius: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: { xs: 2, sm: 3 }
              }}
            >
              <Typography variant="h6">AI Assistant</Typography>
              <IconButton onClick={() => setShowAIAssistant(false)} size="small">
                <XIcon />
              </IconButton>
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: window.innerWidth < 600 ? 'center' : 'right'
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={submissionStatus.success ? "success" : "error"}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '400px' }
          }}
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
