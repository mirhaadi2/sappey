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
  id: string; // Unique order item ID from database - REQUIRED for reviews
  productName?: string;
  productImage?: string;
  variantLabel?: string;
  unitPrice?: string;
  totalPrice?: string;
  discountAmount?: string;
  taxAmount?: string;
  weight?: string;
  category?: string;
  seller?: string;
  subtotal?: string;
  metadata?: Record<string, any>;
  status?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  discountAmount: number;
  couponDiscount?: number;
  couponCode?: string;
  couponId?: string;
  couponType?: string;
  taxAmount: number;
  shippingCost?: number;
  shippingAddressId?: string;
  shippingAddress?: {
    name: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'cod' | 'online';
  paymentDetails?: {
    upiId?: string;
    netbankingBank?: string;
  };
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
  trackingNumber?: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
  totalAmount: string;
  discountAmount: number;
  taxAmount: string;
  shippingCost: string;
  finalAmount: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  paymentSession?: {
    provider: string;
    gatewayOrderId: string;
    publicKey?: string;
    rawResponse?: Record<string, any>;
  };
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

export interface ConfirmPaymentPayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    limit: number;
    offset: number;
  };
}
