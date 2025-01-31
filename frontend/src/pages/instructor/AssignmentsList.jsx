import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AssignmentsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          courseId: 'course101',
          title: 'Final Project',
          courseName: 'Advanced Web Development',
          dueDate: '2024-02-15',
          submissionCount: 25,
          pendingGrading: 15,
          averageGrade: 88,
          status: 'Active'
        },
        {
          id: 2,
          courseId: 'course102',
          title: 'Midterm Assignment',
          courseName: 'Database Design',
          dueDate: '2024-02-10',
          submissionCount: 30,
          pendingGrading: 8,
          averageGrade: 92,
          status: 'Active'
        },
        {
          id: 3,
          courseId: 'course103',
          title: 'UI/UX Project',
          courseName: 'User Interface Design',
          dueDate: '2024-02-01',
          submissionCount: 28,
          pendingGrading: 0,
          averageGrade: 85,
          status: 'Completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGradeAssignment = (courseId, assignmentId) => {
    navigate(`/instructor/courses/${courseId}/assignments/${assignmentId}/grade`);
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Assignments</Typography>
      </div>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search assignments..."
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
        {filteredAssignments.map((assignment) => (
          <Grid item xs={12} md={6} lg={4} key={assignment.id}>
            <Card className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" className="mb-1">
                    {assignment.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {assignment.courseName}
                  </Typography>
                </div>
                <Chip
                  label={assignment.status}
                  color={assignment.status === 'Active' ? 'primary' : 'default'}
                  size="small"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    {assignment.submissionCount} submissions
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    {assignment.pendingGrading} pending
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <Typography variant="body2">
                    Avg: {assignment.averageGrade}%
                  </Typography>
                </div>
              </div>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleGradeAssignment(assignment.courseId, assignment.id)}
                disabled={assignment.pendingGrading === 0}
              >
                {assignment.pendingGrading > 0 ? 'Grade Submissions' : 'All Graded'}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AssignmentsList;
