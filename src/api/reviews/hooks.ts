import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsClient } from './client';
import { CreateReviewData, ReviewResponse } from './types';

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsClient.createReview(data),
    onSuccess: (response: ReviewResponse) => {
      // Invalidate review-related queries whenever a new review is created
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['productReviews', response.data.productId] });
    },
  });
};
