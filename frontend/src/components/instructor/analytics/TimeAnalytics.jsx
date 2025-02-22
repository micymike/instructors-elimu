import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  styled,
  Fade,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AvTimerIcon from '@mui/icons-material/AvTimer';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, #f8f9ff)`,
  borderRadius: '16px',
  overflow: 'visible',
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

const TimeAnalytics = () => {
  const theme = useTheme();
  
  const timeData = {
    moduleTimeSpent: [
      { module: 'Module 1', hours: 25 },
      { module: 'Module 2', hours: 30 },
      { module: 'Module 3', hours: 20 },
      { module: 'Module 4', hours: 15 },
    ],
    activityDistribution: [
      { name: 'Video Lectures', value: 40 },
      { name: 'Assignments', value: 25 },
      { name: 'Quizzes', value: 15 },
      { name: 'Discussion', value: 20 },
    ],
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  const stats = [
    { title: 'Total Watch Hours', value: '90h', icon: <AccessTimeIcon fontSize="large" /> },
    { title: 'Average Session', value: '45m', icon: <AvTimerIcon fontSize="large" /> },
    { title: 'Peak Time', value: '2PM', icon: <ScheduleIcon fontSize="large" /> },
    { title: 'Weekly Hours', value: '15h', icon: <TrendingUpIcon fontSize="large" /> },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f5f7fb', 
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AccessTimeIcon sx={{ 
          fontSize: 40, 
          mr: 2,
          color: theme.palette.primary.main,
          transform: 'translateY(-2px)'
        }} />
        Time Analytics
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
                    <CardContent sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 3,
                      position: 'relative',
                      '&:hover': {
                        '&::after': {
                          opacity: 1,
                        }
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.3,
                        transition: 'opacity 0.3s',
                      }
                    }}>
                      <Fade in={true} timeout={500}>
                        <Box sx={{ 
                          color: theme.palette.primary.main,
                          p: 1.5,
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          boxShadow: theme.shadows[1],
                        }}>
                          {stat.icon}
                        </Box>
                      </Fade>
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{ 
                            fontWeight: 700,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          sx={{ 
                            textAlign: 'left',
                            fontWeight: 500,
                          }}
                        >
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
        <Grid item container spacing={3} xs={12}>
          <Grid item xs={12} md={6}>
            <AnimatedGridItem
              component={motion.div}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <StyledPaper>
                <Typography variant="h5" sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.primary.dark,
                }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                  Time Spent per Module
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeData.moduleTimeSpent}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false}
                      stroke={theme.palette.divider}
                    />
                    <XAxis
                      dataKey="module"
                      tick={{ 
                        fill: theme.palette.text.secondary,
                        fontSize: 14 
                      }}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ 
                        fill: theme.palette.text.secondary,
                        fontSize: 14
                      }}
                      axisLine={false}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                        border: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.background.paper,
                      }}
                      formatter={(value) => [`${value} hours`, 'Duration']}
                    />
                    <Bar
                      dataKey="hours"
                      fill="url(#colorUv)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
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
                <Typography variant="h5" sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.primary.dark,
                }}>
                  <ScheduleIcon sx={{ fontSize: 28 }} />
                  Activity Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={timeData.activityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {timeData.activityDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={theme.palette.background.paper}
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                        border: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.background.paper,
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      formatter={(value) => (
                        <span style={{ 
                          color: theme.palette.text.primary,
                          fontSize: 14,
                        }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </StyledPaper>
            </AnimatedGridItem>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeAnalytics;