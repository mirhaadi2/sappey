import { apiMethods } from '../index';
import { CreateProductData, Product, ProductFilters, UpdateProductData } from './types';

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
      products: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/products', filters);
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiMethods.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create new product with images
  createProduct: async (data: CreateProductData): Promise<Product> => {
    const formData = new FormData();

    // Add text fields
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('stock', data.stock.toString());

    // Add images
    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    const response = await apiMethods.upload<Product>('/products', formData);
    return response.data;
  },

  // Update product
  updateProduct: async (data: UpdateProductData): Promise<Product> => {
    const { id, images, ...updateData } = data;

    if (images && images.length > 0) {
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await apiMethods.upload<Product>(`/products/${id}`, formData);
      return response.data;
    } else {
      const response = await apiMethods.put<Product>(`/products/${id}`, updateData);
      return response.data;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await apiMethods.delete(`/products/${id}`);
  },

  // Upload product images
  uploadImages: async (productId: string, images: File[]): Promise<string[]> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await apiMethods.upload<string[]>(`/products/${productId}/images`, formData);
    return response.data;
  },

  // Delete product image
  deleteImage: async (productId: string, imageUrl: string): Promise<void> => {
    await apiMethods.delete(`/products/${productId}/images`, {
      data: { imageUrl },
    });
  },

  // Get products by category
  getProductsByCategory: async (
    category: string,
    filters?: Omit<ProductFilters, 'category'>
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiMethods.get<{
      products: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/products/category/${category}`, filters);
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    filters?: Omit<ProductFilters, 'search'>
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiMethods.get<{
      products: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/products/search', {
      ...filters,
      q: query,
    });
    return response.data;
  },
};
