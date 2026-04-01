import React from "react";
import { motion } from "framer-motion";
import { Trash, ShoppingBag, Minus, Plus, Package, CheckCircle, Truck, CheckFat } from "@phosphor-icons/react";

interface OrderItemCardProps {
    item: any; // Accept both OrderItemDetail and order items
    index?: number;
    onRemove?: (id: string) => void;
    onQuantityChange?: (id: string, quantity: number) => void;
    actionable?: boolean; // If true, show remove/quantity controls
    isOrderItem?: boolean; // If true, render as order item (not cart item)
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({
    item,
    index = 0,
    onRemove,
    onQuantityChange,
    actionable = false,
    isOrderItem = false,
}) => {
    // Support both cart items and order items
    // Convert prices to numbers (API may return strings)
    const price = Number(item.price || item.unitPrice || 0);
    const discountedPrice = Number(item.discountedPrice || price);
    const discount = Number(item.discountedPercent || 0);
    const itemTotal = Number(isOrderItem ? item.subtotal : (discountedPrice * item.quantity) || 0);
    const productImage = item.productImage || null;
    const productName = item.productName || `Product ${item.sku || item.id}`;
    const sku = item.sku || null;
    const status = item.status || null;

    // Status color mapping for order items
    const STATUS_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
        CONFIRMED: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle },
        PROCESSING: { bg: "bg-purple-100", text: "text-purple-700", icon: Package },
        SHIPPED: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Truck },
        DELIVERED: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckFat },
        PENDING: { bg: "bg-amber-100", text: "text-amber-700", icon: ShoppingBag },
    };

    const statusConfig = status ? STATUS_COLORS[status] || STATUS_COLORS.PENDING : null;
    const itemId = item.id || item.productId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index ? index * 0.05 : 0 }}
            className={`flex gap-4 pb-4 border-b transition-colors ${isOrderItem ? 'hover:bg-slate-50/30' : 'border-border'} last:border-b-0 last:pb-0`}
        >
            {/* Product Image */}
            <div className="flex-shrink-0">
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden ${productImage ? 'bg-slate-100' : 'bg-slate-200'}`}>
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package size={32} className="text-slate-400" weight="duotone" />
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-1">
                <div className="mb-2">
                    {sku && (
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SKU: {sku}</p>
                    )}
                    <h4 className="font-bold text-slate-900 text-base">
                        {productName}
                    </h4>
                    {item?.weight && (
                        <p className="text-xs text-slate-500 mt-1">
                            Weight: {item.weight}
                        </p>
                    )}
                    {item.variantLabel && (
                        <p className="text-xs text-slate-500 mt-1">
                            {item.variantLabel}
                        </p>
                    )}
                    {item.category && (
                        <p className="text-xs text-slate-500">
                            Category: {item.category}
                        </p>
                    )}
                </div>

                {/* Pricing */}
                <div className={`flex items-center gap-3 mt-2 ${isOrderItem ? 'text-sm' : ''}`}>
                    {discount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs line-through text-slate-400">
                                ₹{price.toFixed(2)}
                            </span>
                            <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded">
                                -{discount}%
                            </span>
                        </div>
                    )}
                    <span className="font-bold text-slate-900">
                        ₹{(isOrderItem ? price : discountedPrice).toFixed(2)}
                    </span>
                    {!isOrderItem && item.quantity > 0 && (
                        <span className="text-slate-500 text-sm">× {item.quantity}</span>
                    )}
                </div>
            </div>

            {/* Status/Quantity & Subtotal */}
            <div className="flex-shrink-0 text-right space-y-2">
                {/* Status Badge (Order Items) */}
                {isOrderItem && statusConfig && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${statusConfig.bg}`}>
                        <statusConfig.icon size={14} className={statusConfig.text} weight="bold" />
                        <span className={`text-xs font-bold ${statusConfig.text} uppercase`}>{status}</span>
                    </div>
                )}

                <div>
                    {actionable && !isOrderItem ? (
                        <div className="flex items-center gap-2 justify-end border border-slate-200 rounded-lg p-1">
                            <button
                                onClick={() => onQuantityChange?.(itemId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1 hover:bg-slate-100 rounded transition disabled:opacity-50"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                                onClick={() => onQuantityChange?.(itemId, item.quantity + 1)}
                                className="p-1 hover:bg-slate-100 rounded transition"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-xs font-bold text-slate-600">
                            Qty: <span className="text-slate-900">{item.quantity}</span>
                        </div>
                    )}
                </div>

                <div className={`${isOrderItem ? 'text-2xl font-bold text-slate-900' : 'text-lg font-bold text-slate-900'}`}>
                    ₹{itemTotal.toFixed(2)}
                </div>

                {actionable && onRemove && !isOrderItem && (
                    <button
                        onClick={() => onRemove(itemId)}
                        className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded transition text-xs"
                        title="Remove item"
                    >
                        <Trash size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default OrderItemCard;
