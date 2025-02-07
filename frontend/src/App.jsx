import './index.css';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
import React, { Suspense } from 'react';
import InstructorForm from './components/InstructorForm';
import Login from './components/Login';
import DashboardLayout from './components/layouts/DashboardLayout';
import {
  CourseSettings,
  CourseContentManager,
  Courses,
  Dashboard,
  Settings,
  Schedule,
  Students,
  StudentProgressPage,
  AssignmentGrading,
  AssignmentsList,
  CreateCourse,
  Assessments,
  VideoManagement,
  Content,
  GroupManagement,
  ZoomMeetings
} from './pages/instructor';

// Lazy load new components
const CourseAnalytics = React.lazy(() => import('./pages/instructor/analytics/CourseAnalytics.jsx'));
const StudentAnalytics = React.lazy(() => import('./pages/instructor/analytics/StudentAnalytics.jsx'));
const TimeAnalytics = React.lazy(() => import('./pages/instructor/analytics/TimeAnalytics.jsx'));
const PaymentsDashboard = React.lazy(() => import('./pages/instructor/payments/PaymentsDashboard.jsx'));
const Withdrawals = React.lazy(() => import('./pages/instructor/payments/Withdrawals.jsx'));
const PaymentHistory = React.lazy(() => import('./pages/instructor/payments/PaymentHistory.jsx'));
const GroupProjects = React.lazy(() => import('./pages/instructor/collaboration/GroupProjects.jsx'));
const LiveSessions = React.lazy(() => import('./pages/instructor/collaboration/LiveSessions.jsx'));

import { AuthProvider } from './contexts/AuthContext';

const AppWrapper = ({ children }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper><Navigate to="/instructor/dashboard" replace /></AppWrapper>
  },
  {
    path: '/login',
    element: <AppWrapper><Login /></AppWrapper>
  },
  {
    path: '/instructor/register',
    element: <AppWrapper><InstructorForm /></AppWrapper>
  },
  {
    path: '/instructor',
    element: <AppWrapper><DashboardLayout /></AppWrapper>,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        errorElement: <div>Error loading Dashboard</div>
      },
      {
        path: 'courses',
        element: <Courses />,
        errorElement: <div>Error loading Courses page</div>
      },
      {
        path: 'create-course',
        element: <CreateCourse />,
        errorElement: <div>Error loading Create Course page</div>
      },
      {
        path: 'courses/content',
        element: <CourseContentManager />,
        errorElement: <div>Error loading Course Content page</div>
      },
      {
        path: 'students',
        element: <Students />,
        errorElement: <div>Error loading Students page</div>
      },
      {
        path: 'students/progress',
        element: <StudentProgressPage />,
        errorElement: <div>Error loading Student Progress page</div>
      },
      {
        path: 'students/progress/:studentId',
        element: <StudentProgressPage />,
        errorElement: <div>Error loading Student Progress page</div>
      },
      {
        path: 'students/assignments',
        element: <AssignmentsList />,
        errorElement: <div>Error loading Assignments page</div>
      },
      {
        path: 'courses/:courseId/assignments/:assignmentId/grade',
        element: <AssignmentGrading />,
        errorElement: <div>Error loading Assignment Grading page</div>
      },
      {
        path: 'collaboration/projects',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GroupProjects />
          </Suspense>
        ),
        errorElement: <div>Error loading Group Projects page</div>
      },
      {
        path: 'collaboration/sessions',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LiveSessions />
          </Suspense>
        ),
        errorElement: <div>Error loading Live Sessions page</div>
      },
      {
        path: 'analytics/courses',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CourseAnalytics />
          </Suspense>
        ),
        errorElement: <div>Error loading Course Analytics page</div>
      },
      {
        path: 'analytics/students',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <StudentAnalytics />
          </Suspense>
        ),
        errorElement: <div>Error loading Student Analytics page</div>
      },
      {
        path: 'analytics/time',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <TimeAnalytics />
          </Suspense>
        ),
        errorElement: <div>Error loading Time Analytics page</div>
      },
      {
        path: 'payments/dashboard',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PaymentsDashboard />
          </Suspense>
        ),
        errorElement: <div>Error loading Payments Dashboard page</div>
      },
      {
        path: 'payments/withdrawals',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Withdrawals />
          </Suspense>
        ),
        errorElement: <div>Error loading Withdrawals page</div>
      },
      {
        path: 'payments/history',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PaymentHistory />
          </Suspense>
        ),
        errorElement: <div>Error loading Payment History page</div>
      },
      {
        path: 'schedule',
        element: <Schedule />,
        errorElement: <div>Error loading Schedule page</div>
      },
      {
        path: 'settings',
        element: <Settings />,
        errorElement: <div>Error loading Settings page</div>
      },
      {
        path: 'zoom-meetings',
        element: <ZoomMeetings />,
        errorElement: <div>Error loading Zoom Meetings page</div>
      },
      {
        path: '',
        element: <Navigate to="dashboard" replace />,
        errorElement: <div>Error loading Dashboard page</div>
      }
    ]
  },
  {
    path: '*',
    element: <AppWrapper><Navigate to="/instructor/dashboard" replace /></AppWrapper>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
