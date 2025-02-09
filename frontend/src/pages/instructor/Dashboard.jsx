import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  BookOpen,
  Award,
  Plus,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import CourseAnalytics from '../../components/dashboard/CourseAnalytics.jsx';
import UpcomingSchedule from '../../components/dashboard/UpcomingSchedule';
import RecentActivity from '../../components/dashboard/RecentActivity';
import StatCard from '../../components/dashboard/StatCard';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: 'Instructor',
    email: '',
    instructorStatus: ''
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    currentBalance: 0,
    monthlyRevenue: [],
    courseRevenue: [],
    coursePerformance: [],
    activeStudents: 0,
    recentActivity: [],
    upcomingSchedule: []
  });
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get personalized time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    let greeting = 'Good';

    if (hour < 12) {
      greeting += ' Morning';
    } else if (hour < 17) {
      greeting += ' Afternoon';
    } else {
      greeting += ' Evening';
    }

    return greeting;
  };

  // Establish socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('instructor_stats_update', (updatedStats) => {
      setStats(prevStats => ({
        ...prevStats,
        ...updatedStats
      }));
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to real-time updates');
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Single hook to handle authentication and data fetching
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    // Update user state with localStorage data
    setUser({
      firstName: storedUser.name?.trim() || 'Instructor',
      email: storedUser.email || '',
      instructorStatus: storedUser.instructorStatus || 'Active'
    });

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch both dashboard and statistics concurrently
      const [dashboardResponse, statisticsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/instructors/profile/dashboard`, axiosConfig),
        axios.get(`${API_BASE_URL}/api/instructors/profile/dashboard-statistics`, axiosConfig)
      ]);

      const dashboardData = dashboardResponse.data;
      const statisticsData = statisticsResponse.data;

      // Prioritize API data, fallback to localStorage
      setUser({
        firstName: dashboardData.name?.trim() || storedUser.name?.trim() || 'Instructor',
        email: dashboardData.email || storedUser.email || '',
        instructorStatus: dashboardData.instructorStatus || storedUser.instructorStatus || 'Active'
      });

      setStats({
        totalCourses: statisticsData.totalCourses || 0,
        totalStudents: statisticsData.totalStudents || 0,
        totalRevenue: statisticsData.totalRevenue || 0,
        currentBalance: statisticsData.currentBalance || 0,
        monthlyRevenue: statisticsData.monthlyRevenue || [],
        courseRevenue: statisticsData.courseRevenue || [],
        coursePerformance: statisticsData.coursePerformance || [],
        activeStudents: statisticsData.activeStudents || 0,
        recentActivity: dashboardData.recentActivity || [],
        upcomingSchedule: dashboardData.upcomingSchedule || []
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard');
      setIsLoading(false);

      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: Award,
      change: stats.monthlyRevenue[stats.monthlyRevenue.length - 1]?.change || '+0%',
      changeType: 'positive'
    },
    {
      name: 'Current Balance',
      value: `$${stats.currentBalance.toLocaleString()}`,
      icon: Award,
      change: `${((stats.currentBalance / stats.totalRevenue) * 100).toFixed(1)}%`,
      changeType: 'neutral'
    },
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      change: `${((stats.activeStudents / stats.totalStudents) * 100).toFixed(1)}% active`,
      changeType: 'positive'
    },
    {
      name: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      change: `${stats.coursePerformance.length} performing well`,
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Create Course',
      icon: Plus,
      path: '/instructor/create-course',
      description: 'Start a new learning journey',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      title: 'Schedule Session',
      icon: Calendar,
      path: '/instructor/create-session',
      description: 'Plan your next class',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      title: 'View Analytics',
      icon: ChevronRight,
      path: '/instructor/analytics',
      description: 'Track your progress',
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section with Enhanced Personalization */}
      <div className="flex flex-col justify-between items-start mb-8">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center flex-wrap">
            {getTimeBasedGreeting()},
            <span className="ml-2 text-blue-600">{user?.firstName || 'Instructor'}</span>
            <span className="ml-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {user?.instructorStatus || 'Active'}
            </span>
          </h1>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {user?.email ? `Your email: ${user.email}` : 'Instructor Dashboard'}
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Course Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <CourseAnalytics 
                coursePerformance={stats.coursePerformance}
                monthlyRevenue={stats.monthlyRevenue}
                courseRevenue={stats.courseRevenue}
              />
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <RecentActivity activities={stats.recentActivity} />
              </div>
            </div>

            {/* Right Column - Upcoming Schedule */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
                <UpcomingSchedule sessions={stats.upcomingSchedule} />
              </div>

              {/* Monthly Revenue */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
                <div className="space-y-4">
                  {stats.monthlyRevenue.map((month, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{month.month}</span>
                      <span className="font-medium">${month.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Revenue */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Course Revenue</h2>
                <div className="space-y-4">
                  {stats.courseRevenue.map((course, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{course.name}</span>
                      <span className="font-medium">${course.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
