// Main API exports
export { default as api, apiMethods } from './index';

// Authentication API
export { authApi, useAuth } from './authentication';
export type { LoginData, RegisterData, User, AuthResponse } from './authentication';

// Products API
export { productsClient as productsApi, useProducts, useProduct, useProductsMutations, useProductSearch, useProductsByCategory, useInfiniteProducts, useCategories } from './products';
export type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductResponse, Category, CategoryResponse } from './products';

// Orders API
export { ordersClient, useOrders, useOrder } from './orders';
export type { Order, CreateOrderData, OrderItem, OrderResponse, OrdersListResponse } from './orders';

// Reviews API
export { reviewsClient, useSubmitReview } from './reviews';
export type { CreateReviewData, Review, ReviewResponse } from './reviews/types';

// Address API
export { addressApi, useAddresses } from './address';
// export type { Address, CreateAddressData, UpdateAddressData } from './address';

// Homepage API
export { homepageApi, useHomepageData } from './homepage';
export type { Banner, Hero, Section, Testimonial, InstagramPost, HomepageData } from './homepage';

// Customers API
export { customersApi, useSendCustomerOtp, useVerifyCustomerOtp } from './customers';
export type { Customer, CustomerAuthResponse } from './customers';

// Delhivery API
export { delhiveryApi, useCheckPincodeServiceability } from './integrations/delhivery';
export type { PincodeServiceabilityResponse } from './integrations/delhivery';