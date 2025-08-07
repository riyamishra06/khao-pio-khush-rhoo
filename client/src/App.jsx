import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';

// User pages
import Dashboard from './pages/Dashboard';
import TrackNutrition from './pages/TrackNutrition';
import Reports from './pages/Reports';
import MemberShip from './pages/MemberShip';

// Admin pages (we'll create these)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFoods from './pages/admin/AdminFoods';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Layout components
import Navbar from './components/Home/Navbar';
import Footer from './components/Home/Footer';

const App = () => {
  const { isLoading, isAuthenticated, userRole } = useAuth();

  // Show loading spinner during initial auth check
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading application..." />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
                ) : (
                  <Login />
                )
              }
            />

            {/* User protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-nutrition"
              element={
                <ProtectedRoute requiredRole="user">
                  <TrackNutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole="user">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membership"
              element={
                <ProtectedRoute requiredRole="user">
                  <MemberShip />
                </ProtectedRoute>
              }
            />

            {/* Admin protected routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/foods"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminFoods />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <Navigate
                  to={
                    isAuthenticated
                      ? (userRole === 'admin' ? '/admin/dashboard' : '/dashboard')
                      : '/'
                  }
                  replace
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
