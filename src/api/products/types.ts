export interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  discountedPrice?: number;
  discountedPercent?: number;
  weight?: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  category: string;
  badge?: string;
  rating?: number;
  reviews?: string[];
  reviewCount?: number;
  nutrition?: string[];
  description?: string;
  descriptionDetails?: Array<{
    type: 'text' | 'highlight' | 'point';
    content: string;
  }>;
  benefits?: string[];
  ingredients?: string[];
  nutritionFacts?: Array<{
    label: string;
    value: string;
  }>;
  price?: number;
  image?: string;
  weight?: number;
  description?: string;
  images?: string[];
  specifications?: Record<string, any>;
  basePrice?: number;
  hsn_code?: string;
  gst_rate: number;
  certifications?: string[];
  variants?: Variant[];
  status: 'ACTIVE' | 'INACTIVE';
  isNew: boolean;
  isCustomerFavourites: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SellerProduct {
  id: string;
  sellerId: string;
  productId: string;
  sellerSku?: string;
  sellerPrice: number;
  costPrice: number;
  discountedPrice?: number;
  discountedPercent?: number;
  rating?: number;
  ratingCount?: number;
  weight?: number;
  dimensions?: Record<string, any>;
  warrantyMonths?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
  product?: Product; // For populated queries
}

export interface ProductWithSeller extends Product {
  sellerProducts?: SellerProduct[];
}

export interface CreateProductData {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  specifications?: Record<string, any>;
  basePrice?: number;
  hsn_code?: string;
  gst_rate?: number;
  certifications?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateSellerProductData {
  productId: string;
  sellerSku?: string;
  sellerPrice: number;
  costPrice: number;
  discountedPrice?: number;
  discountedPercent?: number;
  weight?: number;
  dimensions?: Record<string, any>;
  warrantyMonths?: number;
}

export interface UpdateSellerProductData extends Partial<CreateSellerProductData> {
  id: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  isCustomerFavourites?: boolean;
}

export interface SellerListing {
  id: string;
  sellerId: string;
  sellerPrice: number; // What you paid
  costPrice: number;
  discountedPrice?: number;
  discountedPercent?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
}

export interface ProductResponse {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  specifications?: Record<string, any>;
  basePrice?: number; // DISPLAY PRICE on website
  displayPrice?: number;
  hsn_code?: string;
  gst_rate: number;
  certifications?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Seller listings (internal only - DO NOT show price on frontend)
  sellerListings?: SellerListing[];
  sellerProducts?: SellerProduct[];
}

export interface ProductsListResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryResponse {
  rows: Category[];
  count: number;
}
