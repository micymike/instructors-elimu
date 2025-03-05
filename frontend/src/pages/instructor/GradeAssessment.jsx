import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { Award, MessageCircle, Save } from 'lucide-react';
import assessmentService from '../../services/assessment.service';

const GradeAssessment = () => {
  const { assessmentId, courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [scores, setScores] = useState({});
  const [grading, setGrading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchAssessmentAndSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all assessments for the course
        const courseAssessmentsRes = await assessmentService.getCourseAssessments(courseId);
        if (!courseAssessmentsRes.data) {
          throw new Error('Failed to load course assessments');
        }

        // Find the specific assessment we want to grade
        const targetAssessment = courseAssessmentsRes.data.find(a => a._id === assessmentId);
        if (!targetAssessment) {
          throw new Error('Assessment not found in this course');
        }
        setAssessment(targetAssessment);

        // Fetch submissions for this specific assessment
        const submissionsRes = await assessmentService.getAssessmentSubmissions(assessmentId);
        
        // Check if submissions exist and is an array
        if (!submissionsRes.data || !Array.isArray(submissionsRes.data)) {
          setSubmissions([]);
          setError('No submissions found for this assessment');
          return;
        }

        // If submissions array is empty
        if (submissionsRes.data.length === 0) {
          setSubmissions([]);
          setError('No submissions available yet');
          return;
        }

        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to load assessment data'
        );
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId && courseId) {
      fetchAssessmentAndSubmissions();
    } else {
      setError('Missing assessment or course information');
    }
  }, [assessmentId, courseId]);

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + Number(score), 0);
  };

  const handleGradeSubmission = async () => {
    if (!currentSubmission) return;

    try {
      setGrading(true);
      setError(null);

      // Validate required fields
      if (Object.keys(scores).length === 0) {
        throw new Error('Please provide scores for at least one question');
      }

      const totalPoints = calculateTotalScore();

      const gradeData = {
        totalPoints,
        feedback: feedback.trim()
      };

      const response = await assessmentService.gradeSubmission(
        assessmentId,
        currentSubmission._id,
        gradeData
      );

      if (!response || !response.data) {
        throw new Error('Failed to save grades. Please try again.');
      }

      // Update the submission in the list
      setSubmissions(prev =>
        prev.map(sub =>
          sub._id === currentSubmission._id
            ? { 
                ...sub, 
                isGraded: true, 
                earnedPoints: totalPoints,
                feedback: feedback.trim()
              }
            : sub
        )
      );

      setSuccessMessage('Submission graded successfully!');
      
      // Clear current submission data after a delay
      setTimeout(() => {
        setFeedback('');
        setScores({});
        setCurrentSubmission(null);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        ? Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message
        : error.message || 'Failed to submit grade. Please try again.';
      
      setError(errorMessage);
      console.error('Error submitting grade:', error);
    } finally {
      setGrading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <Box className="max-w-[1600px] mx-auto">
        {/* Assessment Header */}
        <Paper className="mb-6 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Typography variant="h5" className="text-xl md:text-2xl mb-2">
                {assessment?.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" className="text-sm md:text-base">
                Total Points: {assessment?.totalPoints || 0} | 
                Passing Score: {assessment?.passingScore}%
              </Typography>
            </div>
            <Button
              variant="outlined"
              onClick={() => navigate('/instructor/assessments/list')}
              className="w-full sm:w-auto"
              size="small"
            >
              Back to Assessments
            </Button>
          </div>
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert 
            severity={submissions.length === 0 ? "info" : "error"} 
            className="mb-6"
            action={
              submissions.length === 0 && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate('/instructor/assessments/list')}
                >
                  Back to List
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Submissions List */}
          <Grid item xs={12} md={3}>
            <Paper className="p-4">
              <Typography variant="h6" className="text-base md:text-lg mb-4">
                Submissions ({submissions.length})
              </Typography>
              <div className="space-y-3 max-h-[50vh] md:max-h-[70vh] overflow-y-auto">
                {submissions.map((submission) => (
                  <Paper
                    key={submission._id}
                    className={`p-3 cursor-pointer transition-all ${
                      currentSubmission?._id === submission._id
                        ? 'border-2 border-blue-500'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setCurrentSubmission(submission);
                      setScores(submission.questionScores || {});
                      setFeedback(submission.feedback || '');
                    }}
                  >
                    <Typography variant="subtitle1" className="text-sm md:text-base">
                      {submission.studentName || 'Anonymous'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="text-xs md:text-sm">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </Typography>
                    <div className={`text-xs md:text-sm mt-1 ${submission.isGraded ? 'text-green-600' : 'text-orange-600'}`}>
                      {submission.isGraded ? `Graded: ${submission.score}%` : 'Not Graded'}
                    </div>
                  </Paper>
                ))}
              </div>
            </Paper>
          </Grid>

          {/* Grading Area */}
          <Grid item xs={12} md={9}>
            {currentSubmission ? (
              <Paper className="p-4 md:p-6">
                {successMessage && (
                  <Alert severity="success" className="mb-4">
                    {successMessage}
                  </Alert>
                )}
                
                <div className="mb-6">
                  <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    className="border-b"
                    variant="fullWidth"
                    sx={{
                      '& .MuiTab-root': {
                        minWidth: 'auto',
                        px: { xs: 2, sm: 3 },
                      },
                    }}
                  >
                    <Tab label="Submission" />
                    <Tab label="Grading" />
                  </Tabs>
                </div>

                {activeTab === 0 && (
                  <div className="space-y-4 md:space-y-6">
                    <Typography variant="h6" className="text-base md:text-lg">
                      Student Submission
                    </Typography>
                    {assessment?.questions?.map((question, index) => (
                      <Paper key={index} className="p-3 md:p-4">
                        <Typography variant="subtitle1" className="mb-2 text-sm md:text-base">
                          Question {index + 1}: {question.text}
                        </Typography>
                        <Typography variant="body1" className="ml-4 text-sm md:text-base">
                          Answer: {currentSubmission.answers?.[question._id] || 'No answer provided'}
                        </Typography>
                      </Paper>
                    ))}
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-4 md:space-y-6">
                    <Typography variant="h6" className="text-base md:text-lg">
                      Grade Questions
                    </Typography>
                    {assessment?.questions?.map((question, index) => (
                      <Paper key={index} className="p-3 md:p-4">
                        <Typography variant="subtitle1" className="mb-2 text-sm md:text-base">
                          Question {index + 1}: {question.text}
                        </Typography>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <TextField
                            type="number"
                            label="Score"
                            value={scores[question._id] || ''}
                            onChange={(e) => {
                              const value = Math.min(
                                Math.max(0, Number(e.target.value)),
                                question.points
                              );
                              setScores(prev => ({
                                ...prev,
                                [question._id]: value
                              }));
                            }}
                            inputProps={{
                              min: 0,
                              max: question.points
                            }}
                            helperText={`Max points: ${question.points}`}
                            size="small"
                            className="w-full sm:w-[150px]"
                          />
                        </div>
                      </Paper>
                    ))}

                    <Paper className="p-3 md:p-4">
                      <Typography variant="subtitle1" className="mb-2 text-sm md:text-base">
                        Feedback
                      </Typography>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Enter feedback for the student..."
                        size="small"
                      />
                    </Paper>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <Typography variant="h6" className="text-sm md:text-base">
                        Total Score: {calculateTotalScore()} / {assessment?.totalPoints || 0}
                        ({((calculateTotalScore() / (assessment?.totalPoints || 1)) * 100).toFixed(1)}%)
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                        onClick={handleGradeSubmission}
                        disabled={grading}
                        className="w-full sm:w-auto"
                      >
                        {grading ? 'Saving...' : 'Save Grade'}
                      </Button>
                    </div>
                  </div>
                )}
              </Paper>
            ) : (
              <Paper className="p-6 text-center">
                <Typography variant="h6" color="textSecondary" className="text-base md:text-lg">
                  Select a submission to start grading
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default GradeAssessment;