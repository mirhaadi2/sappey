import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsClient } from '../client';
import { Product, ProductFilters, CreateSellerProductData, UpdateSellerProductData } from '../types';

/**
 * Hook for fetching a list of products with optional filters
 * Uses React Query for automatic caching and refetching
 */
export const useProducts = (filters?: ProductFilters, enabled = true) => {
  const query: any = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsClient.getProducts(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    products: query.data?.products || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single product by ID
 * Automatically cached by React Query
 */
export const useProduct = (id: string, enabled = true) => {
  const query = useQuery({
    queryKey: ['products', id],
    queryFn: () => productsClient.getProduct(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    product: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for searching products
 * Search query is used as cache key for separate caching
 */
export const useProductSearch = (searchQuery: string) => {
  const query = useQuery({
    queryKey: ['products', 'search', searchQuery],
    queryFn: () => productsClient.searchProducts(searchQuery),
    enabled: !!searchQuery && searchQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    results: query.data?.products || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching products by category
 * Category ID is used as cache key
 */
export const useProductsByCategory = (categoryId?: string) => {
  const query: any = useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => 
      productsClient.getProducts(categoryId ? { categoryId } : undefined),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    products: query.data?.products || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching all product categories
 * Categories are cached for 30 minutes
 */
export const useCategories = (enabled = true) => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsClient.getCategories(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes - categories change infrequently
  });

  return {
    categories: query.data?.rows || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for product mutations (create, update, delete, upload images, etc.)
 * Handles all mutation operations and automatic cache invalidation
 */
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
  // const uploadImagesMutation = useMutation({
  //   mutationFn: ({ productId, images }: { productId: string; images: File[] }) =>
  //     productsClient.uploadImages(productId, images),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['product'] });
  //   },
  // });

  // // Delete image mutation
  // const deleteImageMutation = useMutation({
  //   mutationFn: ({ productId, imageUrl }: { productId: string; imageUrl: string }) =>
  //     productsClient.deleteImage(productId, imageUrl),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['product'] });
  //   },
  // });

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return {
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    // uploadImages: uploadImagesMutation.mutate,
    // deleteImage: deleteImageMutation.mutate,

    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    // uploadImagesLoading: uploadImagesMutation.isPending,
    // deleteImageLoading: deleteImageMutation.isPending,

    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    // uploadImagesError: uploadImagesMutation.error,
    // deleteImageError: deleteImageMutation.error,

    invalidateProducts,
  };
};

/**
 * Hook for managing seller products (CRUD operations with discounts)
 */
export const useSellerProducts = () => {
  const queryClient = useQueryClient();

  const addToSellerMutation = useMutation({
    mutationFn: ({ productId, sellerData }: { productId: string; sellerData: CreateSellerProductData }) =>
      productsClient.addProductToSeller(productId, sellerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
    },
  });

  const updateSellerProductMutation = useMutation({
    mutationFn: ({ sellerProductId, updates }: { sellerProductId: string; updates: UpdateSellerProductData }) =>
      productsClient.updateSellerProduct(sellerProductId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
    },
  });

  return {
    addToSeller: addToSellerMutation.mutate,
    updateSellerProduct: updateSellerProductMutation.mutate,

    addToSellerLoading: addToSellerMutation.isPending,
    updateSellerProductLoading: updateSellerProductMutation.isPending,

    addToSellerError: addToSellerMutation.error,
    updateSellerProductError: updateSellerProductMutation.error,
  };
};

/**
 * Hook for fetching seller's products
 */
export const useSellerProductsList = (filters?: any, enabled = true) => {
  const query = useQuery({
    queryKey: ['seller-products', filters],
    queryFn: () => productsClient.getSellerProducts(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    sellerProducts: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
