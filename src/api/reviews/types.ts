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

export interface ReviewResponse {
  success: boolean;
  data: Review;
  message?: string;
}
