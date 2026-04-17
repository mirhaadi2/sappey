/**
 * Website Auth Service
 * Manages independent authentication for Website Portal
 * Completely isolated from seller and admin portals
 */

import { apiMethods } from '../api/index';

const USER_KEY = 'WEBSITE_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'USER';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

class WebsiteAuthService {
  /**
   * Login - Session-based authentication
   * Sessions are HttpOnly secure cookies managed by the server
   */
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser }> {
    const response = await apiMethods.post('/auth/login', {
      ...credentials,
    });

    const { user } = response.data.data;

    // Session cookie is set automatically by the server
    // No token management needed
    this.cacheUser(user);

    return { user };
  }

  /**
   * Register - Session-based authentication
   * Sessions are HttpOnly secure cookies managed by the server
   */
  async register(credentials: RegisterCredentials): Promise<{ user: AuthUser }> {
    const response = await apiMethods.post('/auth/register', {
      ...credentials,
      role: 'USER',
    });

    const { user } = response.data.data;

    // Session cookie is set automatically by the server
    // No token management needed
    this.cacheUser(user);

    return { user };
  }

  /**
   * Logout - Destroys server session
   */
  async logout(): Promise<void> {
    try {
      // Notify backend to destroy session
      await apiMethods.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear cached user state and any token created by OTP login
      this.clearCachedUser();
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get current user - Queries backend for authenticated user info
   * Handles 401 gracefully (user not authenticated)
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiMethods.get('/auth/me');
      const user = response.data.data?.user || null;
      if (user) {
        this.cacheUser(user);
      }
      return user;
    } catch (error: any) {
      // 401 is normal when user is not authenticated - don't treat as error
      if (error.response?.status === 401) {
        this.clearCachedUser();
        return null;
      }
      // Other errors should be re-thrown
      throw error;
    }
  }

  /**
   * Store user data
   */
  cacheUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get stored user
   */
  getUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear user data
   */
  clearCachedUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Check if user is authenticated in this portal
   * With session-based auth, session validity is checked by attempting to read it
   */
  isAuthenticated(): boolean {
    // User is authenticated if we have cached user data
    // Session validation happens automatically via 401 responses
    return !!this.getUser();
  }
}

export const websiteAuthService = new WebsiteAuthService();
