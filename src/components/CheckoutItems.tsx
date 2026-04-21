import { CartState } from "../context/CardContext";
import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

interface CheckoutItemsProps {
    state: CartState;
}

const CheckoutItems = ({ state }: CheckoutItemsProps) => {
    const items = state?.items ?? [];
    const [isExpanded, setIsExpanded] = useState(false);

    const displayItems = isExpanded ? items : items.slice(0, 3);
    const hasHiddenItems = items.length > 3;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Order Inventory ({items.length})
                </h3>
            </div>

            <div className="space-y-6">
                {displayItems.map((item, idx) => {
                    const unitPrice = item?.variant?.price || item?.product?.price || 0;
                    const totalPrice = unitPrice * (item?.quantity ?? 1);

                    return (
                        <div key={idx} className="flex items-start gap-4 group">
                            {/* Product Image with Quantity Badge */}
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group-hover:border-brand-brown/20 transition-all duration-300">
                                    <img
                                        src={item?.product?.images?.[0] || ''}
                                        alt={item?.product?.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-[10px] font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-white shadow-sm z-10">
                                    {item?.quantity}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-brown-900 line-clamp-1 leading-none mb-1.5">
                                            {item?.product?.name}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {item?.variant?.weight && (
                                                <p className="text-[11px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded w-fit">
                                                    {item.variant.weight}{item.variant.weightUnit || 'g'}
                                                </p>
                                            )}
                                            <p className="text-[11px] text-slate-500">
                                                ₹{unitPrice.toLocaleString('en-IN')} / unit
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-brown-900">
                                            ₹{totalPrice.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Professional Toggle */}
            {hasHiddenItems && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-brand-brown uppercase tracking-wider hover:bg-brand-brown/5 rounded-xl transition-all border border-brand-brown/10"
                >
                    {isExpanded ? (
                        <>Show Less <CaretUp weight="bold" size={12} /></>
                    ) : (
                        <>+ {items.length - 3} more items <CaretDown weight="bold" size={12} /></>
                    )}
                </button>
            )}
        </div>
    );
};

export default CheckoutItems;