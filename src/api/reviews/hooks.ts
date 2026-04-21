import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { reviewsClient } from './client';
import { CreateReviewData, ReviewResponse, Review } from './types';

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

export const useGetReviews = (limit: number = 10, offset: number = 0) => {
  const query = useQuery({
    queryKey: ['reviews', { limit, offset }],
    queryFn: () => reviewsClient.getReviews({ limit, offset }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    reviews: query.data?.data || [],
    total: query.data?.pagination.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
