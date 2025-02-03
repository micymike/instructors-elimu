import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  PieChart,
  Pie
} from 'recharts';
import {
  CircularProgress,
  Card,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';

const StudentProgressPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call to fetch students list
    setTimeout(() => {
      setStudents([
        { id: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
        { id: '2', name: 'Michael Brown', email: 'michael.b@example.com' },
        { id: '3', name: 'Emma Davis', email: 'emma.d@example.com' },
        { id: '4', name: 'James Wilson', email: 'james.w@example.com' },
        { id: '5', name: 'Olivia Taylor', email: 'olivia.t@example.com' }
      ]);
      setLoading(false);
      
      // If studentId is provided in URL, select that student
      if (studentId) {
        setSelectedStudent(studentId);
      }
    }, 1000);
  }, [studentId]);

  useEffect(() => {
    if (selectedStudent) {
      // Only update URL if it's different from current studentId
      if (studentId !== selectedStudent) {
        navigate(`/instructor/students/progress/${selectedStudent}`);
      }
      // Simulate API call with dummy data for the selected student
      setLoading(true);
      setTimeout(() => {
        setStudentData({
          studentInfo: {
            name: students.find(s => s.id === selectedStudent)?.name || "Unknown Student",
            email: students.find(s => s.id === selectedStudent)?.email || "unknown@example.com",
            enrollmentDate: "2024-01-15",
            course: "Advanced Web Development"
          },
          progress: {
            overallProgress: 68,
            moduleProgress: [
              { moduleName: "HTML & CSS", completionPercentage: 100, grade: 95 },
              { moduleName: "JavaScript", completionPercentage: 85, grade: 88 },
              { moduleName: "React Basics", completionPercentage: 75, grade: 82 },
              { moduleName: "State Management", completionPercentage: 60, grade: 78 },
              { moduleName: "Backend Integration", completionPercentage: 40, grade: 85 },
              { moduleName: "Testing", completionPercentage: 20, grade: 90 }
            ]
          },
          engagement: {
            timeSpent: [
              { date: "2024-01-15", minutes: 120, type: "Video Lectures" },
              { date: "2024-01-16", minutes: 90, type: "Exercises" },
              { date: "2024-01-17", minutes: 150, type: "Project Work" },
              { date: "2024-01-18", minutes: 80, type: "Video Lectures" },
              { date: "2024-01-19", minutes: 200, type: "Project Work" },
              { date: "2024-01-20", minutes: 160, type: "Exercises" },
              { date: "2024-01-21", minutes: 140, type: "Video Lectures" }
            ],
            activityBreakdown: [
              { activity: "Video Lectures", percentage: 35 },
              { activity: "Exercises", percentage: 25 },
              { activity: "Project Work", percentage: 30 },
              { activity: "Discussion", percentage: 10 }
            ]
          },
          skillAssessment: [
            { skill: "Problem Solving", currentLevel: 85, targetLevel: 90 },
            { skill: "Code Quality", currentLevel: 78, targetLevel: 85 },
            { skill: "Testing", currentLevel: 65, targetLevel: 80 },
            { skill: "UI Design", currentLevel: 88, targetLevel: 90 },
            { skill: "API Integration", currentLevel: 72, targetLevel: 85 }
          ],
          assignments: [
            {
              id: 1,
              title: "Portfolio Website",
              status: "Completed",
              grade: 92,
              dueDate: "2024-01-10",
              submissionDate: "2024-01-09"
            },
            {
              id: 2,
              title: "State Management Implementation",
              status: "In Progress",
              dueDate: "2024-02-05"
            },
            {
              id: 3,
              title: "API Integration Project",
              status: "Not Started",
              dueDate: "2024-02-15"
            },
            {
              id: 4,
              title: "Testing Assignment",
              status: "Completed",
              grade: 88,
              dueDate: "2024-01-20",
              submissionDate: "2024-01-19"
            }
          ]
        });
        setLoading(false);
      }, 1000);
    }
  }, [selectedStudent, students, studentId, navigate]);

  const handleStudentChange = (event) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
  };

  const renderProgressOverview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Module Progress Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Module Progress
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={studentData.progress.moduleProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="moduleName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completionPercentage" name="Completion %" fill="#8884d8" />
                  <Bar dataKey="grade" name="Grade" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Skill Assessment Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Skill Assessment
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RadarChart data={studentData.skillAssessment}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current Level" dataKey="currentLevel" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Target Level" dataKey="targetLevel" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderEngagementMetrics = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Time Spent Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Time Spent
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={studentData.engagement.timeSpent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="minutes" name="Minutes" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Activity Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Activity Breakdown
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={studentData.engagement.activityBreakdown}
                    dataKey="percentage"
                    nameKey="activity"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderAssignments = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {studentData.assignments.map((assignment) => (
          <Grid item xs={12} sm={6} md={4} key={assignment.id}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h6" className="mb-2">{assignment.title}</Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">Status:</Typography>
                  <Chip
                    label={assignment.status}
                    color={
                      assignment.status === "Completed" ? "success" :
                      assignment.status === "In Progress" ? "warning" : "default"
                    }
                    size="small"
                  />
                </div>
                {assignment.grade && (
                  <div className="flex justify-between">
                    <Typography variant="body2" color="textSecondary">Grade:</Typography>
                    <Typography variant="body2">{assignment.grade}%</Typography>
                  </div>
                )}
                <div className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">Due:</Typography>
                  <Typography variant="body2">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  if (loading && !studentData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Student Progress Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Select a student to view their detailed progress and performance metrics
        </Typography>
        
        <Box sx={{ mt: 3, maxWidth: 400 }}>
          <FormControl fullWidth>
            <InputLabel>Select Student</InputLabel>
            <Select
              value={selectedStudent}
              label="Select Student"
              onChange={handleStudentChange}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name} - {student.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {selectedStudent && studentData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5">
                      {studentData.studentInfo.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {studentData.studentInfo.course}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${studentData.progress.overallProgress}% Complete`}
                    color="primary"
                    sx={{ fontSize: '1rem', py: 2, px: 1 }}
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="fullWidth"
                >
                  <Tab label="Overview" />
                  <Tab label="Engagement" />
                  <Tab label="Assignments" />
                </Tabs>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {activeTab === 0 && renderProgressOverview()}
              {activeTab === 1 && renderEngagementMetrics()}
              {activeTab === 2 && renderAssignments()}
            </Grid>
          </Grid>
        </motion.div>
      ) : !loading && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please select a student to view their progress
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StudentProgressPage;
