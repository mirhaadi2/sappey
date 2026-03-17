export type AddressType = "HOME" | "WORK" | "OTHER";

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  name?: string;
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

export interface CreateAddressData {
  type: AddressType;
  name?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}
