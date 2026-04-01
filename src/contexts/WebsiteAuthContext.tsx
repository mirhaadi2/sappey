/**
 * Website Auth Context
 * Provides portal-isolated authentication state management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { websiteAuthService, AuthUser, LoginCredentials, RegisterCredentials } from '../services/auth.service';

interface WebsiteAuthContextType {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Methods
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const WebsiteAuthContext = createContext<WebsiteAuthContextType | undefined>(undefined);

interface WebsiteAuthProviderProps {
  children: ReactNode;
}

export const WebsiteAuthProvider: React.FC<WebsiteAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // Try to fetch current user from session
      // If session is valid, this will succeed; otherwise 401 will be caught
      const currentUser = await websiteAuthService.getCurrentUser();
      console.log(currentUser, 'uer')
      setUser(currentUser);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const { user: userData } = await websiteAuthService.login(credentials);
      setUser(userData);

      // Redirect after successful login
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const { user: userData } = await websiteAuthService.register(credentials);
      setUser(userData);

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = '/profile';
      }, 500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);

      await websiteAuthService.logout();
      setUser(null);

      // Redirect after logout - only affects this portal
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: WebsiteAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };

  return (
    <WebsiteAuthContext.Provider value={value}>
      {children}
    </WebsiteAuthContext.Provider>
  );
};

/**
 * Hook to use Website Auth Context
 */
export const useWebsiteAuth = (): WebsiteAuthContextType => {
  const context = useContext(WebsiteAuthContext);
  if (context === undefined) {
    throw new Error('useWebsiteAuth must be used within WebsiteAuthProvider');
  }
  return context;
};
