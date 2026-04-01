import React from "react";
import { motion } from "framer-motion";
import { Trash, ShoppingBag, Minus, Plus } from "@phosphor-icons/react";
import { OrderItemDetail } from "../api/orders/types";

interface OrderItemCardProps {
  item: OrderItemDetail;
  index?: number;
  onRemove?: (productId: string) => void;
  onQuantityChange?: (productId: string, quantity: number) => void;
  actionable?: boolean; // If true, show remove/quantity controls
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  index = 0,
  onRemove,
  onQuantityChange,
  actionable = false,
}) => {
  const discount = item.discountedPercent || 0;
  const itemTotal = (item.discountedPrice || item.price || 0) * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index ? index * 0.05 : 0 }}
      className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {item.productImage ? (
            <img
              src={item.productImage}
              alt={item.productName || "Product"}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingBag size={32} className="text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <div className="mb-2">
          <h4 className="font-semibold text-foreground text-base">
            {item.productName || "Product"}
          </h4>
          {item.variantLabel && (
            <p className="text-xs text-muted-foreground">
              {item.variantLabel}
            </p>
          )}
          {item.category && (
            <p className="text-xs text-muted-foreground">
              Category: {item.category}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-3">
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs line-through text-muted-foreground">
                ${item.price?.toFixed(2)}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-destructive/20 text-destructive rounded">
                -{discount}%
              </span>
            </div>
          )}
          <span className="font-semibold text-foreground">
            ${item.discountedPrice?.toFixed(2) || item.price?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>

      {/* Quantity & Subtotal */}
      <div className="flex-shrink-0 text-right">
        <div className="mb-2">
          {actionable ? (
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => onQuantityChange?.(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-1 hover:bg-muted rounded transition disabled:opacity-50"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange?.(item.productId, item.quantity + 1)}
                className="p-1 hover:bg-muted rounded transition"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <div className="text-sm">
              <span className="font-medium">Qty: </span>
              <span className="font-semibold">{item.quantity}</span>
            </div>
          )}
        </div>

        <div className="text-lg font-bold text-primary">
          ${itemTotal.toFixed(2)}
        </div>

        {actionable && onRemove && (
          <button
            onClick={() => onRemove(item.productId)}
            className="mt-2 p-2 text-destructive hover:bg-destructive/10 rounded transition"
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
