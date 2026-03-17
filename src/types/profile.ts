export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  profileImage?: string;
  addresses?: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
