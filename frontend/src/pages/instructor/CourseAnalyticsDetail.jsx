import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Award, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Skeleton, 
  Chip,
  Alert,
  Button
} from '@mui/material';
import CourseService from '../../services/course.service';
import { useSnackbar } from 'notistack';

// Utility function to safely get nested object values
const safeGet = (obj, path, defaultValue = null) => {
  return path.split('.').reduce((acc, part) => 
    acc && acc[part] !== undefined ? acc[part] : defaultValue, obj);
};

const CourseAnalyticsDetail = () => {
  const { courseId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [analytics, setAnalytics] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      try {
        // Log the courseId for debugging
        console.group('Course Analytics Detail Debugging');
        console.log('Raw courseId from useParams:', courseId);
        console.log('Type of courseId:', typeof courseId);
        console.log('Is courseId truthy:', !!courseId);
        
        // Check if courseId is valid
        if (!courseId || courseId === 'undefined') {
          console.warn('Invalid course ID detected:', courseId);
          enqueueSnackbar('Invalid course ID', { variant: 'error' });
          setError('Invalid course ID');
          setLoading(false);
          
          // Redirect to the main analytics page
          navigate('/instructor/analytics/courses');
          return;
        }

        // Fetch course details and analytics
        const [courseDetailsResponse, analyticsResponse] = await Promise.all([
          CourseService.getCourseDetails(courseId),
          CourseService.getCourseAnalytics(courseId)
        ]);

        console.log('Course Details Response:', courseDetailsResponse);
        console.log('Analytics Response:', analyticsResponse);
        console.groupEnd();

        setCourseDetails(courseDetailsResponse);
        setAnalytics(analyticsResponse);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course analytics:', err);
        enqueueSnackbar('Failed to fetch course analytics', { variant: 'error' });
        setError(err);
        setLoading(false);
        
        // Redirect to the main analytics page
        navigate('/instructor/analytics/courses');
      }
    };

    fetchCourseAnalytics();
  }, [courseId, navigate, enqueueSnackbar]);

  const renderAgeGroupChart = () => {
    const ageGroups = safeGet(analytics, 'studentDemographics.ageGroups', {});
    
    if (Object.keys(ageGroups).length === 0) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="body2" color="textSecondary">
              No age group data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const ageData = Object.entries(ageGroups).map(
      ([key, value]) => ({ name: key, value: value || 0 })
    );

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <Card className="h-full">
        <CardContent>
          <Typography variant="h6" className="mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" /> Age Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderCountryDistribution = () => {
    const countries = safeGet(analytics, 'studentDemographics.countries', {});
    
    if (Object.keys(countries).length === 0) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="body2" color="textSecondary">
              No country distribution data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const countryData = Object.entries(countries)
      .map(([country, count]) => ({ name: country, count: count || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);  // Top 5 countries

    return (
      <Card className="h-full">
        <CardContent>
          <Typography variant="h6" className="mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-green-600" /> Student Countries
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/instructor/analytics/courses')}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </div>
    );
  }

  // Safely get metrics with default values
  const totalEnrollments = safeGet(analytics, 'totalEnrollments', 0);
  const completedEnrollments = safeGet(analytics, 'completedEnrollments', 0);
  const averageProgress = safeGet(analytics, 'averageProgress', 0);
  const recentEnrollments = safeGet(analytics, 'recentEnrollments', 0);
  const averageQuizScore = safeGet(analytics, 'performanceMetrics.averageQuizScore', 0);
  const completionRate = safeGet(analytics, 'performanceMetrics.completionRate', 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-6 flex items-center">
        <TrendingUp className="w-8 h-8 mr-3 text-blue-600" /> 
        {courseDetails?.title || 'Course'} Analytics
      </Typography>

      {/* Check if we have any meaningful data */}
      {totalEnrollments === 0 && completedEnrollments === 0 ? (
        <Alert 
          severity="info" 
          className="mb-6"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/instructor/analytics/courses')}>
              Retry
            </Button>
          }
        >
          No analytics data available for this course. 
          This could be because the course has no enrollments or data hasn't been processed yet.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Key Performance Metrics */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 mr-3 text-blue-600" />
                  <Typography variant="h6">Enrollment Metrics</Typography>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Typography variant="body2">Total Enrollments</Typography>
                    <Chip 
                      label={totalEnrollments} 
                      color="primary" 
                      size="small" 
                    />
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Completed Enrollments</Typography>
                    <Chip 
                      label={completedEnrollments} 
                      color="success" 
                      size="small" 
                    />
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Average Progress</Typography>
                    <Chip 
                      label={`${(averageProgress * 100).toFixed(1)}%`} 
                      color="secondary" 
                      size="small" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Award className="w-8 h-8 mr-3 text-green-600" />
                  <Typography variant="h6">Performance</Typography>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Typography variant="body2">Average Quiz Score</Typography>
                    <Chip 
                      label={`${(averageQuizScore * 100).toFixed(1)}%`} 
                      color="primary" 
                      size="small" 
                    />
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Completion Rate</Typography>
                    <Chip 
                      label={`${(completionRate * 100).toFixed(1)}%`} 
                      color="success" 
                      size="small" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Enrollments */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 mr-3 text-purple-600" />
                  <Typography variant="h6">Recent Activity</Typography>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Typography variant="body2">Recent Enrollments</Typography>
                    <Chip 
                      label={recentEnrollments} 
                      color="primary" 
                      size="small" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Demographic Charts */}
          <Grid item xs={12} md={6}>
            {renderAgeGroupChart()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderCountryDistribution()}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default CourseAnalyticsDetail;
