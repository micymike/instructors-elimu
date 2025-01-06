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
import Content from './pages/instructor/Content';
//import CreateCourse from './pages/instructor/CreateCourse';
import VideoManagement from './pages/instructor/VideoManagement';

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
        element: <Dashboard />,
        errorElement: <div>Error loading Dashboard page</div>
      },
      {
        path: 'courses',
        element: <Courses />,
        errorElement: <div>Error loading Courses page</div>
      },
      {
        path: 'content',
        element: <Content />,
        errorElement: <div>Error loading Content page</div>
      },
      {
        path: 'course-content',
        element: <CourseContentManager />,
        errorElement: <div>Error loading Course Content page</div>
      },
      {
        path: 'course-settings',
        element: <CourseSettings />,
        errorElement: <div>Error loading Course Settings page</div>
      },
      {
        path: 'groups',
        element: <GroupManagement />,
        errorElement: <div>Error loading Groups page</div>
      },
      {
        path: 'zoom-meetings',
        element: <ZoomMeetings />,
        errorElement: <div>Error loading Zoom Meetings page</div>
      },
      {
        path: 'course-learning',
        element: <CourseLearning />,
        errorElement: <div>Error loading Course Learning page</div>
      },
      {
        path: 'students',
        element: <Students />,
        errorElement: <div>Error loading Students page</div>
      },
      {
        path: 'settings',
        element: <Settings />,
        errorElement: <div>Error loading Settings page</div>
      },
      {
        path: 'create-course',
        element: <CourseWizard />,
        errorElement: <div>Error loading Create Course page</div>
      },
      {
        path: 'assessments',
        element: <Assessments />,
        errorElement: <div>Error loading Assessments page</div>
      },
      {
        path: 'video-management',
        element: <VideoManagement />,
        errorElement: <div>Error loading Video Management page</div>
      },
      {
        path: 'create-session',
        element: <CreateSession />,
        errorElement: <div>Error loading Create Session page</div>
      },
      {
        path: 'schedule',
        element: <Schedule />,
        errorElement: <div>Error loading Schedule page</div>
      },
      {
        path: '',
        element: <Navigate to="dashboard" replace />,
        errorElement: <div>Error loading Dashboard page</div>
      }
    ]
  },
  {
    path: '/',
    element: <InstructorsLanding />,
    errorElement: <div>Error loading Instructors Landing page</div>
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
    errorElement: <div>Error loading Privacy Policy page</div>
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />,
    errorElement: <div>Error loading Terms of Service page</div>
  },
  {
    path: '*',
    element: <Navigate to="/instructor/dashboard" replace />,
    errorElement: <div>Error loading page</div>
  }
], {
  basename: '/'
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider maxSnack={3}>
        <AnimatePresence mode="wait">
          <RouterProvider 
            router={router} 
            fallbackElement={<div>Loading...</div>}
          />
        </AnimatePresence>
        <Toaster 
          position="top-right" 
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 }
          }} 
        />
      </SnackbarProvider>
    </LocalizationProvider>
  );
}

export default App;
