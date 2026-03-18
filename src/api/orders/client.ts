import { apiMethods } from '../index';
import { CreateOrderData, Order, OrderResponse, OrdersListResponse } from './types';

export const ordersClient = {
  // Place a new order
  placeOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiMethods.post<OrderResponse>(
      '/orders',
      data
    );
    return response.data.data;
  },

  // Get all orders for current user
  getOrders: async (filters?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{
    orders: Order[];
    total: number;
    pagination: {
      limit: number;
      offset: number;
    };
  }> => {
    const response = await apiMethods.get<OrdersListResponse>('/orders', filters);
    return {
      orders: response.data.data,
      total: response.data.pagination?.total || 0,
      pagination: {
        limit: response.data.pagination?.limit || 20,
        offset: response.data.pagination?.page ? ((response.data.pagination.page - 1) * (response.data.pagination.limit || 20)) : 0,
      },
    };
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
  confirmPayment: async (id: string): Promise<Order> => {
    const response = await apiMethods.post<OrderResponse>(
      `/orders/${id}/payment`,
      {}
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
