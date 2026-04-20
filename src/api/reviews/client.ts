import { apiMethods } from '../index';
import { CreateReviewData, ReviewResponse } from './types';

export const reviewsClient = {
  createReview: async (data: CreateReviewData): Promise<ReviewResponse> => {
    const response = await apiMethods.post<ReviewResponse>('/reviews', data);
    return response.data;
  },
};
