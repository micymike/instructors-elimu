import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { settingsAPI } from '../../services/api';
import {
  BarChart2, BookOpen, Video, Users, Calendar, Settings,
  LogOut, Menu, X, Layers, UserPlus, FileText,
  GraduationCap, Bell, Plus, ChevronDown
} from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await settingsAPI.getSettings();
        if (response && response.data) {
          setUser(response.data.personalInfo || response.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    fetchSettings();
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
  }, [navigate]);

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
          path: '/instructor/create-course',
          description: 'Add new course'
        }
      ]
    },
    {
      icon: Video,
      label: 'Zoom Meetings',
      path: '/instructor/zoom-meetings',
      description: 'Manage live sessions'
    },
    {
      icon: Users,
      label: 'Students',
      path: '/instructor/students',
      description: 'Student management'
    },
    {
      icon: Calendar,
      label: 'Schedule',
      path: '/instructor/schedule',
      description: 'Class timetable'
    },
    {
      icon: UserPlus,
      label: 'Group Management',
      path: '/instructor/groups',
      description: 'Manage student groups'
    },
    {
      icon: FileText,
      label: 'Content',
      path: '/instructor/content',
      description: 'Course materials'
    },
    {
      icon: GraduationCap,
      label: 'Assessments',
      path: '/instructor/assessments',
      description: 'Tests and assignments'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/instructor/settings',
      description: 'Account settings'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const isExpanded = expandedItem === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div className="group">
        <Link
          to={item.path}
          className={`
            flex items-center justify-between px-4 py-3 rounded-lg
            transition-all duration-200 group-hover:bg-blue-50/80
            ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
          `}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              setExpandedItem(isExpanded ? null : item.path);
            }
          }}
        >
          <div className="flex items-center min-w-0">
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full
                    ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{item.description}</p>
            </div>
          </div>
          {hasSubItems && (
            <ChevronDown className={`
              w-5 h-5 transition-transform duration-200
              ${isExpanded ? 'rotate-180' : ''}
            `} />
          )}
        </Link>

        {hasSubItems && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={`
                  flex items-center px-4 py-2.5 rounded-lg
                  transition-colors duration-200 text-sm
                  hover:bg-blue-50 hover:text-blue-600
                  ${location.pathname === subItem.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600'
                  }
                `}
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
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
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}
          </nav>

          {/* User Profile and Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.expertise || 'Instructor'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        {/* Header */}
        <header className="bg-white border-b py-4 px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user?.firstName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
