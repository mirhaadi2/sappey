import api from '../index';
import { AxiosError } from 'axios';
import {
  GuestConfig,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  FindCustomerByContactRequest,
  FindCustomerByContactResponse,
} from './types';
import { guestApiEndpoints } from './endpoints';

export const guestApiClient = {
  /**
   * Get guest checkout configuration (notification channel, contact type)
   */
  async getConfig(): Promise<GuestConfig> {
    try {
      const response = await api.get(guestApiEndpoints.getConfig);
      return response.data;
    } catch (error) {
      console.error('✗ Failed to get guest config:', error);
      throw error;
    }
  },

  /**
   * Send OTP to guest contact
   */
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      const response = await api.post(guestApiEndpoints.sendOTP, request);
      return {
        success: response.data.success,
        message: response.data.message,
        expiresIn: response.data.expiresIn,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to send OTP';
      throw new Error(errorMessage);
    }
  },

  /**
   * Verify OTP and get guest token
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      const response = await api.post(guestApiEndpoints.verifyOTP, request);
      return {
        success: response.data.success,
        message: response.data.message,
        guestToken: response.data.guestToken,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to verify OTP';
      throw new Error(errorMessage);
    }
  },

  async findCustomerByContact(request: FindCustomerByContactRequest): Promise<FindCustomerByContactResponse> {
    try {
      const response = await api.get(guestApiEndpoints.lookupCustomer, {
        params: {
          contact: request.contact,
          type: request.type,
        },
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to lookup customer';
      throw new Error(errorMessage);
    }
  },

  /**
   * Create or get customer from guest token
   */
  async createCustomer(guestToken: string): Promise<{ success: boolean; customerId: string; message: string }> {
    try {
      const response = await api.post(guestApiEndpoints.createCustomer, { guestToken });
      return {
        success: response.data.success,
        customerId: response.data.customerId,
        message: response.data.message,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to create customer';
      throw new Error(errorMessage);
    }
  },
};
