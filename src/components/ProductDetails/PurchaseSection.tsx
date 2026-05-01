import React from "react";
import { Minus, Plus, ShoppingCart, Check } from "@phosphor-icons/react";
import { Badge } from "./index";
import { Truck, ShieldCheck } from "@phosphor-icons/react";
import { PurchaseSectionProps } from "../../types/ProductDetails";

const PurchaseSection: React.FC<PurchaseSectionProps> = ({
    quantity,
    onQuantityChange,
    isOutOfStock,
    onAddToCart,
    onBuyNow
}) => (
    <div className="space-y-6 pt-4 mt-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Change the inner div to include w-fit and justify-between for better spacing */}
            <div className="flex items-center justify-between w-fit min-w-[140px] bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                <button
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    className="p-3 text-brand-brown hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <Minus weight="bold" />
                </button>
                <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
                <button
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="p-3 text-brand-brown hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <Plus weight="bold" />
                </button>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest">
                {isOutOfStock ? <span className="text-red-500">Out of Stock</span> : <span className="text-emerald-600 flex items-center gap-1"><Check weight="bold" /> In Stock</span>}
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
            <button
                disabled={isOutOfStock}
                onClick={onAddToCart}
                className="group relative overflow-hidden bg-brand-brown text-white h-12 rounded-2xl font-bold uppercase tracking-widest text-xs transition-transform active:scale-[0.98] disabled:opacity-50"
            >
                <span className="relative z-10 flex items-center justify-center gap-2"><ShoppingCart size={20} /> Add To Bag</span>
            </button>
            <button
                disabled={isOutOfStock}
                onClick={onBuyNow}
                className="h-12 rounded-2xl border-2 border-brand-brown text-brand-brown font-bold uppercase tracking-widest text-xs hover:bg-brand-brown hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
            >
                Instant Buy
            </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-t border-slate-100">
            <Badge icon={<Truck size={20} />} text={<>Complimentary <br />Shipping</>} />
            <Badge icon={<ShieldCheck size={20} />} text={<>Quality <br />Guaranteed</>} />
        </div>
    </div>
);

export default PurchaseSection;