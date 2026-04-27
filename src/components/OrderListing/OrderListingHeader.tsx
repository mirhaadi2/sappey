import React from "react";
import { Plus, Receipt } from "@phosphor-icons/react";
import { OrderListingHeaderProps } from "../../types/OrderListingPage";

const OrderListingHeader: React.FC<OrderListingHeaderProps> = ({ stats, onNewOrder }) => {
    return (
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="h-[1px] w-10 bg-brand-brown/30" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-brown/60">Orders & Logistics</span>
                </div>
                <h1 className="text-5xl font-light text-slate-900 tracking-tight">
                    Your <span className="font-serif italic text-brand-brown">Collections</span>
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="hidden lg:flex items-center bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm pr-6">
                    <div className="bg-brand-cream/30 p-2.5 rounded-xl mr-4">
                        <Receipt size={20} className="text-brand-brown" weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lifetime Spend</span>
                        <span className="text-sm font-bold text-slate-800 flex items-center">
                            {stats.total.toLocaleString()}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onNewOrder}
                    className="group flex items-center gap-3 px-5 py-3 bg-[#65442e] text-white rounded-2xl font-bold text-sm hover:shadow-[0_20px_40px_-10px_rgba(61,43,31,0.3)] transition-all active:scale-95"
                >
                    <span>New Order</span>
                    <div className="bg-white/10 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                        <Plus weight="bold" size={14} />
                    </div>
                </button>
            </div>
        </header>
    );
};

export default OrderListingHeader;
