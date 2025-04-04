"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  BarChart2,
  BookOpen,
  Video,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Layers,
  UserPlus,
  FileText,
  Bell,
  Plus,
  ChevronDown,
  ClipboardCheck,
  TrendingUp,
  Clock,
  DollarSign,
  CreditCard,
} from "lucide-react"
import AIAssistantChat from "../AIAssistantChat"
import { motion, AnimatePresence } from "framer-motion"

import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://centralize-auth-elimu.onrender.com';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { user: authUser, loading, logout } = useAuth()
  const [instructorData, setInstructorData] = useState(null)
  const [expandedItem, setExpandedItem] = useState(null)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        if (!authUser) {
          navigate("/login")
          return
        }

        const token = localStorage.getItem("token")
        if (!token) {
          logout()
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }

        // Fetch dashboard and statistics directly
        const [dashboardResponse, statisticsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/instructors/profile/dashboard`, config),
          axios.get(`${API_URL}/api/instructors/profile/dashboard-statistics`, config),
        ])

        const instructorDetails = {
          ...dashboardResponse.data,
          statistics: statisticsResponse.data,
        }

        setInstructorData(instructorDetails)
      } catch (error) {
        console.error("Error fetching instructor data:", error)
        if (error.response?.status === 401) {
          logout()
        }
      }
    }

    fetchInstructorData()

    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024
      setIsMobile(isMobileView)
      setIsSidebarOpen(!isMobileView)
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [navigate, authUser, logout])

  useEffect(() => {
    console.group('DashboardLayout Navigation Debug');
    console.log('Current Location:', location.pathname);
    console.log('Current User:', authUser);
    console.log('Expanded Item:', expandedItem);
    console.groupEnd();
  }, [location.pathname, authUser, expandedItem]);

  useEffect(() => {
    console.error("CURRENT LOCATION CHANGED", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
    })
  }, [location])

  useEffect(() => {
    const fetchUnreadNotificationsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/instructors/notifications/unread-count`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUnreadNotificationsCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch unread notifications count:', error);
      }
    };

    if (authUser) {
      fetchUnreadNotificationsCount();
    }
  }, [authUser]);

  const menuItems = [
    {
      icon: BarChart2,
      label: "Dashboard",
      path: "/dashboard",
      description: "Overview and analytics",
    },
    {
      icon: BookOpen,
      label: "Courses",
      path: "/instructor/courses",
      description: "Manage your courses",
      subItems: [
        {
          icon: Layers,
          label: "All Courses",
          path: "/instructor/courses",
          description: "View all courses",
        },
        {
          icon: Plus,
          label: "Create Course",
          path: "/instructor/courses/new",
          description: "Add new course",
        },
      ],
    },
    {
      icon: Users,
      label: "Students",
      path: "/instructor/students",
      description: "Student management",
    },
    {
      icon: ClipboardCheck,
      label: "Assessments",
      path: "/instructor/Assessment",
      description: "View and grade assessments",
      subItems: [
        {
          icon: Plus,
          label: "Create Assessment",
          path: "/instructor/Assessment",
          description: "Create new assessment",
        },
        {
          icon: FileText,
          label: "View Assessments",
          path: "/instructor/assessments/list",
          description: "View all assessments",
        },
      ],
    },
    {
      icon: UserPlus,
      label: "Collaboration",
      path: "/instructor/groups",
      description: "Group projects & collaboration",
      subItems: [
        {
          icon: Users,
          label: "Group Projects",
          path: "/instructor/groups",
          description: "Manage group projects",
        },
        {
          icon: Video,
          label: "Virtual Classes",
          path: "/instructor/virtual-classes",
          description: "Manage Virtual classes",
        },
      ],
    },
    {
      icon: BarChart2,
      label: "Analytics",
      path: "/instructor/analytics",
      description: "Course and student analytics",
      subItems: [
        {
          icon: TrendingUp,
          label: "Course Analytics",
          path: "/instructor/analytics/courses",
          description: "Course performance metrics",
        },
      ]
    },
    {
      icon: DollarSign,
      label: "Payments",
      path: "/instructor/payments",
      description: "Revenue and payments",
      subItems: [
        {
          icon: TrendingUp,
          label: "Revenue Dashboard",
          path: "/instructor/payments/dashboard",
          description: "Revenue overview",
        },
        {
          icon: CreditCard,
          label: "Withdrawals",
          path: "/instructor/payments/withdrawals",
          description: "Manage withdrawals",
        },
        {
          icon: FileText,
          label: "Payment History",
          path: "/instructor/payments/history",
          description: "Transaction history",
        },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/instructor/settings",
      description: "Account settings",
    },
  ]

  const handleLogout = () => {
    logout()
  }

  const handleNotificationClick = () => {
    navigate('/instructor/notifications');
  }

  const MenuItem = ({ item, index }) => {
    const isActive = location.pathname === item.path
    const isExpanded = expandedItem === item.label
    const hasSubItems = item.subItems && item.subItems.length > 0

    return (
      <motion.div
        key={item.path || `menu-item-${index}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div
          className={`flex items-center justify-between rounded-lg transition-all duration-200 group-hover:bg-blue-700 ${
            isActive ? "bg-blue-700" : "text-white"
          } cursor-pointer p-2`}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              setExpandedItem(isExpanded ? null : item.label);
            } else if (item.onClick) {
              item.onClick(navigate);
            } else {
              navigate(item.path);
            }
          }}
        >
          <div className="flex items-center min-w-0">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            </motion.div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.label}</span>
              </div>
              <p className="text-xs text-blue-200 truncate">{item.description}</p>
            </div>
          </div>
          {hasSubItems && (
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {hasSubItems && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-8 mt-1 space-y-1"
            >
              {item.subItems.map((subItem) => (
                <motion.div
                  key={subItem.path}
                  className="cursor-pointer hover:bg-blue-700 p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (subItem.onClick) {
                      subItem.onClick(navigate);
                    } else {
                      navigate(subItem.path);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <subItem.icon className="mr-2 w-4 h-4" />
                    <span className="flex-1">{subItem.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  useEffect(() => {
    if (!loading && !authUser) {
      navigate("/login")
    }
  }, [authUser, loading, navigate])

  if (loading || !authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white border-r lg:static`}
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Layers className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Elimu</span>
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
          <div className="p-4 border-t border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              {instructorData?.profilePicture ? (
                <img
                  src={instructorData.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center">
                  <span className="text-blue-800 font-medium text-lg">
                    {instructorData?.firstName?.[0]}
                    {instructorData?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {instructorData?.firstName} {instructorData?.lastName}
                </p>
                <p className="text-xs text-blue-200 truncate">{instructorData?.expertise || "Instructor"}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b py-4 px-6"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button onClick={handleNotificationClick} className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadNotificationsCount}</span>
                )}
              </button>
              {instructorData?.profilePicture ? (
                <img
                  src={instructorData.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {instructorData?.firstName?.[0]}
                    {instructorData?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-auto p-6"
        >
          <Outlet context={{ location }} />
        </motion.main>
        <AIAssistantChat />
      </div>
    </div>
  )
}

export default DashboardLayout
