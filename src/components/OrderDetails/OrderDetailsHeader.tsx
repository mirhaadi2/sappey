import React from "react";
import { ArrowLeft, CaretRight, ShieldCheck } from "@phosphor-icons/react";
import { OrderDetailsHeaderProps } from "../../types/OrderDetailsPage";

const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({ orderNumber, onBack }) => {
    return (
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-all border border-slate-100 group">
                        <ArrowLeft size={18} weight="bold" className="text-slate-400 group-hover:text-brand-brown" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                            <span>Manifest</span>
                            <CaretRight size={8} weight="bold" className="text-slate-300" />
                            <span className="text-brand-brown">{orderNumber}</span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Order Architecture</h1>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                    <ShieldCheck size={16} weight="fill" className="text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secured Node</span>
                </div>
            </div>
        </header>
    );
};

export default OrderDetailsHeader;