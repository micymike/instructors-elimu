import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart2, BookOpen, Video, Users, Calendar, Settings,
  LogOut, Menu, X, Layers, UserPlus, FileText,
  GraduationCap, Bell, Plus, ChevronDown, ClipboardCheck,
  Award, TrendingUp, Clock, DollarSign, CreditCard
} from 'lucide-react';
import AIAssistantChat from '../AIAssistantChat';

import { API_URL } from '../../config';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user: authUser, loading, logout } = useAuth();
  const [instructorData, setInstructorData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        if (!authUser) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          logout();
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Fetch dashboard and statistics directly
        const [dashboardResponse, statisticsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/instructors/profile/dashboard`, config),
          axios.get(`${API_URL}/api/instructors/profile/dashboard-statistics`, config)
        ]);

        const instructorDetails = {
          ...dashboardResponse.data,
          statistics: statisticsResponse.data
        };

        setInstructorData(instructorDetails);
      } catch (error) {
        console.error('Error fetching instructor data:', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchInstructorData();
    
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, authUser, logout]);

  const menuItems = [
    {
      icon: BarChart2,
      label: 'Dashboard',
      path: '/instructor/dashboard',
      description: 'Overview and analytics'
    },
    {
      icon: BookOpen,
      label: 'Courses',
      path: '/instructor/courses',
      description: 'Manage your courses',
      subItems: [
        {
          icon: Layers,
          label: 'All Courses',
          path: '/instructor/courses',
          description: 'View all courses'
        },
        {
          icon: Plus,
          label: 'Create Course',
          path: '/instructor/courses/new',
          description: 'Add new course'
        },
        {
          icon: FileText,
          label: 'Course Content',
          path: '/instructor/courses/content',
          description: 'Manage course materials'
        }
      ]
    },
    {
      icon: Users,
      label: 'Students',
      description: 'Student management',
      subItems: [
        {
          icon: Users,
          label: 'All Students',
          path: '/instructor/students',
          description: 'View all students'
        },
        {
          icon: TrendingUp,
          label: 'Progress Tracking',
          path: '/instructor/students/progress',
          description: 'Track student progress'
        },
        {
          icon: ClipboardCheck,
          label: 'Assignments',
          path: '/instructor/students/assignments',
          description: 'View and grade assignments'
        }
      ]
    },
    {
      icon: UserPlus,
      label: 'Collaboration',
      description: 'Group projects & collaboration',
      subItems: [
        {
          icon: Users,
          label: 'Group Projects',
          path: '/instructor/collaboration/projects',
          description: 'Manage group projects'
        },
        {
          icon: Video,
          label: 'Live Sessions',
          path: '/instructor/collaboration/sessions',
          description: 'Virtual classroom sessions'
        },
        {
          icon: Video,
          label: 'Zoom Classes',
          path: '/instructor/zoom-meetings',
          description: 'Manage Zoom classes'
        }
      ]
    },
    {
      icon: BarChart2,
      label: 'Analytics',
      description: 'Course and student analytics',
      subItems: [
        {
          icon: TrendingUp,
          label: 'Course Analytics',
          path: '/instructor/analytics/courses',
          description: 'Course performance metrics'
        },
        {
          icon: Users,
          label: 'Student Analytics',
          path: '/instructor/analytics/students',
          description: 'Student engagement metrics'
        },
        {
          icon: Clock,
          label: 'Time Analytics',
          path: '/instructor/analytics/time',
          description: 'Time spent metrics'
        }
      ]
    },
    {
      icon: DollarSign,
      label: 'Payments',
      description: 'Revenue and payments',
      subItems: [
        {
          icon: TrendingUp,
          label: 'Revenue Dashboard',
          path: '/instructor/payments/dashboard',
          description: 'Revenue overview'
        },
        {
          icon: CreditCard,
          label: 'Withdrawals',
          path: '/instructor/payments/withdrawals',
          description: 'Manage withdrawals'
        },
        {
          icon: FileText,
          label: 'Payment History',
          path: '/instructor/payments/history',
          description: 'Transaction history'
        }
      ]
    },
    {
      icon: Calendar,
      label: 'Schedule',
      path: '/instructor/schedule',
      description: 'Class timetable'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/instructor/settings',
      description: 'Account settings'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const MenuItem = ({ item, index }) => {
    const isActive = location.pathname === item.path;
    const isExpanded = expandedItem === item.label;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div key={item.path || `menu-item-${index}`}>
        <Link
          to={item.path}
          className={`flex items-center justify-between rounded-lg transition-all duration-200 group-hover:bg-blue-50/80 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              setExpandedItem(isExpanded ? null : item.label);
            }
          }}
        >
          <div className="flex items-center min-w-0">
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{item.description}</p>
            </div>
          </div>
          {hasSubItems && (
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </Link>

        {hasSubItems && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems.map((subItem, subIndex) => (
              <Link
                key={subItem.path || `sub-item-${index}-${subIndex}`}
                to={subItem.path}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm hover:bg-blue-50 hover:text-blue-600 ${location.pathname === subItem.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <subItem.icon className="h-4 w-4 mr-2" />
                <span>{subItem.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!loading && !authUser) {
      navigate('/login');
    }
  }, [authUser, loading, navigate]);

  if (loading || !authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Layers className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Elimu
              </span>
            </div>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <MenuItem key={item.path || `menu-item-${index}`} item={item} index={index} />
            ))}
          </nav>

          {/* User Profile and Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              {instructorData?.profilePicture ? (
                <img
                  src={instructorData.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">
                    {instructorData?.firstName?.[0]}{instructorData?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {instructorData?.firstName} {instructorData?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {instructorData?.expertise || 'Instructor'}
                </p>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b py-4 px-6">
          <div className="flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              {instructorData?.profilePicture ? (
                <img
                  src={instructorData.profilePicture}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {instructorData?.firstName?.[0]}{instructorData?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <AIAssistantChat />
      </div>
    </div>
  );
};

export default DashboardLayout;
