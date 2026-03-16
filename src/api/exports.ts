// Main API exports
export { default as api, apiMethods } from './index';

// Authentication API
export { authApi, useAuth } from './authentication';
export type { LoginData, RegisterData, User, AuthResponse } from './authentication';

// Products API
export { productsClient as productsApi, useProducts, useProduct, useProductsMutations, useProductSearch, useProductsByCategory } from './products';
export type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductResponse } from './products';

// API utilities for creating new services
export { ApiService, createApiHooks, createApiService } from './utils';