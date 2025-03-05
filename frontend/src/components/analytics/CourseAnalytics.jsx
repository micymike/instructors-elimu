import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const CourseAnalytics = () => {
  // Sample data - replace with actual API calls
  const courseData = {
    enrollmentTrend: [
      { month: 'Jan', students: 45 },
      { month: 'Feb', students: 52 },
      { month: 'Mar', students: 61 },
      { month: 'Apr', students: 58 },
      { month: 'May', students: 65 },
    ],
    completionRates: [
      { module: 'Module 1', completed: 85 },
      { module: 'Module 2', completed: 72 },
      { module: 'Module 3', completed: 68 },
      { module: 'Module 4', completed: 55 },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Course Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enrollment Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={courseData.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Module Completion Rates
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseData.completionRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="module" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseAnalytics;