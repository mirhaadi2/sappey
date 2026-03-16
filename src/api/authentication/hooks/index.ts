import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authClient } from '../client';
import { AuthResponse, User, LoginData, RegisterData } from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authClient.login,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authClient.register,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const profileQuery = useQuery({
    queryKey: ['user'],
    queryFn: authClient.getProfile,
    enabled: !!localStorage.getItem('auth_token'),
  });

  const updateProfileMutation = useMutation({
    mutationFn: authClient.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authClient.logout,
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authClient.changePassword,
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authClient.forgotPassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authClient.resetPassword,
  });

  return {
    // Data
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isAuthenticated: !!localStorage.getItem('auth_token'),

    // Mutations (full objects for flexible usage)
    loginMutation,
    registerMutation,
    updateProfileMutation,
    logoutMutation,
    changePasswordMutation,
    forgotPasswordMutation,
    resetPasswordMutation,

    // Profile query
    profileQuery,
  };
};
