import React from "react";
import { motion } from "framer-motion";
import { getStatusConfig } from "../../utils/orderStatusMapper";
import { OrderStatusBadgeProps } from "../../types/OrderDetailsPage";

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
    // Get config from centralized status mapper
    const config = getStatusConfig(status);
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