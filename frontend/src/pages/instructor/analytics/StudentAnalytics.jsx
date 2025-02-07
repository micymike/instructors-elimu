import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const StudentAnalytics = () => {
  // Sample data - replace with actual API calls
  const studentData = {
    engagementMetrics: [
      { subject: 'Attendance', A: 85, fullMark: 100 },
      { subject: 'Participation', A: 75, fullMark: 100 },
      { subject: 'Assignment Completion', A: 90, fullMark: 100 },
      { subject: 'Quiz Performance', A: 82, fullMark: 100 },
      { subject: 'Discussion Activity', A: 70, fullMark: 100 },
    ],
    performanceTrend: [
      { week: 'Week 1', score: 78 },
      { week: 'Week 2', score: 82 },
      { week: 'Week 3', score: 85 },
      { week: 'Week 4', score: 80 },
      { week: 'Week 5', score: 88 },
    ],
    topPerformers: [
      { id: 1, name: 'John Doe', avgScore: 92, completionRate: '95%' },
      { id: 2, name: 'Jane Smith', avgScore: 89, completionRate: '92%' },
      { id: 3, name: 'Mike Johnson', avgScore: 87, completionRate: '90%' },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Student Engagement Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={studentData.engagementMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Student"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentData.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Students
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Average Score</TableCell>
                    <TableCell align="right">Completion Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentData.topPerformers.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="right">{student.avgScore}</TableCell>
                      <TableCell align="right">{student.completionRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAnalytics;
