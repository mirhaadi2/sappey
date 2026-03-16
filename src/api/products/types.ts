export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: File[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
  isActive?: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
