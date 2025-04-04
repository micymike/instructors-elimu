import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessment.service';
import axios from 'axios';
import {
  Card,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
} from '@mui/material';
import {
  Search,
  Award,
  Clock,
  Users,
  AlertCircle,
  Eye,
  Inbox // Changed from EmptyPlaceholder
} from 'lucide-react';
import { API_URL } from '../../config';

const AssessmentList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

  const fetchCourses = async () => {
    try {
      setCourseLoading(true);
      setCourseError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/instructor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const coursesData = response.data.courses || response.data;
      if (!coursesData || coursesData.length === 0) {
        setCourseError('No courses found. Please create a course first.');
      }
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourseError('Failed to load courses. Please try again.');
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchAssessmentDetails = async (courseId) => {
    try {
      const detailsResponse = await assessmentService.getAssessmentDetails(courseId);
      // Find the specific assessment in the course assessments
      const assessment = detailsResponse.data.find(a => a.courseId === courseId);
      if (!assessment) {
        throw new Error('Assessment not found in course');
      }
      
      const submissionsResponse = await assessmentService.getAssessmentSubmissions(assessment._id);
      setSelectedAssessment(assessment);
      setSubmissions(submissionsResponse.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching assessment details:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        let assessmentsResponse;
        
        if (selectedCourse === 'all') {
          assessmentsResponse = await assessmentService.getAllAssessments();
        } else {
          assessmentsResponse = await assessmentService.getCourseAssessments(selectedCourse);
        }
        
        const assessments = assessmentsResponse.data;

        // Fetch stats for each assessment's course
        const assessmentsWithStats = await Promise.all(
          assessments.map(async assessment => {
            try {
              const statsResponse = await assessmentService.getCourseAssessmentStats(assessment.courseId);
              const stats = statsResponse.data;
              const submissionsResponse = await assessmentService.getAssessmentSubmissions(assessment._id);
              const submissions = submissionsResponse.data;

              return {
                ...assessment,
                type: 'assessment',
                submissionCount: submissions.length,
                pendingGrading: submissions.filter(sub => !sub.isGraded).length,
                averageGrade: stats.averageScore || 0
              };
            } catch (error) {
              console.error(`Error fetching stats for assessment ${assessment._id}:`, error);
              return {
                ...assessment,
                type: 'assessment',
                submissionCount: 0,
                pendingGrading: 0,
                averageGrade: 0
              };
            }
          })
        );

        setAssessments(assessmentsWithStats);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [navigate, selectedCourse]);

  const handleGradeItem = (item) => {
    navigate(`/instructor/assessments/${item.courseId}/${item._id}/grade`);
  };

  const filteredAssessments = assessments.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Typography variant="h4" className="mb-4 md:mb-0">Assessments</Typography>
      </div>

      {courseError && (
        <Alert severity="error" className="mb-4">
          {courseError}
        </Alert>
      )}

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <FormControl variant="outlined" className="w-full md:w-[200px]">
          <InputLabel>Filter by Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            label="Filter by Course"
            disabled={courseLoading || courses.length === 0}
          >
            <MenuItem value="all">All Courses</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
          {courseLoading && (
            <CircularProgress size={20} className="absolute right-10 top-1/2 transform -translate-y-1/2" />
          )}
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search assessments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {filteredAssessments.length > 0 ? (
        <Grid container spacing={2} item md={4}>
          {filteredAssessments.map((assessment) => (
            <Grid item xs={12} sm={6} lg={4} key={assessment._id}>
              <Card className="p-3 md:p-4">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div className="mb-2 md:mb-0">
                    <Typography variant="h6" className="text-base md:text-lg mb-1">
                      {assessment.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {assessment.courseName}
                    </Typography>
                  </div>
                  <Chip
                    label={assessment.status}
                    color={assessment.status === 'Active' ? 'primary' : 'default'}
                    size="small"
                    className="self-start md:self-center"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <Typography variant="body2" noWrap>
                      Due: {new Date(assessment.dueDate).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <Typography variant="body2" noWrap>
                      {assessment.submissionCount} submissions
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <Typography variant="body2" noWrap>
                      {assessment.pendingGrading} pending
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <Typography variant="body2" noWrap>
                      Avg: {assessment.averageGrade}%
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => fetchAssessmentDetails(assessment._id)}
                    startIcon={<Eye />}
                    size="small"
                  >
                    View Details
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleGradeItem(assessment)}
                    disabled={assessment.pendingGrading === 0}
                    size="small"
                  >
                    {assessment.pendingGrading > 0 ? 'Grade' : 'All Graded'}
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} justifyContent="center" alignItems="center" item>
          <Grid item md={6} textAlign="center">
            <Inbox className="mx-auto mb-4 text-gray-400" size={64} />
            <Typography variant="h6" color="textSecondary">
              No assessments found
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              {searchQuery 
                ? "No assessments match your search criteria. Try adjusting your filters."
                : selectedCourse !== 'all'
                  ? "No assessments found for this course. Create one to get started."
                  : "No assessments found. Create your first assessment to get started."
              }
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/instructor/Assessment')}
              size="small"
            >
              Create Assessment
            </Button>
          </Grid>
        </Grid>
      )}

      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        className="p-0 sm:p-4"
      >
        <DialogTitle className="text-lg md:text-xl">
          {selectedAssessment?.title}
        </DialogTitle>
        <DialogContent className="px-4 py-2 md:p-6">
          {selectedAssessment && (
            <div className="space-y-4">
              <div>
                <Typography variant="subtitle1" color="textSecondary">Description</Typography>
                <Typography>{selectedAssessment.description}</Typography>
              </div>

              <div>
                <Typography variant="subtitle1" color="textSecondary">Type</Typography>
                <Typography>{selectedAssessment.type}</Typography>
              </div>

              <div>
                <Typography variant="subtitle1" color="textSecondary">Due Date</Typography>
                <Typography>{new Date(selectedAssessment.dueDate).toLocaleString()}</Typography>
              </div>

              <div>
                <Typography variant="subtitle1" color="textSecondary">Passing Score</Typography>
                <Typography>{selectedAssessment.passingScore}%</Typography>
              </div>

              <div>
                <Typography variant="subtitle1" color="textSecondary">Time Limit</Typography>
                <Typography>{selectedAssessment.timeLimit} minutes</Typography>
              </div>

              <div>
                <Typography variant="subtitle1" color="textSecondary">Questions ({selectedAssessment.questions?.length})</Typography>
                <div className="space-y-2">
                  {selectedAssessment.questions?.map((question, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <Typography variant="body2">
                        {index + 1}. {question.text}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Points: {question.points}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="subtitle1" color="textSecondary" className="text-sm md:text-base">
                  Recent Submissions ({submissions.length})
                </Typography>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission._id} className="p-2 bg-gray-50 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <Typography variant="body2">
                          {submission.studentName || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </Typography>
                      </div>
                      <Chip
                        label={submission.isGraded ? 'Graded' : 'Pending'}
                        color={submission.isGraded ? 'success' : 'warning'}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setDetailsOpen(false)} fullWidth size="large">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssessmentList;
