import React from "react";
import { Navigate } from "react-router-dom";
import { useWebsiteAuth } from "../../contexts/WebsiteAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Prevents unauthenticated users from accessing protected pages
 * Redirects to home page if user is not logged in
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isGuestAuthenticated, isLoading } = useWebsiteAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-latte to-white">
        <div className="animate-spin w-12 h-12 border-4 border-brand-brown/20 border-t-brand-brown rounded-full" />
      </div>
    );
  }

  // Allow access if user is authenticated via any method
  if (!currentUser && !isGuestAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
