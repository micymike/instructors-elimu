import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  Chip, 
  Avatar 
} from '@mui/material';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  FileText, 
  CheckCircle 
} from 'lucide-react';
import { instructorAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await instructorAPI.getDashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-6">
        Welcome, {user?.name || 'Instructor'}
      </Typography>

      <Grid container spacing={3}>
        {/* Course Overview */}
        <Grid item xs={12} md={4}>
          <Card className="h-full">
            <CardContent>
              <div className="flex items-center mb-4">
                <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
                <Typography variant="h6">Course Overview</Typography>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography variant="body2">Total Courses</Typography>
                  <Chip 
                    label={dashboardData?.totalCourses || 0} 
                    color="primary" 
                    size="small" 
                  />
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Active Courses</Typography>
                  <Chip 
                    label={dashboardData?.activeCourses || 0} 
                    color="success" 
                    size="small" 
                  />
                </div>
                <Link to="/instructor/courses">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small" 
                    className="mt-2"
                  >
                    View All Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Metrics */}
        <Grid item xs={12} md={4}>
          <Card className="h-full">
            <CardContent>
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 mr-3 text-green-600" />
                <Typography variant="h6">Student Metrics</Typography>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography variant="body2">Total Students</Typography>
                  <Chip 
                    label={dashboardData?.totalStudents || 0} 
                    color="primary" 
                    size="small" 
                  />
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">New Enrollments</Typography>
                  <Chip 
                    label={dashboardData?.newEnrollments || 0} 
                    color="secondary" 
                    size="small" 
                  />
                </div>
                <Link to="/instructor/students">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small" 
                    className="mt-2"
                  >
                    Manage Students
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Insights */}
        <Grid item xs={12} md={4}>
          <Card className="h-full">
            <CardContent>
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 mr-3 text-purple-600" />
                <Typography variant="h6">Performance</Typography>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography variant="body2">Average Quiz Score</Typography>
                  <Chip 
                    label={`${(dashboardData?.averageQuizScore || 0) * 100}%`} 
                    color="primary" 
                    size="small" 
                  />
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Course Completion Rate</Typography>
                  <Chip 
                    label={`${(dashboardData?.courseCompletionRate || 0) * 100}%`} 
                    color="success" 
                    size="small" 
                  />
                </div>
                <Link to="/instructor/analytics/students">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small" 
                    className="mt-2"
                  >
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assessments */}
        <Grid item xs={12} md={6}>
          <Card className="h-full">
            <CardContent>
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 mr-3 text-orange-600" />
                <Typography variant="h6">Recent Assessments</Typography>
              </div>
              {dashboardData?.recentAssessments?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentAssessments.slice(0, 3).map((assessment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                    >
                      <div>
                        <Typography variant="body2" className="font-semibold">
                          {assessment.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true })}
                        </Typography>
                      </div>
                      <Chip 
                        label={assessment.status} 
                        color={assessment.status === 'Graded' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary" className="text-center">
                  No recent assessments
                </Typography>
              )}
              <Link to="/instructor/assessments/list" className="block mt-4">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  fullWidth
                >
                  View All Assessments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid item xs={12} md={6}>
          <Card className="h-full">
            <CardContent>
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 mr-3 text-teal-600" />
                <Typography variant="h6">Upcoming Sessions</Typography>
              </div>
              {dashboardData?.upcomingSessions?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.upcomingSessions.slice(0, 3).map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                    >
                      <div>
                        <Typography variant="body2" className="font-semibold">
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                        </Typography>
                      </div>
                      <Avatar 
                        alt="Session" 
                        src={session.coverImage} 
                        sx={{ width: 40, height: 40 }} 
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary" className="text-center">
                  No upcoming sessions
                </Typography>
              )}
              <Link to="/instructor/virtual-classes" className="block mt-4">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  fullWidth
                >
                  View All Sessions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;