import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Drawer,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Slider
} from '@mui/material';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Plus,
  X,
  BookTemplate,
  Settings as SettingsIcon,
  BarChart2,
  Award,
  MessageCircle
} from 'lucide-react';
import GradingService from '../../services/grading.service';
import RubricManager from '../../components/grading/RubricManager';
import FeedbackManager from '../../components/grading/FeedbackManager';
import SubmissionViewer from '../../components/grading/SubmissionViewer';
import GradingShortcuts from '../../components/grading/GradingShortcuts';

const AssignmentGrading = () => {
  const { courseId, assignmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [rubric, setRubric] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showRubricDialog, setShowRubricDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [rubricScores, setRubricScores] = useState({});
  const [showFeedbackManager, setShowFeedbackManager] = useState(false);
  const [showTemplatesSidebar, setShowTemplatesSidebar] = useState(false);
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showSendFeedback, setShowSendFeedback] = useState(false);
  const [showTemplatesInDialog, setShowTemplatesInDialog] = useState(false);
  const [manualGrade, setManualGrade] = useState(0);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [markedPaper, setMarkedPaper] = useState(null);
  const [manualScores, setManualScores] = useState({});

  useEffect(() => {
    loadData();
  }, [courseId, assignmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for testing
      setRubric({
        criteria: [
          {
            id: 1,
            name: 'Understanding of Concepts',
            description: 'Demonstrates clear understanding of key concepts and ideas',
            maxPoints: 35,
            levels: [
              { score: 35, description: 'Excellent understanding with detailed explanations' },
              { score: 25, description: 'Good understanding of most concepts' },
              { score: 15, description: 'Basic understanding with some gaps' },
              { score: 5, description: 'Limited understanding of concepts' }
            ]
          },
          {
            id: 2,
            name: 'Critical Thinking',
            description: 'Analysis, evaluation, and application of knowledge',
            maxPoints: 35,
            levels: [
              { score: 35, description: 'Exceptional analysis and creative problem-solving' },
              { score: 25, description: 'Good analytical skills and reasoning' },
              { score: 15, description: 'Some analysis but lacks depth' },
              { score: 5, description: 'Minimal analysis or critical thinking' }
            ]
          },
          {
            id: 3,
            name: 'Organization & Presentation',
            description: 'Clear structure, proper formatting, and neat presentation',
            maxPoints: 30,
            levels: [
              { score: 30, description: 'Well-organized, clear, and professional' },
              { score: 20, description: 'Generally organized with minor issues' },
              { score: 10, description: 'Somewhat disorganized but readable' },
              { score: 5, description: 'Poor organization and presentation' }
            ]
          }
        ],
        totalPoints: 100
      });

      setSubmissions([
        {
          id: 1,
          studentId: '101',
          studentName: 'John Doe',
          submissionDate: '2024-01-28',
          status: 'Submitted',
          subject: 'Mathematics',
          topic: 'Algebra - Quadratic Equations',
          attachments: ['homework.pdf', 'calculations.pdf']
        },
        {
          id: 2,
          studentId: '102',
          studentName: 'Jane Smith',
          submissionDate: '2024-01-29',
          status: 'Late Submission',
          subject: 'Mathematics',
          topic: 'Algebra - Quadratic Equations',
          attachments: ['assignment.pdf']
        },
        {
          id: 3,
          studentId: '103',
          studentName: 'Mike Johnson',
          submissionDate: '2024-01-27',
          status: 'Submitted',
          subject: 'Mathematics',
          topic: 'Algebra - Quadratic Equations',
          attachments: ['homework.pdf']
        }
      ]);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load assignment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = () => {
    if (activeTab === 0 && rubric?.criteria) {
      // Calculate from rubric
      const totalScore = rubric.criteria.reduce((sum, criterion) => {
        return sum + (rubricScores[criterion.id] || 0);
      }, 0);
      return Math.round((totalScore / rubric.totalPoints) * 100);
    }
    // Return manual grade
    return manualGrade;
  };

  const handleCriterionScoreChange = (criterionId, score) => {
    setRubricScores(prev => ({
      ...prev,
      [criterionId]: Number(score)
    }));
  };

  const handleInsertTemplate = (template) => {
    const newText = template.content.replace(
      /{studentName}/g,
      currentSubmission?.studentName || ''
    );
    setFeedback(prev => prev + (prev ? '\\n' : '') + newText);
  };

  const handleToggleFavorite = (templateId) => {
    setTemplates(prev => 
      prev.map(t => 
        t.id === templateId 
          ? { ...t, isFavorite: !t.isFavorite }
          : t
      )
    );
    setFavoriteTemplates(prev => {
      const template = templates.find(t => t.id === templateId);
      if (template?.isFavorite) {
        return prev.filter(t => t.id !== templateId);
      }
      if (template) {
        return [...prev, template];
      }
      return prev;
    });
  };

  const handleMarkedPaperUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMarkedPaper(file);
    }
  };

  const handleManualScoreChange = (questionId, score) => {
    setManualScores(prev => ({
      ...prev,
      [questionId]: Number(score)
    }));
  };

  const calculateTotalManualScore = () => {
    return Object.values(manualScores).reduce((sum, score) => sum + score, 0);
  };

  const handleSendFeedback = async () => {
    try {
      const formData = new FormData();
      formData.append('studentId', currentSubmission.studentId);
      formData.append('assignmentId', assignmentId);
      formData.append('feedback', feedback);
      formData.append('grade', calculateGrade());
      
      if (markedPaper) {
        formData.append('markedPaper', markedPaper);
      }

      if (Object.keys(manualScores).length > 0) {
        formData.append('manualScores', JSON.stringify(manualScores));
      }

      await GradingService.submitFeedback(formData);
      
      setShowPreviewDialog(false);
      setShowSendFeedback(false);
      setMarkedPaper(null);
      setManualScores({});
      
      // Update submission status
      setSubmissions(prev => 
        prev.map(s => 
          s.id === currentSubmission.id 
            ? { ...s, status: 'Graded' } 
            : s
        )
      );
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const renderSubmissionsList = () => (
    <Paper elevation={0} className="h-full bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6">
          Submissions ({submissions.length})
        </Typography>
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <Card
            key={submission.id}
            className={`cursor-pointer transition-all ${
              currentSubmission?.id === submission.id
                ? 'border-2 border-blue-500'
                : 'hover:shadow-md'
            }`}
            onClick={() => setCurrentSubmission(submission)}
          >
            <Box className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="subtitle1" className="font-medium">
                    {submission.studentName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  label={submission.status}
                  color={
                    submission.status === 'Graded'
                      ? 'success'
                      : submission.status === 'Late Submission'
                      ? 'warning'
                      : 'default'
                  }
                  size="small"
                />
              </div>
              {submission.attachments && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {submission.attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={file}
                      size="small"
                      variant="outlined"
                      className="text-xs"
                    />
                  ))}
                </div>
              )}
            </Box>
          </Card>
        ))}
      </div>
    </Paper>
  );

  const renderGradingForm = () => {
    if (!currentSubmission) {
      return (
        <Paper className="h-full flex items-center justify-center p-8">
          <div className="text-center">
            <Typography variant="h6" color="textSecondary">
              Select a submission to start grading
            </Typography>
          </div>
        </Paper>
      );
    }

    return (
      <div className="space-y-6">
        <Paper className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography variant="h5" className="font-medium">
                {currentSubmission.studentName}
              </Typography>
              <Typography variant="body1" color="textSecondary" className="mt-1">
                {currentSubmission.subject} - {currentSubmission.topic}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Submitted on {new Date(currentSubmission.submissionDate).toLocaleDateString()}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                startIcon={<Award />}
                variant="outlined"
                size="small"
                onClick={() => setShowRubricDialog(true)}
              >
                Rubric
              </Button>
              <Button
                startIcon={<BarChart2 />}
                variant="outlined"
                size="small"
                onClick={() => setShowAnalyticsDialog(true)}
              >
                Analytics
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="mb-6"
          >
            <Tab label="Rubric Grading" />
            <Tab label="Manual Grading" />
            <Tab label="Submission" />
          </Tabs>

          {activeTab === 0 && (
            <div className="space-y-6">
              {rubric.criteria.map((criterion) => (
                <Card key={criterion.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Typography variant="subtitle1" className="font-medium">
                        {criterion.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {criterion.description}
                      </Typography>
                    </div>
                    <Chip 
                      label={`${rubricScores[criterion.id] || 0} / ${criterion.maxPoints} points`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    {criterion.levels.map((level) => (
                      <div
                        key={level.score}
                        onClick={() => handleCriterionScoreChange(criterion.id, level.score)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          rubricScores[criterion.id] === level.score
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <Typography variant="body2">
                            {level.description}
                          </Typography>
                          <Typography variant="body2" color="primary" className="font-medium">
                            {level.score} points
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              
              <Card className="p-4 bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      Total Score: {calculateGrade()}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {calculateGrade() >= 90 ? 'Excellent' :
                       calculateGrade() >= 80 ? 'Very Good' :
                       calculateGrade() >= 70 ? 'Good' :
                       calculateGrade() >= 60 ? 'Fair' :
                       'Needs Improvement'}
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MessageCircle />}
                    onClick={() => setShowPreviewDialog(true)}
                  >
                    Send Feedback
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              <Card className="p-4">
                <Typography variant="subtitle1" className="mb-4">
                  Upload Marked Paper
                </Typography>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Plus />}
                  >
                    Upload Marked Paper
                    <input
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={handleMarkedPaperUpload}
                    />
                  </Button>
                  {markedPaper && (
                    <Typography variant="body2" color="textSecondary">
                      {markedPaper.name}
                    </Typography>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <Typography variant="subtitle1" className="mb-4">
                  Manual Scoring
                </Typography>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        Question 1
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 0, max: 25 } }}
                        value={manualScores[1] || ''}
                        onChange={(e) => handleManualScoreChange(1, e.target.value)}
                        label="Score (max 25)"
                      />
                    </div>
                    <div>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        Question 2
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 0, max: 25 } }}
                        value={manualScores[2] || ''}
                        onChange={(e) => handleManualScoreChange(2, e.target.value)}
                        label="Score (max 25)"
                      />
                    </div>
                    <div>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        Question 3
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 0, max: 25 } }}
                        value={manualScores[3] || ''}
                        onChange={(e) => handleManualScoreChange(3, e.target.value)}
                        label="Score (max 25)"
                      />
                    </div>
                    <div>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        Question 4
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 0, max: 25 } }}
                        value={manualScores[4] || ''}
                        onChange={(e) => handleManualScoreChange(4, e.target.value)}
                        label="Score (max 25)"
                      />
                    </div>
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <div>
                      <Typography variant="subtitle1" className="font-medium">
                        Total Score: {calculateTotalManualScore()} / 100
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {calculateTotalManualScore() >= 90 ? 'Excellent' :
                         calculateTotalManualScore() >= 80 ? 'Very Good' :
                         calculateTotalManualScore() >= 70 ? 'Good' :
                         calculateTotalManualScore() >= 60 ? 'Fair' :
                         'Needs Improvement'}
                      </Typography>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<MessageCircle />}
                      onClick={() => setShowPreviewDialog(true)}
                    >
                      Send Feedback
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 2 && (
            <Card className="p-4">
              <Typography variant="subtitle1" className="mb-4">
                Submission Files
              </Typography>
              {currentSubmission.attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file}
                  className="mr-2 mb-2"
                  variant="outlined"
                />
              ))}
            </Card>
          )}
        </Paper>

        <Paper className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">
              Feedback
            </Typography>
            <div className="flex gap-2">
              <Button
                startIcon={<BookTemplate />}
                variant="outlined"
                size="small"
                onClick={() => setShowTemplatesInDialog(true)}
              >
                Templates
              </Button>
              <Button
                startIcon={<SettingsIcon />}
                variant="outlined"
                size="small"
                onClick={() => setShowFeedbackManager(true)}
              >
                Manage Templates
              </Button>
            </div>
          </div>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            variant="outlined"
          />
        </Paper>
      </div>
    );
  };

  const renderTemplatesSidebar = () => (
    <Drawer
      anchor="right"
      open={showTemplatesSidebar}
      onClose={() => setShowTemplatesSidebar(false)}
      variant="persistent"
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100vh - 64px)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
        },
      }}
    >
      <Box className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-semibold">
            Feedback Templates
          </Typography>
          <div className="flex space-x-2">
            <IconButton 
              size="small"
              onClick={() => setShowFeedbackManager(true)}
              className="bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setShowTemplatesSidebar(false)}
              className="bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {favoriteTemplates.length > 0 && (
          <>
            <Typography variant="subtitle2" color="textSecondary" className="mb-2">
              Favorites
            </Typography>
            <div className="space-y-2 mb-4">
              {favoriteTemplates.map(template => (
                <Card
                  key={template.id}
                  className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleInsertTemplate(template)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="subtitle2" className="font-medium">
                        {template.name}
                      </Typography>
                      {template.category && (
                        <Chip
                          size="small"
                          label={template.category}
                          className="mt-1"
                        />
                      )}
                    </div>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(template.id);
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </IconButton>
                  </div>
                </Card>
              ))}
            </div>
            <Divider className="mb-4" />
          </>
        )}

        <Typography variant="subtitle2" color="textSecondary" className="mb-2">
          All Templates
        </Typography>
        <div className="space-y-2">
          {templates.map(template => (
            <Card
              key={template.id}
              className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleInsertTemplate(template)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="subtitle2" className="font-medium">
                    {template.name}
                  </Typography>
                  {template.category && (
                    <Chip
                      size="small"
                      label={template.category}
                      className="mt-1"
                    />
                  )}
                </div>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(template.id);
                  }}
                >
                  <Star 
                    className={`w-4 h-4 ${
                      template.isFavorite 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-400'
                    }`} 
                  />
                </IconButton>
              </div>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1 line-clamp-2"
              >
                {template.content}
              </Typography>
            </Card>
          ))}
        </div>
      </Box>
    </Drawer>
  );

  const renderSendFeedbackDialog = () => (
    <Dialog
      open={showSendFeedback}
      onClose={() => setShowSendFeedback(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center">
        <div>Send Feedback</div>
        <div className="flex space-x-2">
          <Button
            size="small"
            startIcon={<BookTemplate className="w-4 h-4" />}
            onClick={() => setShowTemplatesInDialog(!showTemplatesInDialog)}
            variant={showTemplatesInDialog ? "contained" : "outlined"}
            color="primary"
          >
            Templates
          </Button>
          <IconButton onClick={() => setShowSendFeedback(false)}>
            <X />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={showTemplatesInDialog ? 8 : 12}>
            <Card className="mb-4">
              <Box className="p-4">
                <Typography variant="subtitle2" className="mb-2">
                  Feedback Message
                </Typography>
                <TextField
                  multiline
                  rows={8}
                  fullWidth
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback here..."
                  variant="outlined"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Typography variant="body2" color="textSecondary">
                      Student: {currentSubmission?.studentName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Grade: {calculateGrade()}%
                    </Typography>
                  </div>
                </div>
              </Box>
            </Card>

            <Typography variant="subtitle2" className="mb-2">
              Preview
            </Typography>
            <Card>
              <Box className="p-4">
                <div className="prose max-w-none">
                  {feedback.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </Box>
            </Card>
          </Grid>

          {showTemplatesInDialog && (
            <Grid item xs={12} md={4}>
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle2" className="mb-2">
                    Suggested Templates
                  </Typography>
                  <div className="space-y-2">
                    {templates.map(template => (
                      <Card
                        key={template.id}
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-green-500"
                        onClick={() => handleInsertTemplate(template)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="subtitle2" className="font-medium">
                              {template.name}
                            </Typography>
                            {template.category && (
                              <Chip
                                size="small"
                                label={template.category}
                                className="mt-1"
                              />
                            )}
                          </div>
                          <Tooltip title="Best match for this grade">
                            <Award className="w-4 h-4 text-green-500" />
                          </Tooltip>
                        </div>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="mt-1 line-clamp-2"
                        >
                          {template.content}
                        </Typography>
                      </Card>
                    ))}
                  </div>
                </div>

                {favoriteTemplates.length > 0 && (
                  <div>
                    <Typography variant="subtitle2" className="mb-2">
                      Favorites
                    </Typography>
                    <div className="space-y-2">
                      {favoriteTemplates.map(template => (
                        <Card
                          key={template.id}
                          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleInsertTemplate(template)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Typography variant="subtitle2" className="font-medium">
                                {template.name}
                              </Typography>
                              {template.category && (
                                <Chip
                                  size="small"
                                  label={template.category}
                                  className="mt-1"
                                />
                              )}
                            </div>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(template.id);
                              }}
                            >
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </IconButton>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Typography variant="subtitle2" className="mb-2">
                    All Templates
                  </Typography>
                  <div className="space-y-2">
                    {templates.map(template => (
                      <Card
                        key={template.id}
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleInsertTemplate(template)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="subtitle2" className="font-medium">
                              {template.name}
                            </Typography>
                            {template.category && (
                              <Chip
                                size="small"
                                label={template.category}
                                className="mt-1"
                              />
                            )}
                          </div>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(template.id);
                            }}
                          >
                            <Star 
                              className={`w-4 h-4 ${
                                template.isFavorite 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </IconButton>
                        </div>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="mt-1 line-clamp-2"
                        >
                          {template.content}
                        </Typography>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  const renderPreviewDialog = () => (
    <Dialog
      open={showPreviewDialog}
      onClose={() => setShowPreviewDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6">Preview Feedback</Typography>
          <IconButton onClick={() => setShowPreviewDialog(false)} size="small">
            <X />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <Typography variant="subtitle2" color="textSecondary">
              To: {currentSubmission?.studentName}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Subject: {currentSubmission?.subject} - {currentSubmission?.topic}
            </Typography>
            
            <div className="mt-3 border-t pt-3">
              <Typography variant="subtitle1" className="font-medium">
                Marks Breakdown:
              </Typography>
              {activeTab === 0 ? (
                // Rubric grading breakdown
                <div className="mt-2 space-y-1">
                  {rubric.criteria.map(criterion => (
                    <div key={criterion.id} className="flex justify-between">
                      <Typography variant="body2" color="textSecondary">
                        {criterion.name}:
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {rubricScores[criterion.id] || 0} / {criterion.maxPoints}
                      </Typography>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <Typography variant="body2">
                      Total Score:
                    </Typography>
                    <Typography variant="body2">
                      {calculateGrade()}%
                    </Typography>
                  </div>
                </div>
              ) : (
                // Manual scoring breakdown
                <div className="mt-2 space-y-1">
                  {Object.entries(manualScores).map(([questionId, score]) => (
                    <div key={questionId} className="flex justify-between">
                      <Typography variant="body2" color="textSecondary">
                        Question {questionId}:
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {score} / 25
                      </Typography>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <Typography variant="body2">
                      Total Score:
                    </Typography>
                    <Typography variant="body2">
                      {calculateTotalManualScore()}%
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t">
              <Typography variant="subtitle2" color="textSecondary">
                Final Grade: {activeTab === 0 ? calculateGrade() : calculateTotalManualScore()}% ({
                  (activeTab === 0 ? calculateGrade() : calculateTotalManualScore()) >= 90 ? 'Excellent' :
                  (activeTab === 0 ? calculateGrade() : calculateTotalManualScore()) >= 80 ? 'Very Good' :
                  (activeTab === 0 ? calculateGrade() : calculateTotalManualScore()) >= 70 ? 'Good' :
                  (activeTab === 0 ? calculateGrade() : calculateTotalManualScore()) >= 60 ? 'Fair' :
                  'Needs Improvement'
                })
              </Typography>
            </div>

            {markedPaper && (
              <div className="mt-3 pt-3 border-t">
                <Typography variant="subtitle2" color="textSecondary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Marked Paper: {markedPaper.name}
                </Typography>
              </div>
            )}
          </div>

          <Typography variant="subtitle1" className="font-medium">
            Feedback:
          </Typography>
          <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap">
            {feedback}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outlined"
              onClick={() => setShowPreviewDialog(false)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendFeedback}
              startIcon={<MessageCircle />}
            >
              Send to Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Box className="max-w-[1600px] mx-auto">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            {renderSubmissionsList()}
          </Grid>
          <Grid item xs={12} md={9}>
            {renderGradingForm()}
          </Grid>
        </Grid>
      </Box>
      {renderTemplatesSidebar()}
      {renderSendFeedbackDialog()}
      {renderPreviewDialog()}
      
      <RubricManager
        open={showRubricDialog}
        onClose={() => setShowRubricDialog(false)}
        rubric={rubric}
        onSave={setRubric}
      />
      
      <FeedbackManager
        open={showFeedbackManager}
        onClose={() => setShowFeedbackManager(false)}
        templates={templates}
        onSave={setTemplates}
      />
    </div>
  );
};

export default AssignmentGrading;
