import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  Loader2, 
  Users, 
  Trophy, 
  BookCheck, 
  Globe, 
  CalendarDays,
  Download,
  FileCheck,
  FileX2,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const CourseAnalytics = ({ courseId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/instructor/student-analysis/course/${courseId}/analytics`, {
          headers: { Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' }
        });

        const transformed = {
          ...response.data,
          ageGroups: response.data.studentDemographics?.ageGroups 
            ? Object.entries(response.data.studentDemographics.ageGroups).map(([name, value]) => ({ name, value })) 
            : [],
          countries: response.data.studentDemographics?.countries 
            ? Object.entries(response.data.studentDemographics.countries).map(([name, value]) => ({ name, value })) 
            : [],
          completedStudents: Array.isArray(response.data.completedStudents) 
            ? response.data.completedStudents.map(student => ({
                ...student,
                hasCertificate: student.certificateGenerated
              }))
            : []
        };
        
        setAnalytics(transformed);
        
      } catch (err) {
           console.error('API Error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAnalytics();
  }, [courseId]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
              <LineChart data={analyticsData.enrollmentTrend}>
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
              <BarChart data={analyticsData.completionRates}>
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