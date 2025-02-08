import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CourseAnalytics = ({ 
  coursePerformance = [], 
  monthlyRevenue = [],
  courseRevenue = []
}) => {
  // Format data for student progress chart
  const studentProgressData = monthlyRevenue.map(month => ({
    name: month.month,
    revenue: month.amount,
    target: month.target || month.amount * 1.1 // If no target, set 10% above actual
  }));

  // Format data for assessment performance
  const assessmentData = coursePerformance.map(course => ({
    name: course.name,
    engagement: course.engagement || 0,
    completion: course.completion || 0,
    satisfaction: course.satisfaction || 0
  }));

  // Calculate engagement distribution
  const calculateEngagement = () => {
    const total = coursePerformance.length;
    if (total === 0) return [];

    const highEngagement = coursePerformance.filter(c => (c.engagement || 0) > 75).length;
    const mediumEngagement = coursePerformance.filter(c => (c.engagement || 0) > 50 && (c.engagement || 0) <= 75).length;
    const lowEngagement = total - highEngagement - mediumEngagement;

    return [
      { name: 'High', value: (highEngagement / total) * 100 },
      { name: 'Medium', value: (mediumEngagement / total) * 100 },
      { name: 'Low', value: (lowEngagement / total) * 100 }
    ];
  };

  const engagementData = calculateEngagement();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Course Analytics</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value="month"
                label="Time Period"
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Revenue Progress
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Actual Revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Revenue"
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Course Engagement Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name} ${value.toFixed(0)}%`
                  }
                >
                  {engagementData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Course Performance Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar 
                  dataKey="engagement" 
                  name="Engagement Rate"
                  fill="#82ca9d" 
                />
                <Bar 
                  dataKey="completion" 
                  name="Completion Rate"
                  fill="#8884d8" 
                />
                <Bar 
                  dataKey="satisfaction" 
                  name="Satisfaction Rate"
                  fill="#ff7f7f" 
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseAnalytics;
