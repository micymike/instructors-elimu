import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, Outlet, useNavigate, useMatch } from 'react-router-dom';
import { settingsAPI } from '../../services/api';
import {
  BarChart2, BookOpen, Video, Users, Calendar, Settings,
  LogOut, Menu, X, Layers, UserPlus, FileText,
  GraduationCap, Bell, Plus, ClipboardCheck, TrendingUp, DollarSign, Clock, CreditCard,ChevronDown
} from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => [
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
          path: '/instructor/courses/create',
          description: 'Add new course'
        },
        {
          icon: BarChart2,
          label: 'Course Analytics',
          path: '/instructor/courses/:id/analytics',
          description: 'Detailed course metrics'
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
      icon: ClipboardCheck,
      label: 'Assessments',
      path: '/instructor/assessments',
      description: 'View and grade assessments',
      subItems: [
        {
          icon: Plus,
          label: 'Create Assessment',
          path: '/instructor/assessments',
          description: 'Create new assessment'
        },
        {
          icon: FileText,
          label: 'All Assessments',
          path: '/instructor/assessments/list',
          description: 'View all assessments'
        }
      ]
    },
    {
      icon: UserPlus,
      label: 'Collaboration',
      path: '/instructor/collaboration',
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
          label: 'Virtual Classes',
          path: '/instructor/virtual-classes',
          description: 'Manage virtual classes'
        }
      ]
    },
    {
      icon: BarChart2,
      label: 'Analytics',
      path: '/instructor/analytics',
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
      path: '/instructor/payments',
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
      label: 'Quizzes',
      path: '/instructor/Quizzes',
      description: 'Quizzes'
    },
    {
      icon: GraduationCap,
      label: 'Assessments',
      path: '/instructor/Assessment',
      description: 'Create Assessments'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/instructor/settings',
      description: 'Account settings'
    }
  ], []);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const MenuItem = ({ item }) => {
    const hasSubItems = item.subItems?.length > 0;
    const match = useMatch(hasSubItems ? `${item.path}/*` : item.path);
    const isActive = !!match;
    const isExpanded = expandedItem === item.path;

    return (
      <div className="group relative">
        <Link
          to={item.path}
          className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300
            ${isActive 
              ? 'bg-blue-50/90 text-blue-600 shadow-[inset_4px_0_0_0_rggb(59,130,246)]'
              : 'text-gray-600 hover:bg-gray-50/80 hover:text-blue-500'}
            ${hasSubItems ? 'pr-3' : ''}`}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              setExpandedItem(isExpanded ? null : item.path);
            }
            if (isMobile && !hasSubItems) setIsSidebarOpen(false);
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            <div className="truncate">
              <span className="font-medium text-sm">{item.label}</span>
              <p className="text-xs text-gray-500/90 mt-0.5 truncate">{item.description}</p>
            </div>
          </div>
          {hasSubItems && (
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </Link>

        {hasSubItems && isExpanded && (
          <div className="ml-11 mt-1.5 space-y-1.5">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors
                  ${location.pathname === subItem.path
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100/50'}`}
              >
                <subItem.icon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{subItem.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50/95">
      {/* Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-sm border-r border-gray-100
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Elimu
              </span>
            </div>
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
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
              className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-30">
          <div className="flex items-center justify-between px-6 h-16">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Debug logging */}
          {console.log('Current Location:', location.pathname)}
          {console.log('Current Location State:', location.state)}
          <Outlet context={{ location }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;