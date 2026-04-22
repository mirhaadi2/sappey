import { apiMethods } from '../index';
import { CreateReviewData, ReviewResponse, Review, ProductReviewsResponse } from './types';

export interface GetReviewsParams {
  limit?: number;
  offset?: number;
  productId?: string;
  rating?: number;
}

export interface GetProductReviewsParams {
  page?: number;
  limit?: number;
}

export interface GetReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export const reviewsClient = {
  createReview: async (data: CreateReviewData): Promise<ReviewResponse> => {
    const response = await apiMethods.post<ReviewResponse>('/reviews', data);
    return response.data;
  },

  getReviews: async (params?: GetReviewsParams): Promise<GetReviewsResponse> => {
    const response = await apiMethods.get<GetReviewsResponse>('/reviews', { params });
    return response.data;
  },

  getReviewByOrderItem: async (orderItemId: string): Promise<ReviewResponse> => {
    const response = await apiMethods.get<ReviewResponse>(`/reviews/order-item/${orderItemId}`);
    return response.data;
  },

  getProductReviews: async (
    productId: string,
    params?: GetProductReviewsParams
  ): Promise<ProductReviewsResponse> => {
    const response = await apiMethods.get<ProductReviewsResponse>(
      `/reviews/products/${productId}`,
      { params }
    );
    return response.data;
  },
};
