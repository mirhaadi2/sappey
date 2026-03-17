import { apiMethods } from '../index';
import {
  ADDRESS_LIST,
  ADDRESS_CREATE,
  ADDRESS_GET_DEFAULT,
  ADDRESS_UPDATE,
  ADDRESS_DELETE,
  ADDRESS_SET_DEFAULT,
} from './endpoints';
import { Address, CreateAddressData, UpdateAddressData } from '../../types/address';

export const addressApi = {
  getAll: async (): Promise<Address[]> => {
    const response = await apiMethods.get<{ success: boolean; data: Address[] }>(ADDRESS_LIST);
    return response.data.data || [];
  },

  getDefault: async (): Promise<Address> => {
    const response = await apiMethods.get<{ success: boolean; data: Address }>(ADDRESS_GET_DEFAULT);
    return response.data.data;
  },

  create: async (data: CreateAddressData): Promise<Address> => {
    const response = await apiMethods.post<{ success: boolean; data: Address }>(ADDRESS_CREATE, data);
    return response.data.data;
  },

  update: async (data: UpdateAddressData): Promise<Address> => {
    const updatePayload: any = {};
    if (data.type !== undefined) updatePayload.type = data.type;
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.addressLine1) updatePayload.addressLine1 = data.addressLine1;
    if (data.addressLine2 !== undefined) updatePayload.addressLine2 = data.addressLine2;
    if (data.city) updatePayload.city = data.city;
    if (data.state) updatePayload.state = data.state;
    if (data.postalCode) updatePayload.postalCode = data.postalCode;
    if (data.country) updatePayload.country = data.country;
    if (data.phone) updatePayload.phone = data.phone;

    const response = await apiMethods.put<{ success: boolean; data: Address }>(ADDRESS_UPDATE(data.id), updatePayload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiMethods.delete(ADDRESS_DELETE(id));
  },

  setDefault: async (id: string): Promise<Address> => {
    const response = await apiMethods.post<{ success: boolean; data: Address }>(ADDRESS_SET_DEFAULT(id));
    return response.data.data;
  },
};
