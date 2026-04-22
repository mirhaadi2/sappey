import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
      queryClient.invalidateQueries({ queryKey: ['orderItemReview', response.data.orderItemId] });
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

export const useGetReviewByOrderItem = (orderItemId: string) => {
  const query = useQuery({
    queryKey: ['orderItemReview', orderItemId],
    queryFn: () => reviewsClient.getReviewByOrderItem(orderItemId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!orderItemId, // Only run query if orderItemId is provided
  });

  return {
    review: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetProductReviews = (productId: string, page: number = 1, limit: number = 10) => {
  const query = useQuery({
    queryKey: ['productReviews', productId, { page, limit }],
    queryFn: () => reviewsClient.getProductReviews(productId, { page, limit }),
    staleTime: 1000 * 60 * 10, // 10 minutes - product reviews don't change as frequently
    enabled: !!productId, // Only run query if productId is provided
  });

  return {
    reviews: query.data?.data?.reviews || [],
    statistics: query.data?.data?.statistics || null,
    pagination: query.data?.data ? { 
      total: query.data.data.total,
      page: query.data.data.page,
      limit: query.data.data.limit,
      totalPages: query.data.data.totalPages
    } : null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
