import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi, SendOtpData, VerifyOtpData } from './client';
import { websiteAuthService } from '../../services/auth.service';

export const useSendCustomerOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpData) => customersApi.sendOtp(data),
  });
};

export const useVerifyCustomerOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyOtpData) => customersApi.verifyOtp(data),
    onSuccess: (data) => {
      if (data?.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
      }

      if (data?.data?.user) {
        websiteAuthService.cacheUser(data.data.user);
        queryClient.setQueryData(['user'], data.data.user);
      }
    },
  });
};