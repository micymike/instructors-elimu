import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  Filter, 
  Loader2, 
  GraduationCap, 
  TrendingUp, 
  UserX, 
  Book, 
  Users 
} from 'lucide-react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  LinearProgress, 
  Box 
} from '@mui/material';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';
axios.defaults.baseURL = BASE_URL;

const Students = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentProgress, setStudentProgress] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const navigate = useNavigate();

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token 
      ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/courses/instructor', {
        headers: getHeaders()
      });
      
      // Handle different response formats like Courses.jsx
      let fetchedCourses = [];
      if (Array.isArray(response.data)) {
        fetchedCourses = response.data;
      } else if (response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedCourses = response.data.data;
      }
      
      setCourses(fetchedCourses);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Failed to fetch courses');
      setError(err);
      setLoading(false);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/courses/${courseId}/students`, {
        headers: getHeaders()
      });

      const fetchedStudents = response.data.students || [];
      setStudents(fetchedStudents);
      
      // Fetch progress for each student
      const progressPromises = fetchedStudents.map(student => 
        fetchStudentProgress(courseId, student._id)
      );
      
      const progressResults = await Promise.all(progressPromises);
      
      const progressMap = progressResults.reduce((acc, progress, index) => {
        acc[fetchedStudents[index]._id] = progress;
        return acc;
      }, {});
      
      setStudentProgress(progressMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to fetch students');
      setError(err);
      setLoading(false);
    }
  };

  const fetchStudentProgress = async (courseId, studentId) => {
    try {
      const response = await axios.get(`/courses/${courseId}/students/${studentId}/progress`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (err) {
      console.error(`Error fetching progress for student ${studentId}:`, err);
      return { 
        completedModules: 0, 
        totalModules: 0, 
        progressPercentage: 0 
      };
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchStudents(course._id);
  };

  const renderProgressBar = (studentId) => {
    const progress = studentProgress[studentId];
    if (!progress) return null;

    return (
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress.progressPercentage || 0} 
        />
        <Typography variant="body2" color="text.secondary">
          {`${progress.completedModules || 0} / ${progress.totalModules || 0} Modules`}
        </Typography>
      </Box>
    );
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6">Students</Typography>
      
      {/* Course Selection */}
      <div className="mb-6">
        <Typography variant="h6">Select a Course</Typography>
        <div className="flex flex-wrap gap-4">
          {courses.map(course => (
            <Button 
              key={course._id}
              variant={selectedCourse?._id === course._id ? 'contained' : 'outlined'}
              onClick={() => handleCourseSelect(course)}
            >
              {course.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      {selectedCourse && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map(student => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {renderProgressBar(student._id)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {/* Add detailed view logic */}}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Students;