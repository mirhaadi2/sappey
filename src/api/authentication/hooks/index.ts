import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../client';
import { AuthResponse, User, LoginData, RegisterData } from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const completeRegistrationMutation = useMutation({
    mutationFn: authApi.completeRegistration,
    onSuccess: async () => {
      // Refetch user profile to validate session and get user data
      // This will refetch immediately and then cache for 5 minutes
      await queryClient.refetchQueries({ queryKey: ['user'] });
    },
    retry: 1, // Retry once in case of network hiccup
  });

  const profileQuery = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getProfile,
    enabled: true, // Always attempt session profile fetch for cookie-based auth
    retry: false, // Don't retry on 401
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  return {
    // Data
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isAuthenticated: !!localStorage.getItem('auth_token') || !!profileQuery.data,

    // Mutations (full objects for flexible usage)
    loginMutation,
    registerMutation,
    completeRegistrationMutation,
    updateProfileMutation,
    logoutMutation,
    changePasswordMutation,
    forgotPasswordMutation,
    resetPasswordMutation,

    // Profile query
    profileQuery,
  };
};
