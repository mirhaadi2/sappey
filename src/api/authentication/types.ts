// Authentication API types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  phone: JSX.Element;
  id: string;
  email: string;
  role: string;
  name?: string; // Optional, can be derived from firstName + lastName
  data?: any; // For additional user info if needed
}

// Legacy auth response
export interface AuthResponse {
  user: User;
  token: string;
  data?: any; // For new response format
}

// New registration flow types
export interface CheckUserData {
  email: string;
  phone: string;
}

export interface CheckUserResponse {
  available: boolean;
  data?: any; // For additional info if needed
}

export interface InitiateRegistrationData {
  name: string;
  email: string;
  phone: string;
  data?: any;
}

export interface InitiateRegistrationResponse {
  message: string;
  otpSent: boolean;
  data?: any; // For additional info if needed
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
  data?: any; // For additional info if needed
}

export interface CompleteRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface CompleteRegistrationResponse {
  user: User;
  message: string;
  data?: any; // For additional info if needed
}
