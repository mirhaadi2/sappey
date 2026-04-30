import { OrderItemDetail } from "../api/orders";

export interface ItemReviewCardProps {
    orderId: string;
    id: string;
    productId: string;
    productName: string;
};
export interface OrderDetailsHeaderProps {
    orderNumber: string;
    trackingNumber?: string;
    onBack: () => void;
}

export interface OrderDetailsStatsProps {
    itemCount: number | undefined;
    orderDate: string;
}

export interface OrderDetailsShipmentContentsProps {
    items: OrderItemDetail[] | undefined;
    orderStatus: string;
    orderId: string;
}

export interface OrderDetailsFinancialCardProps {
    totalAmount: string;
    shippingCost: string;
    taxAmount: string;
    finalAmount: string;
    metadata?: Record<string, any>;
}

export interface OrderDetailsShippingDossierProps {
    userName: string;
    shippingAddress: {
        line1?: string;
        city?: string;
        state?: string;
        postalCode?: string;
    };
    shippingPhone?: string;
    onCopyPhone: (phone: string) => void;
    copiedField: string | null;
}

export interface OrderDetailsCancelButtonProps {
    orderStatus: string;
    onCancel: () => void;
}

export interface OrderDetailsSidebarProps {
    timelineData: any[];
    trackingNumber?: string;
    shippingDossier: OrderDetailsShippingDossierProps;
    cancelButton: OrderDetailsCancelButtonProps;
}

export interface TimelineStep {
    status: string;
    label: string;
    icon: React.ElementType;
    isCompleted: boolean;
    isActive: boolean;
    isUpcoming: boolean;
    timestamp?: string; // Optional: To show actual time of status change
}

export interface LogisticsTimelineProps {
    timelineData: TimelineStep[];
    trackingNumber?: string;
}

export type OrderStatus = 
    | "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "HANDOVER" 
    | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "DELIVERY_FAILED" 
    | "RTO" | "CANCELLED" | "FAILED";

export interface OrderItemCardProps {
    item: OrderItemDetail;
    index?: number;
    onRemove?: (id: string) => void;
    onQuantityChange?: (id: string, quantity: number) => void;
    actionable?: boolean;
    isOrderItem?: boolean;
}

export interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
    animated?: boolean;
    variant?: "solid" | "glass"; // Professional touch: multiple visual styles
}