import './index.css';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
import InstructorForm from './components/InstructorForm';
import Login from './components/Login';
import DashboardLayout from './components/layouts/DashboardLayout';
import ZoomMeetings from './pages/instructor/ZoomMeetings';
import CreateSession from './pages/instructor/CreateSession';
import GroupManagement from './pages/instructor/GroupManagement';
import InstructorsLanding from './components/InstructorsLanding';
import CourseLearning from './pages/instructor/CourseLearning';
import Assessments from './pages/instructor/Assessments';
import CourseAnalytics from './components/dashboard/CourseAnalytics';
import CourseWizard from './components/CourseWizard/CourseWizard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import StudentCourseView from './pages/student/StudentCourseView';
import {
  CourseSettings,
  CourseContentManager,
  Courses,
  Dashboard,
  Settings,
  Schedule,
  Students
} from './pages/instructor';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/instructor/register',
    element: <InstructorForm />
  },
  {
    path: '/instructor',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'courses',
        element: <Courses />
      },
      {
        path: 'courses/:id/analytics',
        element: <CourseAnalytics />
      },
      {
        path: 'courses/new',
        element: <CourseWizard />
      },
      {
        path: 'courses/:id/learn',
        element: <CourseLearning />
      },
      {
        path: 'courses/:id/assessments',
        element: <Assessments />
      },
      {
        path: 'courses/:id/settings',
        element: <CourseSettings />
      },
      {
        path: 'courses/:id',
        element: <CourseContentManager />
      },
      {
        path: 'courses/:id/content',
        element: <CourseContentManager />
      },
      {
        path: 'zoom-meetings',
        element: <ZoomMeetings />
      },
      {
        path: 'students',
        element: <Students />
      },
      {
        path: 'schedule',
        element: <Schedule />
      },
      {
        path: 'group-management',
        element: <GroupManagement />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  },
  {
    path: '/student/courses/:id',
    element: <StudentCourseView />
  },
  {
    path: '/',
    element: <Navigate to="/instructor/dashboard" replace />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider maxSnack={3}>
        <AnimatePresence mode="wait">
          <motion.div
            className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toaster position="top-center" />
            <RouterProvider router={router} />
          </motion.div>
        </AnimatePresence>
      </SnackbarProvider>
    </LocalizationProvider>
  );
}

export default App;
