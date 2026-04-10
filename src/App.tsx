import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ReportList from './pages/ReportList';
import CreateReport from './pages/CreateReport';
import UserManagement from './pages/UserManagement';
import Summary from './pages/Summary';

// Placeholder components for routes
const StudentData = () => <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">Data Siswa.</div>;

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="reports" element={
              <ProtectedRoute roles={['admin', 'guru']}>
                <ReportList />
              </ProtectedRoute>
            } />
            <Route path="reports/create" element={
              <ProtectedRoute roles={['siswa']}>
                <CreateReport />
              </ProtectedRoute>
            } />
            <Route path="reports/history" element={
              <ProtectedRoute roles={['siswa']}>
                <ReportList />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute roles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="students" element={
              <ProtectedRoute roles={['admin']}>
                <StudentData />
              </ProtectedRoute>
            } />
            <Route path="summary" element={
              <ProtectedRoute roles={['admin', 'guru']}>
                <Summary />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
