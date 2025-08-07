import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login',
  fallback = null 
}) => {
  const { isAuthenticated, isLoading, userRole, verifyError } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If there's a verification error, redirect to login
  if (verifyError) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    // If user is admin but trying to access user routes, redirect to admin dashboard
    if (userRole === 'admin' && requiredRole === 'user') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    // If user is regular user but trying to access admin routes, show fallback or redirect
    if (userRole === 'user' && requiredRole === 'admin') {
      if (fallback) {
        return fallback;
      }
      return <Navigate to="/dashboard" replace />;
    }
    
    // For any other role mismatch, redirect to appropriate dashboard
    const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
