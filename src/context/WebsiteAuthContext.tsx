/**
 * Website Auth Context
 * Provides portal-isolated authentication state management
 * Consolidated authentication context handling both regular and guest authentication
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { websiteAuthService, AuthUser, LoginCredentials, RegisterCredentials } from '../services/auth.service';
import { useAuth as useAuthApi, User } from "../api/exports";

interface WebsiteAuthContextType {
  // Regular auth state
  user: User | null | undefined;
  currentUser: User | AuthUser | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  notification: string | null;

  // Customer auth state (OTP)
  customerUser: AuthUser | null;

  // Guest auth state
  isGuestAuthenticated: boolean;
  guestDisplayName: string | null;

  // Auth modal state
  authModal: "signin" | "signup" | "guest" | "customer" | null;

  // Loading states
  signInLoading: boolean;
  signUpLoading: boolean;
  signOutLoading: boolean;

  // Error states
  signInError: Error | null;
  signUpError: Error | null;
  signOutError: Error | null;

  // Methods
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUserState: (user: AuthUser | null) => void;
  clearError: () => void;
  showNotification: (message: string) => void;
  clearNotification: () => void;
  checkAuth: () => Promise<void>;

  // Regular auth methods
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string, firstName: string, lastName: string) => void;
  signOut: () => Promise<void>;

  // Guest auth methods
  setGuestAuthToken: (token: string) => void;
  clearGuestAuth: () => void;

  // Modal methods
  openAuthModal: (mode: "signin" | "signup" | "guest" | "customer") => void;
  closeAuthModal: () => void;
}

const WebsiteAuthContext = createContext<WebsiteAuthContextType | undefined>(undefined);

interface WebsiteAuthProviderProps {
  children: ReactNode;
}

export const WebsiteAuthProvider: React.FC<WebsiteAuthProviderProps> = ({ children }) => {
  // Regular auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Guest auth state
  const [guestDisplayName, setGuestDisplayName] = useState<string | null>(null);
  const [isGuestAuthenticated, setIsGuestAuthenticated] = useState(false);

  // Auth modal state
  const [authModal, setAuthModal] = useState<"signin" | "signup" | "guest" | "customer" | null>(null);

  // Use the authentication API hook for regular auth
  const queryClient = useQueryClient();
  const {
    user: regularUser,
    isLoading: regularLoading,
    loginMutation,
    registerMutation,
    logoutMutation,
  } = useAuthApi();

  // Keep local auth state in sync with the shared react-query user cache.
  useEffect(() => {
    if (regularUser) {
      setUser(regularUser as AuthUser);
    }
  }, [regularUser]);

  // JWT decode helper
  const decodeJwtPayload = <T,>(token: string): T | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(jsonPayload) as T;
    } catch {
      return null;
    }
  };

  const getGuestDisplayNameFromToken = (token: string) => {
    const payload = decodeJwtPayload<{ contact?: string }>(token);
    return payload?.contact ?? null;
  };

  // Guest auth methods
  const setGuestAuthToken = (token: string) => {
    localStorage.setItem('guest_token', token);
    setGuestDisplayName(getGuestDisplayNameFromToken(token));
    setIsGuestAuthenticated(true);
  };

  const clearGuestAuth = () => {
    localStorage.removeItem('guest_token');
    setGuestDisplayName(null);
    setIsGuestAuthenticated(false);
  };

  // Initialize guest auth state on mount
  useEffect(() => {
    const existingToken = localStorage.getItem('guest_token');
    if (existingToken) {
      setGuestDisplayName(getGuestDisplayNameFromToken(existingToken));
      setIsGuestAuthenticated(true);
    }
  }, []);

  // Regular auth methods
  const signIn = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const signUp = (email: string, password: string, firstName: string, lastName: string) => {
    registerMutation.mutate({ email, password, firstName, lastName });
  };

  const signOut = async () => {
    await logoutMutation.mutateAsync(undefined);
    clearGuestAuth();
  };

  // Modal methods
  const openAuthModal = (mode: "signin" | "signup" | "guest" | "customer") => {
    setAuthModal(mode);
  };

  const closeAuthModal = () => {
    setAuthModal(null);
  };
  const userRef = useRef<AuthUser | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);
  // Website auth methods (customer OTP)
  const setUserState = React.useCallback((user: AuthUser | null) => {
    setUser(user);
    if (user) {
      websiteAuthService.cacheUser(user);
      queryClient.setQueryData(['user'], user);
    } else {
      websiteAuthService.clearCachedUser();
      localStorage.removeItem('auth_token');
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  }, [queryClient]);

  const showNotification = React.useCallback((message: string) => {
    setNotification(message);
  }, []);

  const clearNotification = React.useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const checkAuth = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await websiteAuthService.getCurrentUser();
      setUser(currentUser);
      if (!currentUser) {
        setUserState(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUserState]);

  // Initialize website auth state on mount and verify session validity.
  useEffect(() => {
    const initializeAuth = async () => {
      const cachedUser = websiteAuthService.getUser();
      if (cachedUser) {
        setUser(cachedUser);
      }
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (userRef.current) {
        showNotification('Your session has expired. Please log in again.');
      }
      setUserState(null);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    window.addEventListener('website-auth-unauthorized', handleUnauthorized);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('website-auth-unauthorized', handleUnauthorized);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth, setUserState]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const { user: userData } = await websiteAuthService.login(credentials);
      setUserState(userData);

      // Redirect after successful login
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (err: unknown) {
      const errorMessage = (err instanceof Object && 'response' in err && typeof (err as any).response?.data?.message === 'string')
        ? (err as any).response.data.message
        : 'Login failed';
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
      setUserState(userData);

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = '/profile';
      }, 500);
    } catch (err: unknown) {
      const errorMessage = (err instanceof Object && 'response' in err && typeof (err as any).response?.data?.message === 'string')
        ? (err as any).response.data.message
        : 'Registration failed';
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
      setUserState(null);

      // User state cleared - let the component handle navigation if needed
    } catch (err: unknown) {
      const errorMessage = (err instanceof Object && 'response' in err && typeof (err as any).response?.data?.message === 'string')
        ? (err as any).response.data.message
        : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Determine overall authentication state
  const currentUser = regularUser ?? user;
  const isAuthenticated = !!currentUser || isGuestAuthenticated;

  const value: WebsiteAuthContextType = {
    // Regular auth state
    user: regularUser,
    currentUser,
    isAuthenticated,
    isLoading: isLoading || regularLoading,
    error,

    // Customer auth state (OTP)
    customerUser: user,

    // Guest auth state
    isGuestAuthenticated,
    guestDisplayName,

    // Auth modal state
    authModal,

    // Loading states
    signInLoading: loginMutation.isPending,
    signUpLoading: registerMutation.isPending,
    signOutLoading: logoutMutation.isPending,

    // Error states
    signInError: loginMutation.error,
    signUpError: registerMutation.error,
    signOutError: logoutMutation.error,

    notification,
    showNotification,
    clearNotification,

    // Methods
    login,
    register,
    logout,
    setUserState,
    clearError,
    checkAuth,

    // Regular auth methods
    signIn,
    signUp,
    signOut,

    // Guest auth methods
    setGuestAuthToken,
    clearGuestAuth,

    // Modal methods
    openAuthModal,
    closeAuthModal,
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
