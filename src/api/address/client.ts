import { apiMethods } from '../index';
import {
  ADDRESS_LIST,
  ADDRESS_CREATE,
  ADDRESS_UPDATE,
  ADDRESS_DELETE,
  ADDRESS_SET_DEFAULT,
} from './endpoints';
import { Address, CreateAddressData, UpdateAddressData } from '../../types/address';

export const addressApi = {
  getAll: async (): Promise<Address[]> => {
    const response = await apiMethods.get<Address[]>(ADDRESS_LIST);
    return response.data;
  },

  create: async (data: CreateAddressData): Promise<Address> => {
    const response = await apiMethods.post<Address>(ADDRESS_CREATE, data);
    return response.data;
  },

  update: async (data: UpdateAddressData): Promise<Address> => {
    const response = await apiMethods.put<Address>(ADDRESS_UPDATE(data.id), {
      name: data.name,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
      isDefault: data.isDefault,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiMethods.delete(ADDRESS_DELETE(id));
  },

  setDefault: async (id: string): Promise<Address> => {
    const response = await apiMethods.post<Address>(ADDRESS_SET_DEFAULT(id));
    return response.data;
  },
};
