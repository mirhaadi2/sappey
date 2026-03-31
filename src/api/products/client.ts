import { apiMethods } from '../index';
import {
  CreateProductData,
  Product,
  ProductFilters,
  UpdateProductData,
  CreateSellerProductData,
  UpdateSellerProductData,
  SellerProduct
} from './types';

export const productsClient = {
  // Get all products with filters
  getProducts: async (filters?: ProductFilters): Promise<{ products: any[]; total: number; page: number; limit: number; totalPages: number }> => {
    try {
      const response = await apiMethods.get<{ data: any }>('/products', filters);
      const data = response.data?.data;

      // Ensure we return the expected structure
      if (data && typeof data === 'object' && Array.isArray(data.products)) {
        return {
          products: data.products,
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10,
          totalPages: data.totalPages || 1,
        };
      }

      // Fallback for unexpected response structure
      console.warn('Unexpected products API response structure:', data);
      return { products: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    } catch (error: any) {
      if (error?.code === 'ECONNABORTED') {
        console.warn('Products request timeout, returning empty result set');
      } else {
        console.error('Error fetching products:', error);
      }
      return { products: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiMethods.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data.data;
  },

  // Create new product
  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await apiMethods.post<{ success: boolean; data: Product }>('/products', data);
    return response.data.data;
  },

  // Update product
  updateProduct: async (data: UpdateProductData): Promise<Product> => {
    const { id, ...updateData } = data;
    const response = await apiMethods.put<{ success: boolean; data: Product }>(`/products/${id}`, updateData);
    return response.data.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await apiMethods.delete(`/products/${id}`);
  },

  // Search products
  searchProducts: async (query: string, filters?: Omit<ProductFilters, 'search'>): Promise<{
    products: Product[];
    total: number;
  }> => {
    const response = await apiMethods.get<{ success: boolean; data: { products: Product[]; total: number } }>(
      '/products/search',
      { q: query, ...filters }
    );
    return response.data.data;
  },

  // Get categories
  getCategories: async (filters?: any): Promise<{
    rows: any[];
    count: number;
  }> => {
    const response = await apiMethods.get<{ success: boolean; data: { rows: any[]; count: number } }>(
      '/products/categories',
      filters
    );
    return response.data.data;
  },

  // Add product to seller
  addProductToSeller: async (productId: string, sellerData: CreateSellerProductData): Promise<SellerProduct> => {
    const response = await apiMethods.post<{ success: boolean; data: SellerProduct }>(
      `/products/${productId}/add-to-seller`,
      sellerData
    );
    return response.data.data;
  },

  // Get seller's products
  getSellerProducts: async (filters?: any): Promise<SellerProduct[]> => {
    const response = await apiMethods.get<{ success: boolean; data: SellerProduct[] }>(
      '/products/seller/products',
      filters
    );
    return response.data.data;
  },

  // Update seller product
  updateSellerProduct: async (sellerProductId: string, updates: UpdateSellerProductData): Promise<SellerProduct> => {
    const response = await apiMethods.put<{ success: boolean; data: SellerProduct }>(
      `/products/seller/${sellerProductId}/price`,
      updates
    );
    return response.data.data;
  },
};
