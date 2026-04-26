import { OrderItemDetail } from "../api/orders";

export interface OrderDetailsHeaderProps {
    orderNumber: string;
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
    shippingDossier: OrderDetailsShippingDossierProps;
    cancelButton: OrderDetailsCancelButtonProps;
}