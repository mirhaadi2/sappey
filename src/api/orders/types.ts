export interface OrderItem {
  productId: string;
  productVariantId: string;
  sku: string;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost?: number;
  shippingAddressId: string;
  paymentMethod: 'card' | 'cod' | 'upi' | 'netbanking';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost: number;
  finalAmount: number;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  shippingAddressId: string;
  deliveryDate?: Date;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
