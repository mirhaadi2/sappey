import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Prevents unauthenticated users from accessing protected pages
 * Redirects to home page if user is not logged in
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isGuestAuthenticated } = useAuth();
  const { user: customerUser, isLoading: customerLoading } = useWebsiteAuth();

  if (loading || customerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-latte to-white">
        <div className="animate-spin w-12 h-12 border-4 border-brand-brown/20 border-t-brand-brown rounded-full" />
      </div>
    );
  }

  // Allow access if user is authenticated via any method
  if (!user && !customerUser && !isGuestAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
