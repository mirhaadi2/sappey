import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressApi } from './client';
import { Address, CreateAddressData, UpdateAddressData } from '../../types/address';

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['addresses'],
    queryFn: addressApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: addressApi.create,
    onSuccess: (newAddress) => {
      queryClient.setQueryData(['addresses'], (old: Address[] | undefined) => {
        return [...(old || []), newAddress];
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: addressApi.update,
    onSuccess: (updatedAddress) => {
      queryClient.setQueryData(['addresses'], (old: Address[] | undefined) => {
        return (old || []).map((addr) =>
          addr.id === updatedAddress.id ? updatedAddress : addr
        );
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: addressApi.delete,
    onSuccess: (_, addressId) => {
      queryClient.setQueryData(['addresses'], (old: Address[] | undefined) => {
        return (old || []).filter((addr) => addr.id !== addressId);
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressApi.setDefault,
    onSuccess: (updatedAddress) => {
      queryClient.setQueryData(['addresses'], (old: Address[] | undefined) => {
        return (old || []).map((addr) => ({
          ...addr,
          isDefault: addr.id === updatedAddress.id,
        }));
      });
    },
  });

  return {
    addresses: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    
    createAddress: (data: CreateAddressData) => createMutation.mutate(data),
    updateAddress: (data: UpdateAddressData) => updateMutation.mutate(data),
    deleteAddress: (id: string) => deleteMutation.mutate(id),
    setDefaultAddress: (id: string) => setDefaultMutation.mutate(id),
    
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSettingDefault: setDefaultMutation.isPending,
    
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    setDefaultError: setDefaultMutation.error,
  };
};
