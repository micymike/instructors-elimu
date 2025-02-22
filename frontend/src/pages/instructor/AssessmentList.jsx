import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Award,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '../../config';

const AssessmentList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const [assessmentsResponse, assignmentsResponse] = await Promise.all([
          axios.get(`${API_URL}/instructor/assessments`, config),
          axios.get(`${API_URL}/assignments`, config)
        ]);

        const combinedAssessments = [
          ...assessmentsResponse.data.map(assessment => ({
            ...assessment,
            type: 'assessment'
          })),
          ...assignmentsResponse.data.map(assignment => ({
            ...assignment,
            type: 'assignment'
          }))
        ];

        setAssessments(combinedAssessments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [navigate]);

  const handleGradeItem = (item) => {
    const path = item.type === 'assessment' 
      ? `/instructor/courses/${item.courseId}/assessments/${item.id}/grade`
      : `/instructor/courses/${item.courseId}/assignments/${item.id}/grade`;
    navigate(path, { replace: true });
  };

  const filteredAssessments = assessments.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Assessments</Typography>
      </div>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search assessments..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="text-gray-400" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={4}>
        {filteredAssessments.map((assessment) => (
          <Grid item xs={12} md={6} lg={4} key={assessment.id}>
            <Card className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" className="mb-1">
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    Due: {new Date(assessment.dueDate).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    {assessment.submissionCount} submissions
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    {assessment.pendingGrading} pending
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    Avg: {assessment.averageGrade}%
                  </Typography>
                </div>
              </div>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleGradeItem(assessment)}
                disabled={assessment.pendingGrading === 0}
              >
                {assessment.pendingGrading > 0 ? 'Grade Submissions' : 'All Graded'}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AssessmentList;
