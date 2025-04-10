import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Layouts
import DashboardLayout from './src/components/layout/DashboardLayout';

// Auth Components
import Login from './src/components/auth/Login';
import Register from './src/components/auth/Register';
import VerifyOTP from './src/components/auth/VerifyOTP';

// Dashboard Components
import HODDashboard from './src/components/dashboard/HODDashboard';
import ProfessorDashboard from './src/components/dashboard/ProfessorDashboard';

// Class Components
import ClassList from './src/components/classes/ClassList';
import ClassForm from './src/components/classes/ClassForm';
import ClassDetails from './src/components/classes/ClassDetails';

// Professor Components
import ProfessorList from './src/components/professors/ProfessorList';
import ProfessorForm from './src/components/professors/ProfessorForm';
import ProfessorDetails from './src/components/professors/ProfessorDetails';

// Student Components
import StudentList from './src/components/students/StudentList';
import StudentUpload from './src/components/students/StudentUpload';
import StudentDetails from './src/components/students/StudentDetails';

// Common Components
import ProtectedRoute from './src/components/common/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </Router>
    </AuthProvider>
  );
};

// Separate component to use the auth context
const AppContent = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      
      {/* Dashboard Routes - Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            {userRole === 'hod' ? <HODDashboard /> : <ProfessorDashboard />}
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Classes Routes */}
      <Route path="/classes" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ClassList />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/classes/new" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ClassForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/classes/:id" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ClassDetails />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/classes/:id/edit" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ClassForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Professor Routes - HOD Only */}
      <Route path="/professors" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <DashboardLayout>
            <ProfessorList />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/professors/new" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <DashboardLayout>
            <ProfessorForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/professors/:id" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <DashboardLayout>
            <ProfessorDetails />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/professors/:id/edit" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <DashboardLayout>
            <ProfessorForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      <Route path="/students" element={
        <ProtectedRoute>
          <DashboardLayout>
            <StudentList />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/upload" element={
        <ProtectedRoute>
          <DashboardLayout>
            <StudentUpload />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/:id" element={
        <ProtectedRoute>
          <DashboardLayout>
            <StudentDetails />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
      
      {/* Catch all - redirect to login or dashboard */}
      <Route path="*" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
    </Routes>
  );
};

export default App;
