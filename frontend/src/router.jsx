import React, { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layouts/DashboardLayout';
import LoadingScreen from './components/common/LoadingScreen';
import Login from './components/Login';
import InstructorForm from './components/InstructorForm';
import InstructorsLanding from './components/InstructorsLanding';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/instructor/Dashboard'));
const CoursesList = lazy(() => import('./components/instructor/CoursesList'));
const CreateCourse = lazy(() => import('./pages/instructor/CreateCourse'));
const CourseContent = lazy(() => import('./pages/instructor/CourseContentManager'));
const StudentsList = lazy(() => import('./pages/instructor/Students'));
const GroupProjects = lazy(() => import('./pages/instructor/collaboration/GroupProjects'));
const CourseAnalytics = lazy(() => import('./pages/instructor/CourseAnalytics'));
const CourseAnalyticsDetail = lazy(() => import('./pages/instructor/CourseAnalyticsDetail'));
const PaymentsDashboard = lazy(() => import('./pages/instructor/payments/PaymentsDashboard'));
const Withdrawals = lazy(() => import('./pages/instructor/payments/Withdrawals'));
const PaymentHistory = lazy(() => import('./pages/instructor/payments/PaymentHistory'));
const Settings = lazy(() => import('./pages/instructor/Settings'));
const Notifications = lazy(() => import('./pages/instructor/Notifications'));
const VirtualClasses = lazy(() => import('./pages/instructor/VirtualClasses'));
const GroupManagement = lazy(() => import('./pages/instructor/GroupManagement'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<InstructorsLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/instructorsform" element={<InstructorForm />} />
        
        {/* Instructor Routes */}
        <Route path="instructor" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="collaboration/projects" element={<GroupProjects />} />
          <Route path="analytics/courses" element={<CourseAnalytics />} />
          <Route path="analytics/courses/:courseId" element={<CourseAnalyticsDetail />} />
          <Route path="payments/dashboard" element={<PaymentsDashboard />} />
          <Route path="payments/withdrawals" element={<Withdrawals />} />
          <Route path="payments/history" element={<PaymentHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="virtual-classes" element={<VirtualClasses />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
