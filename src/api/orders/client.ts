import { apiMethods } from '../index';
import { CreateOrderData, ConfirmPaymentPayload, Order, OrderResponse, OrdersListResponse } from './types';

export const ordersClient = {
  // Place a new order (supports both authenticated and guest users)
  placeOrder: async (data: CreateOrderData, guestToken?: string): Promise<Order> => {
    const config = guestToken
      ? { headers: { Authorization: `Bearer ${guestToken}` } }
      : {};

    const response = await apiMethods.post<OrderResponse>(
      '/orders',
      data,
      config
    );
    return response.data.data;
  },

  // Get all orders for current user
  getOrders: async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    sortBy?: string;
  }): Promise<{
    orders: Order[];
    total: number;
    limit: number;
    offset: number;
  }> => {
    // We pass params directly to the GET request as query parameters
    const response = await apiMethods.get<OrdersListResponse>('/orders', params);

    // Based on your previous logic, we return the nested data correctly
    return response?.data?.data || { orders: [], total: 0, limit: 20, offset: 0 };
  },

  // Get single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiMethods.get<OrderResponse>(
      `/orders/${id}`
    );
    return response.data.data;
  },

  // Cancel an order
  cancelOrder: async (id: string, reason: string): Promise<Order> => {
    const response = await apiMethods.post<OrderResponse>(
      `/orders/${id}/cancel`,
      { reason }
    );
    return response.data.data;
  },

  // Confirm payment for an order
  confirmPayment: async (
    id: string,
    payload?: ConfirmPaymentPayload
  ): Promise<Order> => {
    const response = await apiMethods.post<OrderResponse>(
      `/orders/${id}/payment`,
      payload || {}
    );
    return response.data.data;
  },

  // Get order status
  getOrderStatus: async (id: string): Promise<{
    status: string;
    lastUpdated: Date;
  }> => {
    const order = await ordersClient.getOrder(id);
    return {
      status: order.status,
      lastUpdated: new Date(order.updatedAt),
    };
  },

  // Retry payment for failed order
  retryPayment: async (id: string, paymentData: any): Promise<Order> => {
    const response = await apiMethods.post<OrderResponse>(
      `/orders/${id}/payment/retry`,
      paymentData
    );
    return response.data.data;
  },
};
