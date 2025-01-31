import './index.css';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/instructor/dashboard" replace />
  },
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
        errorElement: <div>Error loading Dashboard</div>
      },
      {
        path: 'courses',
        element: <Courses />,
        errorElement: <div>Error loading Courses page</div>
      },
      {
        path: 'students',
        element: <Students />,
        errorElement: <div>Error loading Students page</div>
      },
      {
        path: 'students/:studentId/progress/:courseId',
        element: <StudentProgressPage />,
        errorElement: <div>Error loading Student Progress page</div>
      },
      {
        path: 'assignments/grade',
        element: <AssignmentsList />,
        errorElement: <div>Error loading Assignments List</div>
      },
      {
        path: 'courses/:courseId/assignments/:assignmentId/grade',
        element: <AssignmentGrading />,
        errorElement: <div>Error loading Assignment Grading page</div>
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
        path: 'groups',
        element: <GroupManagement />,
        errorElement: <div>Error loading Group Management page</div>
      },
      {
        path: 'content',
        element: <Content />,
        errorElement: <div>Error loading Content page</div>
      },
      {
        path: 'assessments',
        element: <Assessments />,
        errorElement: <div>Error loading Assessments page</div>
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
    element: <Navigate to="/instructor/dashboard" replace />
  }
]);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </SnackbarProvider>
    </LocalizationProvider>
  );
}

export default App;
