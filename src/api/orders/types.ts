export interface OrderItem {
  productId: string;
  productVariantId: string;
  sku: string;
  quantity: number;
  price?: number;
  discountedPrice?: number;
  discountedPercent?: number;
}

export interface OrderItemDetail extends OrderItem {
  productName?: string;
  productImage?: string;
  variantLabel?: string;
  weight?: string;
  category?: string;
  seller?: string;
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
  promotionId?: string;
  promotionDetails?: {
    id: string;
    title: string;
    type: string;
    discount: number;
  };
}

export interface Order {
  itemsCount: any;
  id: string;
  orderNumber: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
  totalAmount: string;
  discountAmount: number;
  taxAmount: string;
  shippingCost: string;
  finalAmount: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  shippingAddressId: string;
  deliveryDate?: Date;
  notes?: string;
  items?: OrderItemDetail[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  shippingAddressType?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  shippingPhone?: string;
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
