import React, { memo } from "react";
import { motion } from "framer-motion";
import { 
    Trash, Minus, Plus, Package, 
    CheckCircle, Truck, SealCheck, 
    Clock, WarningCircle, Handshake,
    MapPin, ArrowCounterClockwise, Prohibit
} from "@phosphor-icons/react";
import { OrderItemDetail } from "../api/orders";

// --- Extended Type Definition ---
type OrderStatus = 
    | "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "HANDOVER" 
    | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "DELIVERY_FAILED" 
    | "RTO" | "CANCELLED" | "FAILED";

interface OrderItemCardProps {
    item: OrderItemDetail;
    index?: number;
    onRemove?: (id: string) => void;
    onQuantityChange?: (id: string, quantity: number) => void;
    actionable?: boolean;
    isOrderItem?: boolean;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({
    item,
    index = 0,
    onRemove,
    onQuantityChange,
    actionable = false,
    isOrderItem = false,
}) => {
    // --- Data Sanitization ---
    const price = Number(item?.price ?? item?.unitPrice ?? 0);
    const discountedPrice = Number(item?.discountedPrice ?? price);
    const discount = Number(item?.discountedPercent ?? 0);
    const itemQuantity = Number(item?.quantity ?? 0);
    const itemTotal = Number((discountedPrice ?? price) * itemQuantity) ?? 0;

    const productImage = (item?.productImage ?? null) as string | null;
    const productName = (item?.productName ?? `Item #${item?.sku ?? 'N/A'}`) as string;
    const sku = (item?.sku ?? null) as string | null;
    const status = (item?.status as OrderStatus) ?? null;
    const itemId = (item?.id ?? item?.productId) as string;
    const itemWeight = (item?.weight ?? null) as string | null;
    const itemVariantLabel = (item?.variantLabel ?? null) as string | null;

    // --- Comprehensive Logistics Status Mapping ---
    const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; icon: React.ComponentType }> = {
        PENDING: { bg: "bg-orange-50", text: "text-orange-600", icon: Clock },
        CONFIRMED: { bg: "bg-sky-50", text: "text-sky-600", icon: SealCheck },
        PROCESSING: { bg: "bg-amber-50", text: "text-amber-700", icon: Package },
        PACKED: { bg: "bg-violet-50", text: "text-violet-600", icon: Package },
        HANDOVER: { bg: "bg-blue-50", text: "text-blue-600", icon: Handshake },
        SHIPPED: { bg: "bg-indigo-50", text: "text-indigo-600", icon: Truck },
        OUT_FOR_DELIVERY: { bg: "bg-cyan-50", text: "text-cyan-600", icon: MapPin },
        DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle },
        DELIVERY_FAILED: { bg: "bg-rose-50", text: "text-rose-600", icon: WarningCircle },
        RTO: { bg: "bg-red-50", text: "text-red-600", icon: ArrowCounterClockwise },
        CANCELLED: { bg: "bg-slate-100", text: "text-slate-500", icon: Prohibit },
        FAILED: { bg: "bg-red-100", text: "text-red-700", icon: WarningCircle },
    };

    const statusConfig = status ? STATUS_COLORS[status] : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group flex items-start gap-5 py-5 transition-all ${
                isOrderItem ? 'hover:bg-brand-brown/5 px-4 -mx-4 rounded-[24px]' : 'border-b border-slate-100'
            } last:border-0`}
        >
            {/* Image Section */}
            <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-[24px] bg-white border border-brand-brown/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center justify-center group-hover:border-brand-brown/30 transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)]">
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <Package size={32} className="text-slate-300" weight="duotone" />
                    )}
                </div>
            </div>

            {/* Core Info */}
            <div className="flex-1 min-w-0 py-1">
                <div className="flex flex-col h-full justify-between">
                    <div>
                        {sku && (
                            <p className="text-[10px] font-black text-[#9a5d2e]/60 uppercase tracking-[0.2em] mb-1">
                                SKU: {sku}
                            </p>
                        )}
                        <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight truncate pr-4">
                            {productName}
                        </h4>
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                            {itemWeight && (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                                    {itemWeight}
                                </span>
                            )}
                            {itemVariantLabel && (
                                <span className="text-[10px] font-bold text-slate-500 italic">
                                    {itemVariantLabel}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                            ₹{(discountedPrice ?? price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        {discount > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs line-through text-slate-400">
                                    ₹{(price ?? 0).toFixed(2)}
                                </span>
                                <span className="text-[10px] font-black px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded">
                                    -{discount}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action/Total Section */}
            <div className="flex-shrink-0 text-right flex flex-col items-end justify-between self-stretch py-1">
                <div className="space-y-2">
                    {/* Enhanced Status Badge */}
                    {isOrderItem && statusConfig && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                            {React.createElement(statusConfig.icon as React.ComponentType<{ size: number; className: string; weight: string }>, { 
                                size: 12, 
                                className: statusConfig.text, 
                                weight: "bold" 
                            })}
                            <span className={`text-[10px] font-black ${statusConfig.text} uppercase tracking-wider`}>
                                {status?.replace(/_/g, " ")}
                            </span>
                        </div>
                    )}

                    {/* Quantity Controls (Cart Mode) */}
                    {actionable && !isOrderItem && (
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
                            <button
                                onClick={() => onQuantityChange?.(itemId, itemQuantity - 1)}
                                disabled={itemQuantity <= 1}
                                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition disabled:opacity-30"
                            >
                                <Minus size={12} weight="bold" />
                            </button>
                            <span className="w-6 text-center text-xs font-black text-slate-900">{itemQuantity}</span>
                            <button
                                onClick={() => onQuantityChange?.(itemId, itemQuantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition"
                            >
                                <Plus size={12} weight="bold" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Subtotal</p>
                    <div className={`${isOrderItem ? 'text-xl font-black text-[#9a5d2e]' : 'text-lg font-bold text-slate-900'} tracking-tighter`}>
                        ₹{(itemTotal ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    
                    {actionable && onRemove && !isOrderItem && (
                        <button
                            onClick={() => onRemove(itemId)}
                            className="mt-2 text-rose-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove from Cart"
                        >
                            <Trash size={18} weight="duotone" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default memo(OrderItemCard);