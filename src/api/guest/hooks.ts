import { useState, useEffect } from 'react';
import { guestApiClient } from './client';
import { GuestConfig, SendOTPResponse, VerifyOTPResponse } from './types';

/**
 * Hook to get guest checkout configuration
 */
export const useGuestConfig = () => {
  const [config, setConfig] = useState<GuestConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await guestApiClient.getConfig();
        setConfig(data);
        setError(null);
      } catch (err) {
        console.error('✗ Failed to fetch guest config:', err);
        setError((err as Error).message || 'Failed to load configuration');
        // Fallback to email
        setConfig({
          notificationChannel: 'email',
          contactType: 'email',
          label: 'Email Address',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};

/**
 * Hook to send OTP
 */
export const useSendOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const sendOTP = async (contact: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await guestApiClient.sendOTP({ contact });
      setSuccess(response.success);
      setExpiresIn(response.expiresIn);

      return response.success;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to send OTP';
      setError(errorMessage);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setExpiresIn(null);
  };

  return { sendOTP, loading, error, success, expiresIn, reset };
};

/**
 * Hook to verify OTP
 */
export const useVerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);

  const verifyOTP = async (contact: string, otp: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      setGuestToken(null);

      const response = await guestApiClient.verifyOTP({ contact, otp });

      if (response.success) {
        setGuestToken(response.guestToken);
        return response.guestToken;
      }

      throw new Error(response.message || 'OTP verification failed');
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to verify OTP';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setGuestToken(null);
  };

  return { verifyOTP, loading, error, guestToken, reset };
};
