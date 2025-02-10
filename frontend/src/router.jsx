import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './components/layouts/DashboardLayout';

// Lazy load components
const Dashboard = React.lazy(() => import('./pages/instructor/Dashboard'));
const CoursesList = React.lazy(() => import('./pages/instructor/CoursesList'));
const CreateCourse = React.lazy(() => import('./pages/instructor/CreateCourse'));
const CourseContent = React.lazy(() => import('./pages/instructor/CourseContent'));
const StudentsList = React.lazy(() => import('./pages/instructor/Students'));
const StudentProgress = React.lazy(() => import('./pages/instructor/StudentProgressPage'));
const StudentAssignments = React.lazy(() => import('./pages/instructor/StudentAssignments'));
const GroupProjects = React.lazy(() => import('./pages/instructor/collaboration/GroupProjects'));
const LiveSessions = React.lazy(() => import('./pages/instructor/collaboration/LiveSessions'));
const CourseAnalytics = React.lazy(() => import('./pages/instructor/analytics/CourseAnalytics'));
const StudentAnalytics = React.lazy(() => import('./pages/instructor/analytics/StudentAnalytics'));
const TimeAnalytics = React.lazy(() => import('./pages/instructor/analytics/TimeAnalytics'));
const PaymentsDashboard = React.lazy(() => import('./pages/instructor/payments/PaymentsDashboard'));
const Withdrawals = React.lazy(() => import('./pages/instructor/payments/Withdrawals'));
const PaymentHistory = React.lazy(() => import('./pages/instructor/payments/PaymentHistory'));
const Schedule = React.lazy(() => import('./pages/instructor/Schedule'));
const Settings = React.lazy(() => import('./pages/instructor/Settings'));

const router = createBrowserRouter([
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
        element: <CoursesList />
      },
      {
        path: 'create-course',
        element: <CreateCourse />
      },
      {
        path: 'courses/content',
        element: <CourseContent />
      },
      {
        path: 'students',
        element: <StudentsList />
      },
      {
        path: 'students/progress',
        element: <StudentProgress />
      },
      {
        path: 'students/assignments',
        element: <StudentAssignments />
      },
      {
        path: 'collaboration/projects',
        element: <GroupProjects />
      },
      {
        path: 'collaboration/sessions',
        element: <LiveSessions />
      },
      {
        path: 'analytics/courses',
        element: <CourseAnalytics />
      },
      {
        path: 'analytics/students',
        element: <StudentAnalytics />
      },
      {
        path: 'analytics/time',
        element: <TimeAnalytics />
      },
      {
        path: 'payments/dashboard',
        element: <PaymentsDashboard />
      },
      {
        path: 'payments/withdrawals',
        element: <Withdrawals />
      },
      {
        path: 'payments/history',
        element: <PaymentHistory />
      },
      {
        path: 'schedule',
        element: <Schedule />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]);

export default router;
