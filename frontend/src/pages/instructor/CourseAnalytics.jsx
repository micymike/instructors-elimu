import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { TrendingUp } from 'lucide-react';
import CourseService from '../../services/course.service';

const CourseAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await CourseService.getAllCourses();
        const coursesData = response.courses;
        
        console.group('Course Analytics Debugging');
        console.log('Raw Courses Response:', response);
        console.log('Courses Data:', coursesData);
        console.log('Courses Count:', coursesData.length);
        
        // Log details of each course
        coursesData.forEach((course, index) => {
          console.log(`Course ${index + 1}:`, {
            id: course.id,
            title: course.title,
            fullObject: course
          });
        });
        console.groupEnd();
        
        // Fetch analytics for each course
        const coursesWithAnalytics = await Promise.all(
          coursesData.map(async (course) => {
            try {
              // Use _id instead of id
              const courseId = course._id;

              // Ensure courseId is a valid string before fetching analytics
              if (!courseId) {
                console.warn('Skipping course with undefined ID:', course);
                return {
                  ...course,
                  analytics: {
                    totalEnrollments: 0,
                    completedEnrollments: 0,
                    averageProgress: 0,
                    recentEnrollments: 0,
                    completionRate: 0,
                    averageQuizScore: 0,
                    studentDemographics: {
                      ageGroups: {},
                      countries: {}
                    }
                  }
                };
              }

              const analytics = await CourseService.getCourseAnalytics(courseId);
              return {
                ...course,
                id: courseId, // Add id for consistency
                analytics: {
                  totalEnrollments: analytics.totalEnrollments,
                  completedEnrollments: analytics.completedEnrollments,
                  averageProgress: analytics.averageProgress,
                  recentEnrollments: analytics.recentEnrollments,
                  completionRate: analytics.completionRate,
                  averageQuizScore: analytics.averageQuizScore,
                  studentDemographics: analytics.studentDemographics
                }
              };
            } catch (analyticsError) {
              console.warn(`Could not fetch analytics for course ${course._id}:`, analyticsError);
              return {
                ...course,
                id: course._id, // Add id for consistency
                analytics: {
                  totalEnrollments: 0,
                  completedEnrollments: 0,
                  averageProgress: 0,
                  recentEnrollments: 0,
                  completionRate: 0,
                  averageQuizScore: 0,
                  studentDemographics: {
                    ageGroups: {},
                    countries: {}
                  }
                }
              };
            }
          })
        );

        setCourses(coursesWithAnalytics);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error fetching courses:', fetchError);
        setError(fetchError);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Render method to generate safe course links
  const generateCourseAnalyticsLink = (course) => {
    // Ensure course._id is a non-empty string before generating link
    const courseId = course._id || course.id;
    
    if (!courseId || typeof courseId !== 'string') {
      console.warn('Attempted to generate link with invalid course:', course);
      return '#';
    }
    return `/instructor/analytics/courses/${courseId}`;
  };

  const handleViewAnalytics = (course) => {
    navigate(generateCourseAnalyticsLink(course));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <Typography variant="h6" color="error">
          Failed to load courses
        </Typography>
        <Typography variant="body2">
          {error.message || 'An unexpected error occurred'}
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
        <Typography variant="h4">Course Analytics Overview</Typography>
      </div>
      
      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center">
            <Typography variant="h6" color="textSecondary">
              No courses found
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              Create a course to start tracking analytics
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              className="mt-4"
              onClick={() => navigate('/instructor/create-course')}
            >
              Create Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Total Enrollments</TableCell>
                        <TableCell>Completion Rate</TableCell>
                        <TableCell>Avg. Quiz Score</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.analytics.totalEnrollments}</TableCell>
                          <TableCell>
                            {(course.analytics.completionRate * 100).toFixed(2)}%
                          </TableCell>
                          <TableCell>
                            {(course.analytics.averageQuizScore * 100).toFixed(2)}%
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              size="small"
                              onClick={() => handleViewAnalytics(course)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default CourseAnalytics;
