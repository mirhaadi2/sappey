/**
 * Guest Checkout API Types
 */

export interface GuestConfig {
  notificationChannel: 'email' | 'sms' | 'whatsapp' | 'in_app';
  contactType: 'email' | 'phone' | 'whatsapp'; // Primary contact type for backward compatibility
  enabledContactTypes: {
    email?: boolean;
    phone?: boolean;
    whatsapp?: boolean;
  };
  labels?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
}

export interface SendOTPRequest {
  contact: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresIn: number;
}

export interface VerifyOTPRequest {
  contact: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  guestToken: string;
  message: string;
}

export interface GuestShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
