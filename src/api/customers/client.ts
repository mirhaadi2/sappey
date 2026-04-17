import { apiMethods } from '../index';

export interface SendOtpData {
  contact: string;
  contactType: 'email' | 'phone' | 'whatsapp';
}

export interface VerifyOtpData {
  contact: string;
  otp: string;
  contactType: 'email' | 'phone' | 'whatsapp';
}

export interface CustomerAuthResponse {
  user: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    role: string;
  };
  token: string;
}

export const customersApi = {
  sendOtp: (data: SendOtpData) =>
    apiMethods.post('/customers/send-otp', data),

  verifyOtp: (data: VerifyOtpData) =>
    apiMethods.post('/customers/verify-otp', data),
};