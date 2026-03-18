import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersClient } from './client';
import { Order, CreateOrderData } from './types';

/**
 * Hook for fetching user's orders list
 * Automatically cached and refetched by React Query
 */
export const useOrders = (enabled = true) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersClient.getOrders(),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes - orders data changes frequently
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateOrderData) => ordersClient.placeOrder(data),
    onSuccess: (newOrder) => {
      // Add new order to cache
      queryClient.setQueryData(['orders'], (old: { orders: Order[] } | undefined) => {
        return {
          orders: [...(old?.orders || []), newOrder],
        };
      });
      // Also cache the individual order
      queryClient.setQueryData(['orders', newOrder.id], newOrder);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ordersClient.cancelOrder(id, reason),
    onSuccess: (updatedOrder) => {
      // Update order in list cache
      queryClient.setQueryData(['orders'], (old: { orders: Order[] } | undefined) => {
        return {
          orders: (old?.orders || []).map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          ),
        };
      });
      // Update individual order cache
      queryClient.setQueryData(['orders', updatedOrder.id], updatedOrder);
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: (id: string) => ordersClient.confirmPayment(id),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(['orders'], (old: { orders: Order[] } | undefined) => {
        return {
          orders: (old?.orders || []).map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          ),
        };
      });
      queryClient.setQueryData(['orders', updatedOrder.id], updatedOrder);
    },
  });

  return {
    // Query data
    orders: query.data?.orders || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,

    // Mutations
    placeOrder: (data: CreateOrderData) => createMutation.mutateAsync(data),
    cancelOrder: (id: string, reason: string) =>
      cancelMutation.mutateAsync({ id, reason }),
    confirmPayment: (id: string) => confirmPaymentMutation.mutateAsync(id),

    // Mutation states
    isCreatingOrder: createMutation.isPending,
    isCancelingOrder: cancelMutation.isPending,
    isConfirmingPayment: confirmPaymentMutation.isPending,

    // Mutation errors
    createError: createMutation.error,
    cancelError: cancelMutation.error,
    confirmPaymentError: confirmPaymentMutation.error,
  };
};

/**
 * Hook for fetching a single order by ID
 * Separate query for individual order details
 */
export const useOrder = (orderId: string, enabled = true) => {
  const query = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => ordersClient.getOrder(orderId),
    enabled: enabled && !!orderId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  return {
    order: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
