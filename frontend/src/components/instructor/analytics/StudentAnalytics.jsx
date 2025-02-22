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
  useTheme,
  styled,
  Fade,
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
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, #f8f9ff)`,
  borderRadius: '16px',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, #f8f9ff)`,
}));

const AnimatedGridItem = motion(Grid);

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StudentAnalytics = () => {
  const theme = useTheme();

  const studentData = {
    engagementMetrics: [
      { subject: 'Attendance', A: 85, fullMark: 100 },
      { subject: 'Participation', A: 75, fullMark: 100 },
      { subject: 'Assignments', A: 90, fullMark: 100 },
      { subject: 'Quizzes', A: 82, fullMark: 100 },
      { subject: 'Discussions', A: 70, fullMark: 100 },
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

  const stats = [
    { title: 'Total Students', value: '1,234', icon: <SchoolIcon fontSize="large" /> },
    { title: 'Avg. Score', value: '84.5%', icon: <StarBorderIcon fontSize="large" /> },
    { title: 'Completion Rate', value: '89%', icon: <TrendingUpIcon fontSize="large" /> },
    { title: 'Top Score', value: '98%', icon: <EmojiEventsIcon fontSize="large" /> },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fb', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 700,
          color: theme.palette.primary.dark,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
        Student Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3} component={motion.div} initial="hidden" animate="visible">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <AnimatedGridItem
                  component={motion.div}
                  variants={chartVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledCard>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                      <Fade in={true} timeout={500}>
                        <Box sx={{ color: theme.palette.primary.main }}>
                          {stat.icon}
                        </Box>
                      </Fade>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {stat.title}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </AnimatedGridItem>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={6}>
          <AnimatedGridItem
            component={motion.div}
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
          >
            <StyledPaper>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Engagement Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={studentData.engagementMetrics}>
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke={theme.palette.divider} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: theme.palette.text.primary }}
                  />
                  <PolarRadiusAxis axisLine={false} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke={theme.palette.primary.main}
                    fill="url(#radarFill)"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </StyledPaper>
          </AnimatedGridItem>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedGridItem
            component={motion.div}
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledPaper>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Performance Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentData.performanceTrend}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.secondary.main, r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </StyledPaper>
          </AnimatedGridItem>
        </Grid>

        {/* Top Performers Table */}
        <Grid item xs={12}>
          <AnimatedGridItem
            component={motion.div}
            variants={chartVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StyledPaper>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Top Performing Students
              </Typography>
              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}>
                        <Box display="flex" alignItems="center">
                          <EmojiEventsIcon sx={{ mr: 1 }} />
                          Name
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          bgcolor: theme.palette.primary.main, 
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Average Score
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          bgcolor: theme.palette.primary.main, 
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Completion Rate
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentData.topPerformers.map((student, index) => (
                      <TableRow
                        key={student.id}
                        hover
                        component={motion.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        sx={{
                          '&:nth-of-type(odd)': { 
                            backgroundColor: theme.palette.action.hover 
                          },
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {student.name}
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <StarBorderIcon color="secondary" sx={{ mr: 1 }} />
                            {student.avgScore}%
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                            {student.completionRate}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledPaper>
          </AnimatedGridItem>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAnalytics;