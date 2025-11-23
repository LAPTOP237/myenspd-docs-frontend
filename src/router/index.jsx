import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate 
} from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages Auth
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Pages Dashboard Étudiant / Staff
import HomePage from '../pages/dashboard/HomePage';
import DocumentsPage from '../pages/dashboard/DocumentsPage';
import RequestPage from '../pages/dashboard/RequestPage';
import ProfilePage from '../pages/dashboard/ProfilePage';

// Pages Dashboard Admin
import AdminHomePage from '../pages/admin/AdminHomePage';
import UsersPage from '../pages/admin/UsersPage';
import RequestsPage from '../pages/admin/RequestsPage';
import TemplatesPage from '../pages/admin/TemplatesPage';

// ============== PROTECTED ROUTE ==============
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Vérifier le rôle
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    // Rediriger vers tableau de bord par défaut selon rôle
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />;
      case 'STAFF':
        return <Navigate to="/dashboard" replace />; // ou /dashboard/staff si créé
      case 'STUDENT':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// ============== PUBLIC ROUTE ==============
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Rediriger selon rôle
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />;
      case 'STAFF':
        return <Navigate to="/dashboard" replace />;
      case 'STUDENT':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// ============== ROUTER CONFIGURATION ==============
const router = createBrowserRouter([
  // ===== Routes publiques =====
  {
    path: '/',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // ===== Routes Dashboard =====
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'STAFF']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'request', element: <RequestPage /> },
      { path: 'profile', element: <ProfilePage /> },
       // { path: 'settings', element: <SettingsPage /> },
    ],
  },

  {
  path: '/dashboard/admin',
  element: (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminHomePage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'requests', element: <RequestsPage /> },
    { path: 'templates', element: <TemplatesPage /> },
    { path: 'profile', element: <ProfilePage /> },
    // { path: 'settings', element: <SettingsPage /> },
  ],
},


  // ===== Route 404 =====
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="text-xl text-gray-600 mt-4">Page non trouvée</p>
          <a 
            href="/dashboard" 
            className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    ),
  },
]);

// ============== ROUTER PROVIDER ==============
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
