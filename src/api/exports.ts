// Main API exports
export { default as api, apiMethods } from './index';

// Authentication API
export { authApi, useAuth } from './authentication';
export type { LoginData, RegisterData, User, AuthResponse } from './authentication';

// Products API
export { productsClient as productsApi, useProducts, useProduct, useProductsMutations, useProductSearch, useProductsByCategory, useCategories } from './products';
export type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductResponse, Category, CategoryResponse } from './products';

// Orders API
export { ordersClient, useOrders, useOrder } from './orders';
export type { Order, CreateOrderData, OrderItem, OrderResponse, OrdersListResponse } from './orders';

// Address API
export { addressApi, useAddresses } from './address';
// export type { Address, CreateAddressData, UpdateAddressData } from './address';

// Homepage API
export { homepageApi, useHomepageData } from './homepage';
export type { Banner, Hero, Section, Testimonial, InstagramPost, HomepageData } from './homepage';

// API utilities for creating new services
export { ApiService, createApiHooks, createApiService } from './utils';