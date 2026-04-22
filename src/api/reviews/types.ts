export interface CreateReviewData {
  orderId: string;
  orderItemId: string;
  productId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  orderId: string;
  orderItemId: string;
  productId: string;
  customerId: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RatingStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ProductReviewsData {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: RatingStatistics;
}

export interface ProductReviewsResponse {
  success: boolean;
  data: ProductReviewsData;
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
  message?: string;
}
