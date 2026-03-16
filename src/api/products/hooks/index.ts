import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsClient } from '../client';
import { ProductFilters } from '../types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsClient.getProducts(filters),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsClient.getProduct(id),
    enabled: !!id,
  });
};

export const useProductsMutations = () => {
  const queryClient = useQueryClient();

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productsClient.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: productsClient.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productsClient.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Upload images mutation
  const uploadImagesMutation = useMutation({
    mutationFn: ({ productId, images }: { productId: string; images: File[] }) =>
      productsClient.uploadImages(productId, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imageUrl }: { productId: string; imageUrl: string }) =>
      productsClient.deleteImage(productId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  return {
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    uploadImages: uploadImagesMutation.mutate,
    deleteImage: deleteImageMutation.mutate,

    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    uploadImagesLoading: uploadImagesMutation.isPending,
    deleteImageLoading: deleteImageMutation.isPending,

    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    uploadImagesError: uploadImagesMutation.error,
    deleteImageError: deleteImageMutation.error,
  };
};

export const useProductSearch = (query: string, filters?: Omit<ProductFilters, 'search'>) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productsClient.searchProducts(query, filters),
    enabled: !!query,
  });
};

export const useProductsByCategory = (
  category: string,
  filters?: Omit<ProductFilters, 'category'>
) => {
  return useQuery({
    queryKey: ['products', 'category', category, filters],
    queryFn: () => productsClient.getProductsByCategory(category, filters),
    enabled: !!category,
  });
};
