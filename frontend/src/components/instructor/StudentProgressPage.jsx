import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  CircularProgress, Card, Typography, Grid, Box, 
  Button, Alert, Container, Avatar, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { User, Filter } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const StudentProgressPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const navigate = useNavigate();

  // Get authentication headers
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token 
      ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };
  };

  // Fetch instructor's courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses/instructor`, {
        headers: getHeaders()
      });
      
      // Log API response
      console.log('Courses API Response:', response.data);
      
      // Ensure courses is an array
      const fetchedCourses = Array.isArray(response.data) ? response.data : [];
      setCourses(fetchedCourses);
      
      // Auto-select first course if available
      if (fetchedCourses.length > 0) {
        setSelectedCourse(fetchedCourses[0].id);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch courses';
      toast.error(errorMessage);
      console.error('Courses fetch error:', error);
      setCourses([]);
    }
  };

  // Fetch students for selected course
  const fetchStudents = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/instructor/courses/${selectedCourse}/students`, {
        headers: getHeaders(),
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      });

      // Log API response
      console.log('Students API Response:', response.data);

      setStudents(response.data.students || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      toast.error(errorMessage);
      console.error('Students fetch error:', error);
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student progress
  const fetchStudentProgress = async (studentId) => {
    if (!selectedCourse || !studentId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/instructor/courses/${selectedCourse}/students/${studentId}`, {
        headers: getHeaders()
      });

      // Log API response
      console.log('Student Progress API Response:', response.data);

      setStudentProgress(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch student progress';
      toast.error(errorMessage);
      console.error('Student progress fetch error:', error);
      setStudentProgress(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch students when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [selectedCourse, pagination.page]);

  // Handle course selection
  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    setSelectedStudent(null);
    setStudentProgress(null);
  };

  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentProgress(student.id);
  };

  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Render when no courses are available
  if (courses.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
        <User className="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <Typography variant="h4" gutterBottom>
          No Courses Found
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          You haven't created any courses yet. 
          Start by creating a course to track student progress.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/instructor/create-course')}
        >
          Create First Course
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Course Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourse || ''}
              label="Select Course"
              onChange={handleCourseChange}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Student List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', overflow: 'auto', maxHeight: 400 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Students</Typography>
              {students.map((student) => (
                <Box 
                  key={student.id}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1, 
                    cursor: 'pointer',
                    bgcolor: selectedStudent?.id === student.id ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleStudentSelect(student)}
                >
                  <Avatar 
                    src={student.profilePhoto || '/default-avatar.png'} 
                    alt={student.name} 
                    sx={{ mr: 2, width: 40, height: 40 }} 
                  />
                  <Typography variant="body2">{student.name}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Student Progress Details */}
      {selectedStudent && studentProgress && (
        <Grid container spacing={3}>
          {/* Basic Student Info */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={selectedStudent.profilePhoto || '/default-avatar.png'} 
                sx={{ width: 80, height: 80, mr: 3 }} 
              />
              <Box>
                <Typography variant="h5">{selectedStudent.name}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {selectedStudent.email}
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Progress Overview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Course Progress
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={studentProgress.overallProgress || 0} 
                  size={200} 
                  thickness={10} 
                />
                <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant="h4" component="div" color="text.secondary">
                    {`${Math.round(studentProgress.overallProgress || 0)}%`}
                  </Typography>
                  <Typography variant="caption" component="div" color="text.secondary">
                    Overall Progress
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Module Progress */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Module Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentProgress.moduleProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="moduleName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completionPercentage" fill="#8884d8" name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Pagination */}
      {students.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </Typography>
          <Button 
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default StudentProgressPage;
