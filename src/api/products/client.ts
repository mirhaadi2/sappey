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
  getProducts: async (filters?: ProductFilters): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiMethods.get<{
      success: boolean;
      products: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/products', filters);

    return {
      products: response.data.products,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
    };
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
