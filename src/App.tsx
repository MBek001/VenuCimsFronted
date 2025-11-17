import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/LoadingSpinner';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Auth Pages
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ResetPassword } from './pages/Auth/ResetPassword';

// Dashboard
import { Dashboard } from './pages/Dashboard/Dashboard';

// CRM Pages
import { CustomerList } from './pages/CRM/CustomerList';
import { CustomerDetail } from './pages/CRM/CustomerDetail';
import { CreateCustomer } from './pages/CRM/CreateCustomer';
import { EditCustomer } from './pages/CRM/EditCustomer';

// Superuser Pages
import { SuperuserDashboard } from './pages/Superuser/SuperuserDashboard';
import { UserManagement } from './pages/Superuser/UserManagement';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireSuperuser?: boolean }> = ({
  children,
  requireSuperuser = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperuser && !user?.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { loadUser, isLoading } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--tooltip-bg)',
            color: 'var(--foreground)',
            border: '1px solid var(--tooltip-border)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* CRM Routes */}
          <Route path="/crm/customers" element={<CustomerList />} />
          <Route path="/crm/customers/new" element={<CreateCustomer />} />
          <Route path="/crm/customers/:id" element={<CustomerDetail />} />
          <Route path="/crm/customers/:id/edit" element={<EditCustomer />} />

          {/* Superuser Routes */}
          <Route
            path="/superuser/dashboard"
            element={
              <ProtectedRoute requireSuperuser>
                <SuperuserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superuser/users"
            element={
              <ProtectedRoute requireSuperuser>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
