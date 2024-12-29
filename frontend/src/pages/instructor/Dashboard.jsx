import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  const [user, setUser] = useState({
    firstName: 'Instructor',
    email: ''
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [courseStats, setCourseStats] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
        // Keep default user state
      }
    }
    // Comment out the fetchCourseStats call since we're using static data
    // fetchCourseStats();
  }, []);

  // Temporary empty function to prevent undefined error
  const fetchCourseStats = () => {
    console.log('Stats fetching is temporarily disabled');
    // We'll implement this later when the API is ready
    setCourseStats({
      totalStudents: 0,
      activeCourses: 0,
      teachingHours: 0,
      completionRate: 0,
      activeCoursesList: []
    });
  };

  // Temporary static stats for testing
  const stats = [
    {
      name: 'Total Students',
      value: '0',
      icon: Users,
      change: '+0%',
      changeType: 'positive'
    },
    {
      name: 'Active Courses',
      value: '0',
      icon: BookOpen,
      change: '+0%',
      changeType: 'positive'
    },
    {
      name: 'Teaching Hours',
      value: '0',
      icon: Clock,
      change: '+0%',
      changeType: 'positive'
    },
    {
      name: 'Completion Rate',
      value: '0%',
      icon: Award,
      change: '+0%',
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
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Course Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Course Analytics</h2>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <CourseAnalytics timeRange={selectedTimeRange} />
          </div>
          
          <RecentActivity />
        </div>

        {/* Right Column - Schedule and Active Courses */}
        <div className="space-y-6">
          <UpcomingSchedule />
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Active Courses</h2>
            <div className="space-y-3">
              {courseStats?.activeCoursesList?.map((course, index) => (
<Link
  key={index}
  to={`/instructor/courses/${course.id}/learn`}
  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
>
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-50 rounded-lg">
      <BookOpen className="h-4 w-4 text-blue-600" />
    </div>
    <div>
      <p className="font-medium text-sm">{course.title}</p>
      <p className="text-xs text-gray-500">
        {course.students} students • {course.progress}% complete
      </p>
    </div>
  </div>
  <ArrowRight className="h-4 w-4 text-gray-400" />
</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
