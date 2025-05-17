
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context not available in ProtectedRoute:", error);
    // Return a loading state if auth is not available
    return (
      <div className="flex flex-col min-h-[100svh] bg-background items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }
  
  const { isAuthenticated, isLoading, refreshUserData } = auth;
  const location = useLocation();
  
  // Refresh user data once when route changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      refreshUserData();
    }
  }, [location.pathname, isAuthenticated, isLoading, refreshUserData]);
  
  if (isLoading) {
    // Show loading state while authentication is being checked
    return (
      <div className="flex flex-col min-h-[100svh] bg-background items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
