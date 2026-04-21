import { apiMethods } from '../index';
import { CreateReviewData, ReviewResponse, Review } from './types';

export interface GetReviewsParams {
  limit?: number;
  offset?: number;
  productId?: string;
  rating?: number;
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
};
