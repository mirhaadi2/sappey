import {
    Clock,
    SealCheck,
    Package,
    Handshake,
    Truck,
    MapPin,
    CheckCircle,
    WarningCircle,
    ArrowCounterClockwise,
    Prohibit,
    CurrencyInr,
} from "@phosphor-icons/react";

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "HANDOVER"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "DELIVERY_FAILED"
    | "RTO"
    | "CANCELLED"
    | "FAILED"
    | "REFUNDED";

export interface StatusConfig {
    label: string; // Customer-friendly label
    description: string; // Detailed description
    bg: string; // Tailwind background color
    text: string; // Tailwind text color
    border: string; // Tailwind border color
    dot: string; // Tailwind dot color
    icon: any; // Icon component
    badgeColor: "amber" | "sky" | "indigo" | "violet" | "blue" | "cyan" | "emerald" | "rose" | "red" | "slate" | "orange";
}

// Centralized status mapping for website frontend
export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
    PENDING: {
        label: "Processing",
        description: "Your order is being processed",
        bg: "bg-amber-50 border-amber-100",
        text: "text-amber-700",
        border: "border-amber-100",
        dot: "bg-amber-500",
        icon: Clock,
        badgeColor: "amber",
    },
    CONFIRMED: {
        label: "Processing",
        description: "Your order has been confirmed",
        bg: "bg-sky-50 border-sky-100",
        text: "text-sky-700",
        border: "border-sky-100",
        dot: "bg-sky-500",
        icon: SealCheck,
        badgeColor: "sky",
    },
    PROCESSING: {
        label: "Processing",
        description: "Your order is being prepared",
        bg: "bg-indigo-50 border-indigo-100",
        text: "text-indigo-700",
        border: "border-indigo-100",
        dot: "bg-indigo-500",
        icon: Package,
        badgeColor: "indigo",
    },
    PACKED: {
        label: "Shipment Packed",
        description: "Your order has been packed and is ready to ship",
        bg: "bg-violet-50 border-violet-100",
        text: "text-violet-700",
        border: "border-violet-100",
        dot: "bg-violet-500",
        icon: Package,
        badgeColor: "violet",
    },
    HANDOVER: {
        label: "Handover to Courier",
        description: "Your order has been handed over to the courier",
        bg: "bg-blue-50 border-blue-100",
        text: "text-blue-700",
        border: "border-blue-100",
        dot: "bg-blue-500",
        icon: Handshake,
        badgeColor: "blue",
    },
    SHIPPED: {
        label: "Shipped (In Transit)",
        description: "Your order is on the way",
        bg: "bg-blue-50 border-blue-100",
        text: "text-blue-700",
        border: "border-blue-100",
        dot: "bg-blue-500",
        icon: Truck,
        badgeColor: "blue",
    },
    OUT_FOR_DELIVERY: {
        label: "Out for Delivery",
        description: "Your order is out for delivery today",
        bg: "bg-cyan-50 border-cyan-100",
        text: "text-cyan-700",
        border: "border-cyan-100",
        dot: "bg-cyan-500",
        icon: MapPin,
        badgeColor: "cyan",
    },
    DELIVERED: {
        label: "Delivered Successfully",
        description: "Your order has been delivered",
        bg: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
        icon: CheckCircle,
        badgeColor: "emerald",
    },
    DELIVERY_FAILED: {
        label: "Delivery Failed",
        description: "Delivery attempt failed. We'll retry soon",
        bg: "bg-rose-50 border-rose-100",
        text: "text-rose-700",
        border: "border-rose-100",
        dot: "bg-rose-500",
        icon: WarningCircle,
        badgeColor: "rose",
    },
    RTO: {
        label: "Return to Origin (RTO)",
        description: "Your order is being returned to us",
        bg: "bg-red-50 border-red-100",
        text: "text-red-700",
        border: "border-red-100",
        dot: "bg-red-500",
        icon: ArrowCounterClockwise,
        badgeColor: "red",
    },
    CANCELLED: {
        label: "Cancelled",
        description: "Your order has been cancelled",
        bg: "bg-slate-100 border-slate-200",
        text: "text-slate-600",
        border: "border-slate-200",
        dot: "bg-slate-400",
        icon: Prohibit,
        badgeColor: "slate",
    },
    FAILED: {
        label: "Failed",
        description: "Your order could not be processed",
        bg: "bg-red-100 border-red-200",
        text: "text-red-800",
        border: "border-red-200",
        dot: "bg-red-500",
        icon: WarningCircle,
        badgeColor: "red",
    },
    REFUNDED: {
        label: "Refunded",
        description: "Your order has been refunded",
        bg: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
        icon: CurrencyInr,
        badgeColor: "emerald",
    },
};

/**
 * Get status configuration by status code
 */
export const getStatusConfig = (status: string): StatusConfig => {
    return ORDER_STATUS_CONFIG[(status as OrderStatus) || "PENDING"];
};

/**
 * Get customer-friendly label for status
 */
export const getStatusLabel = (status: string): string => {
    return getStatusConfig(status).label;
};

/**
 * Get status description
 */
export const getStatusDescription = (status: string): string => {
    return getStatusConfig(status).description;
};

/**
 * Map order items status to display status (for order details)
 */
export const getDisplayStatus = (status: string): string => {
    // For timeline visualization, group some statuses together
    const displayMap: Record<string, string> = {
        PENDING: "PENDING",
        CONFIRMED: "PROCESSING",
        PROCESSING: "PROCESSING",
        PACKED: "PROCESSING",
        HANDOVER: "SHIPPING",
        SHIPPED: "SHIPPING",
        OUT_FOR_DELIVERY: "SHIPPING",
        DELIVERED: "DELIVERED",
        DELIVERY_FAILED: "DELIVERY_FAILED",
        RTO: "RTO",
        CANCELLED: "CANCELLED",
        FAILED: "FAILED",
        REFUNDED: "REFUNDED",
    };

    return displayMap[status] || status;
};

/**
 * Get timeline steps for order tracking
 */
export const TIMELINE_STEPS = [
    { status: "PENDING", label: "Order Placed", description: "Order received", icon: Clock },
    { status: "PROCESSING", label: "Processing", description: "Being prepared", icon: Package },
    { status: "SHIPPING", label: "In Transit", description: "On the way", icon: Truck },
    { status: "DELIVERED", label: "Delivered", description: "Successfully delivered", icon: CheckCircle },
];

/**
 * Check if order is in a failed/cancelled state
 */
export const isOrderFailed = (status: string): boolean => {
    return ["CANCELLED", "FAILED", "DELIVERY_FAILED", "RTO"].includes(status);
};

/**
 * Check if order is delivered
 */
export const isOrderDelivered = (status: string): boolean => {
    return status === "DELIVERED";
};

/**
 * Check if order is in transit
 */
export const isOrderInTransit = (status: string): boolean => {
    return ["SHIPPED", "OUT_FOR_DELIVERY", "HANDOVER"].includes(status);
};

/**
 * Check if order is still processing
 */
export const isOrderProcessing = (status: string): boolean => {
    return ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"].includes(status);
};
