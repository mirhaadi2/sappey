import { useMutation } from '@tanstack/react-query';
import { guestApiClient } from './index';
import { SendOTPResponse, VerifyOTPResponse } from './types';

/**
 * Send OTP to email/phone/whatsapp for guest checkout
 */
export const useSendGuestOtp = () => {
  return useMutation<
    SendOTPResponse,
    Error,
    {
      contact: string;
      type: 'email' | 'phone' | 'whatsapp';
    }
  >({
    mutationFn: async (data) => {
      return guestApiClient.sendOTP(data);
    },
  });
};

/**
 * Verify OTP for guest checkout
 */
export const useVerifyGuestOtp = () => {
  return useMutation<
    VerifyOTPResponse,
    Error,
    {
      contact: string;
      otp: string;
      type: 'email' | 'phone' | 'whatsapp';
    }
  >({
    mutationFn: async (data) => {
      return guestApiClient.verifyOTP(data);
    },
  });
};
