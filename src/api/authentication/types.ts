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
  id: string;
  email: string;
  role: string;
}

// Legacy auth response
export interface AuthResponse {
  user: User;
  token: string;
}

// New registration flow types
export interface CheckUserData {
  email: string;
  phone: string;
}

export interface CheckUserResponse {
  available: boolean;
}

export interface InitiateRegistrationData {
  name: string;
  email: string;
  phone: string;
}

export interface InitiateRegistrationResponse {
  message: string;
  otpSent: boolean;
}

export interface VerifyOtpData {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
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
}
