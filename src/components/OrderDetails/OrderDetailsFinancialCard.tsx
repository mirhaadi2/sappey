import React from "react";
import { Receipt } from "@phosphor-icons/react";
import { OrderDetailsFinancialCardProps } from "../../types/OrderDetailsPage";

const OrderDetailsFinancialCard: React.FC<OrderDetailsFinancialCardProps> = ({
    totalAmount,
    shippingCost,
    taxAmount,
    finalAmount
}) => {
    return (
        <section className="bg-brand-brown rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl shadow-brand-brown/20">
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <Receipt size={180} weight="duotone" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-[10px] font-black text-brand-cream/40 uppercase tracking-[0.3em] mb-6">Settlement Breakdown</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-brand-cream/80 font-bold text-sm">
                                <span>Subtotal</span>
                                <span className="text-white">₹{parseFloat(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-brand-cream/80 font-bold text-sm">
                                <span>Logistics & Handling</span>
                                <span className="text-white">₹{parseFloat(shippingCost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-brand-cream/80 font-bold text-sm">
                                <span>Taxation (GST)</span>
                                <span className="text-white">₹{parseFloat(taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center md:items-end md:text-right">
                    <p className="text-[10px] font-black text-brand-cream/40 uppercase tracking-[0.4em] mb-4">Final Amount</p>
                    <h3 className="text-5xl font-black tracking-tighter mb-6">
                        ₹{parseFloat(finalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                    <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetailsFinancialCard;