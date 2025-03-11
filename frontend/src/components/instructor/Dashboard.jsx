import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Clock,
  Award,
  Plus,
  Calendar,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import CourseAnalytics from '../../components/dashboard/CourseAnalytics.jsx';
import UpcomingSchedule from '../../components/dashboard/UpcomingSchedule';
import RecentActivity from '../../components/dashboard/RecentActivity';
import StatCard from '../../components/dashboard/StatCard';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: 'Instructor',
    email: ''
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    teachingHours: 0,
    recentActivity: [],
    upcomingSchedule: []
  });
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

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
    });

    setSocket(newSocket);

    // Cleanup socket on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    fetchUserSettings();
    fetchCourseStats();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        setUser(response.data.data.personalInfo || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const fetchCourseStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/instructors/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const statsData = response.data.data;
      setStats({
        totalCourses: statsData.totalCourses || 0,
        activeCourses: statsData.activeCourses || 0,
        totalStudents: statsData.totalStudents || 0,
        teachingHours: statsData.teachingHours || 0,
        recentActivity: statsData.recentActivity || [],
        upcomingSchedule: statsData.upcomingSchedule || []
      });
    } catch (error) {
      console.error('Error fetching course stats:', error);
      // Handle error gracefully
      setStats({
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
        teachingHours: 0,
        recentActivity: [],
        upcomingSchedule: []
      });
    }
  };

  // Stat cards with dynamic values
  const statCards = [
    {
      name: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      change: `+${Math.round((stats.totalCourses / (stats.totalCourses || 1)) * 100)}%`,
      changeType: 'positive'
    },
    {
      name: 'Active Courses',
      value: stats.activeCourses,
      icon: BookOpen,
      change: `+${Math.round((stats.activeCourses / (stats.totalCourses || 1)) * 100)}%`,
      changeType: 'positive'
    },
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      change: `+${Math.round((stats.totalStudents / (stats.totalCourses * 10 || 1)) * 100)}%`,
      changeType: 'positive'
    },
    {
      name: 'Teaching Hours',
      value: stats.teachingHours,
      icon: Clock,
      change: `+${Math.round((stats.teachingHours / (stats.totalCourses * 10 || 1)) * 100)}%`,
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Create Course',
      icon: Plus,
      path: '/instructor/courses/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Schedule',
      icon: Calendar,
      path: '/instructor/create-session',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      icon: ChevronRight,
      path: '/instructor/analytics',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Instructor'}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Here's what's happening with your courses today
          </p>
        </div>
        <div className="flex gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-1.5 rounded-lg ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

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
          <CourseAnalytics />
          
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;