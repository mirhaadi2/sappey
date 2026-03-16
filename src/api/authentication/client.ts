import { apiMethods } from '../index';
import {
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_PROFILE,
  AUTH_LOGOUT,
  AUTH_CHANGE_PASSWORD,
  AUTH_FORGOT_PASSWORD,
  AUTH_RESET_PASSWORD,
  AUTH_REFRESH_TOKEN,
} from './endpoints';
import {
  AuthResponse,
  LoginData,
  RegisterData,
  User,
} from './types';

export const authClient = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiMethods.post<AuthResponse>(AUTH_LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiMethods.post<AuthResponse>(AUTH_REGISTER, data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiMethods.get<User>(AUTH_PROFILE);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiMethods.put<User>(AUTH_PROFILE, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiMethods.post(AUTH_LOGOUT);
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiMethods.post<{ token: string }>(AUTH_REFRESH_TOKEN);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiMethods.put(AUTH_CHANGE_PASSWORD, data);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiMethods.post(AUTH_FORGOT_PASSWORD, { email });
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<void> => {
    await apiMethods.post(AUTH_RESET_PASSWORD, data);
  },
};
