import React from "react";
import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle,
    Truck,
    Package,
    Prohibit,
    WarningCircle,
    Handshake,
    MapPin,
    ArrowCounterClockwise,
    SealCheck
} from "@phosphor-icons/react";

// 1. Updated Type to match your DB and Backend
type OrderStatus = 
    | "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" 
    | "HANDOVER" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" 
    | "DELIVERY_FAILED" | "RTO" | "CANCELLED" | "FAILED";

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
    animated?: boolean;
    variant?: "solid" | "glass"; // Professional touch: multiple visual styles
}

// 2. Comprehensive Status Configuration
const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; dot: string; icon: any; label: string }> = {
    PENDING: {
        bg: "bg-orange-50 border-orange-100",
        text: "text-orange-700",
        dot: "bg-orange-400",
        icon: Clock,
        label: "Pending"
    },
    CONFIRMED: {
        bg: "bg-sky-50 border-sky-100",
        text: "text-sky-700",
        dot: "bg-sky-500",
        icon: SealCheck,
        label: "Confirmed"
    },
    PROCESSING: {
        bg: "bg-amber-50 border-amber-100",
        text: "text-amber-800",
        dot: "bg-amber-500",
        icon: Package,
        label: "Processing"
    },
    PACKED: {
        bg: "bg-violet-50 border-violet-100",
        text: "text-violet-700",
        dot: "bg-violet-500",
        icon: Package,
        label: "Packed"
    },
    HANDOVER: {
        bg: "bg-blue-50 border-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
        icon: Handshake,
        label: "Handover"
    },
    SHIPPED: {
        bg: "bg-indigo-50 border-indigo-100",
        text: "text-indigo-700",
        dot: "bg-indigo-500",
        icon: Truck,
        label: "In Transit"
    },
    OUT_FOR_DELIVERY: {
        bg: "bg-cyan-50 border-cyan-100",
        text: "text-cyan-700",
        dot: "bg-cyan-500",
        icon: MapPin,
        label: "Out for Delivery"
    },
    DELIVERED: {
        bg: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        icon: CheckCircle,
        label: "Delivered"
    },
    DELIVERY_FAILED: {
        bg: "bg-rose-50 border-rose-100",
        text: "text-rose-700",
        dot: "bg-rose-500",
        icon: WarningCircle,
        label: "Delivery Failed"
    },
    RTO: {
        bg: "bg-red-50 border-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
        icon: ArrowCounterClockwise,
        label: "RTO"
    },
    CANCELLED: {
        bg: "bg-slate-100 border-slate-200",
        text: "text-slate-600",
        dot: "bg-slate-400",
        icon: Prohibit,
        label: "Cancelled"
    },
    FAILED: {
        bg: "bg-red-100 border-red-200",
        text: "text-red-800",
        dot: "bg-red-600",
        icon: WarningCircle,
        label: "Failed"
    },
};

const SIZE_MAP = {
    sm: { container: "px-2 py-0.5 text-[10px]", dot: "w-1 h-1", icon: 12 },
    md: { container: "px-2.5 py-1 text-xs", dot: "w-1.5 h-1.5", icon: 14 },
    lg: { container: "px-3 py-1.5 text-sm", dot: "w-2 h-2", icon: 18 },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    size = "md",
    showIcon = true,
    animated = true,
    variant = "glass"
}) => {
    // Safety check for unknown statuses
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const Icon = config.icon;
    const sizeClass = SIZE_MAP[size];

    const badgeContent = (
        <div 
            className={`
                inline-flex items-center gap-1.5 rounded-full font-bold border tracking-wide uppercase
                ${sizeClass.container} 
                ${config.bg} 
                ${config.text}
                ${variant === "glass" ? "backdrop-blur-md bg-opacity-60" : ""}
            `}
        >
            {showIcon && (
                <div className="flex items-center justify-center">
                    <Icon size={sizeClass.icon} weight="bold" />
                </div>
            )}
            {!showIcon && <div className={`${sizeClass.dot} rounded-full ${config.dot}`} />}
            <span>{config.label}</span>
        </div>
    );

    if (animated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="inline-block"
            >
                {badgeContent}
            </motion.div>
        );
    }

    return badgeContent;
};

export default OrderStatusBadge;