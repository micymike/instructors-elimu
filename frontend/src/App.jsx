import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import AppRoutes from './router';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { UserProvider } from './services/UserContext';
import InstructorForm from './components/InstructorForm';
import Login from './components/Login';
import DashboardLayout from './components/layouts/DashboardLayout';
import VirtualClasses from './pages/instructor/VirtualClasses';
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
import Content from './pages/instructor/Content';
import CourseForm from './components/instructor/CourseForm';
import CourseDetails from './pages/instructor/CourseDetails';
import VideoManagement from './pages/instructor/VideoManagement';
import InstructorSettings from './pages/instructor/Settings';
import EditCourse from './pages/instructor/EditCourse'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AssessmentList from './pages/instructor/AssessmentList';
import GradeAssessment from './pages/instructor/GradeAssessment';
import CourseAnalytics from "./pages/instructor/CourseAnalytics";
import CourseAnalyticsDetail from "./pages/instructor/CourseAnalyticsDetail";
import PaymentsDashboard from "./pages/instructor/payments/PaymentsDashboard";
import Withdrawals from "./pages/instructor/payments/Withdrawals";
import PaymentHistory from "./pages/instructor/payments/PaymentHistory";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider maxSnack={3}>
            <AnimatePresence mode="wait">
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
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
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;