import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Warning,
  Prohibit
} from "@phosphor-icons/react";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
}

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; dot: string; icon: React.ComponentType<any> }> = {
  PENDING: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
    icon: Clock,
  },
  CONFIRMED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
    icon: CheckCircle,
  },
  PROCESSING: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
    icon: Package,
  },
  SHIPPED: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
    icon: Truck,
  },
  DELIVERED: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
    icon: CheckCircle,
  },
  CANCELLED: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
    icon: Prohibit,
  },
  FAILED: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const LABEL_MAP: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
};

const SIZE_MAP = {
  sm: {
    container: "px-2 py-1 text-xs",
    dot: "w-1.5 h-1.5",
    icon: 14,
  },
  md: {
    container: "px-3 py-1.5 text-sm",
    dot: "w-2 h-2",
    icon: 16,
  },
  lg: {
    container: "px-4 py-2 text-base",
    dot: "w-2.5 h-2.5",
    icon: 20,
  },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
  animated = false,
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sizeClass = SIZE_MAP[size];
  const label = LABEL_MAP[status];

  const badgeContent = (
    <div className={`inline-flex items-center gap-2 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass.container}`}>
      {showIcon && (
        <div className={`${sizeClass.dot} rounded-full ${config.dot}`} />
      )}
      <span>{label}</span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
};

export default OrderStatusBadge;
