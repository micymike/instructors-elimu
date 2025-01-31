import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Area
} from 'recharts';
import { CircularProgress, Card, Typography, Grid, Box, Tabs, Tab, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const StudentProgressPage = () => {
  const { studentId, courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      setStudentData({
        studentInfo: {
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
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
  }, [studentId, courseId]);

  const renderProgressOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h5">{studentData.studentInfo.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {studentData.studentInfo.course}
            </Typography>
          </div>
          <Chip 
            label={`${studentData.progress.overallProgress}% Complete`}
            color="primary"
            variant="outlined"
          />
        </div>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="p-6">
            <Typography variant="h6" className="mb-4">Module Progress</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentData.progress.moduleProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="moduleName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completionPercentage" fill="#8884d8" name="Completion %" />
                <Bar dataKey="grade" fill="#82ca9d" name="Grade" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="p-6">
            <Typography variant="h6" className="mb-4">Skill Assessment</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={studentData.skillAssessment}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current Level" dataKey="currentLevel" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Target Level" dataKey="targetLevel" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderEngagementMetrics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-6">
            <Typography variant="h6" className="mb-4">Time Spent</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={studentData.engagement.timeSpent}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="minutes" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Minutes" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderAssignments = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={4}>
        {studentData.assignments.map((assignment) => (
          <Grid item xs={12} sm={6} md={4} key={assignment.id}>
            <Card className="p-4">
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className="mb-6"
      >
        <Tab label="Overview" />
        <Tab label="Engagement" />
        <Tab label="Assignments" />
      </Tabs>

      {activeTab === 0 && renderProgressOverview()}
      {activeTab === 1 && renderEngagementMetrics()}
      {activeTab === 2 && renderAssignments()}
    </div>
  );
};

export default StudentProgressPage;
