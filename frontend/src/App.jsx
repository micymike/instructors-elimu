import './index.css';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
import { UserProvider } from './services/UserContext';
import InstructorForm from './components/InstructorForm';
import Login from './components/Login';
import DashboardLayout from './components/layouts/DashboardLayout';
import ZoomMeetings from './pages/instructor/ZoomMeetings';
import CreateAssessment from './pages/instructor/CreateAssessment';
import GroupManagement from './pages/instructor/GroupManagement';
import InstructorsLanding from './components/InstructorsLanding';
import CourseLearning from './pages/instructor/CourseLearning';
import QuizzManager from './pages/instructor/Quizzes';
import CourseWizard from './components/CourseWizard/CourseWizard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import StudentAnalytics from './components/instructor/analytics/StudentAnalytics'
import TimeAnalytics from './components/instructor/analytics/TimeAnalytics';
import StudentCourseView from './pages/student/StudentCourseView';
import {
  CourseSettings,
  CourseContentManager,
  Courses,
  Dashboard,
  Settings,
  WebinarSchedule,
  Students
} from './pages/instructor';
import CourseAnalytics from './pages/instructor/CourseAnalytics';
import Content from './pages/instructor/Content';
import CourseForm from './components/instructor/CourseForm';
import CourseDetails from './pages/instructor/CourseDetails';
import VideoManagement from './pages/instructor/VideoManagement';
import InstructorSettings from './pages/instructor/Settings';
import EditCourse from './pages/instructor/EditCourse'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/instructorsform',
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
        path: 'analytics/:id/analytics',
        element: <CourseAnalytics />,
        errorElement: <div>Error loading Course Analytics page</div>
      },
      {
        path: '/instructor/analytics/time',
        element: <TimeAnalytics/>,
        errorElement: <div>Error loading Time Analytics page</div>
      },
      {
        path: '/instructor/analytics/students',
        element: <StudentAnalytics/>,
        errorElement: <div>Error loading Student Analytics page</div>
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
        element: <InstructorSettings/>,
        errorElement: <div>Error loading Settings page</div>
      },
      {
        path: 'create-course',
        element: <CourseWizard />,
        errorElement: <div>Error loading Create Course page</div>
      },
      {
        path: 'Quizzes',
        element: <QuizzManager/>,
        errorElement: <div>Error loading Assessments page</div>
      },
      {
        path: 'Assessment',
        element: <CreateAssessment/>,
        errorElement: <div>Error loading Assessments  Creator page</div>
        },
      {
        path: 'video-management',
        element: <VideoManagement />,
        errorElement: <div>Error loading Video Management page</div>
      },
      {
        path: 'create-session',
        element: <ZoomMeetings />,
        errorElement: <div>Error loading Create Session page</div>
      },
      {
        path: 'schedule',
        element: <WebinarSchedule />,
        errorElement: <div>Error loading Schedule page</div>
      },
      {
        path: 'courses/new',
        element: <CourseForm mode="create" />,
        errorElement: <div>Error loading Course Creation page</div>
      },
      {
        path: 'courses/:courseId',
        element: <CourseDetails />,
        errorElement: <div>Error loading Course Details page</div>
      },
      {
        path: 'courses/:courseId/edit',
        element: <EditCourse />,
        errorElement: <div>Error loading Edit Course page</div>
      },
      {
        path: '',
        element: <Dashboard />,
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
    <UserProvider>
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
    </UserProvider>
  );
}

export default App;