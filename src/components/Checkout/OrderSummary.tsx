import React from 'react';
import { CheckoutPromotionBadge } from ".";
import { OrderSummaryProps } from '../../types';

const OrderSummary: React.FC<OrderSummaryProps> = ({
    orderSummary,
    filteredPromotions,
    isReturningCustomer,
    shippingLabel,
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {/* Discount Input Section */}
            <div className="space-y-2">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Discount code"
                        className="w-full pl-4 pr-16 py-3 border border-slate-200 rounded-xl focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/20 focus:outline-none text-sm transition-all"
                    />
                    <button className="absolute right-2 top-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-brand-brown transition-colors">
                        Apply
                    </button>
                </div>
            </div>

            {/* Promotions Logic */}
            {filteredPromotions?.length > 0 ? (
                <div className="space-y-2 pt-4">
                    {filteredPromotions.map((promo) => {
                        let discountAmount = 0;
                        let isFreeShipping = false;

                        const meetsMinOrder = orderSummary.subtotal >= (promo.minOrderValue || 0);
                        if (meetsMinOrder) {
                            if (promo.type === 'fixed_discount') {
                                discountAmount = promo.discountValue || 0;
                            } else if (promo.type === 'percentage_discount') {
                                discountAmount = (orderSummary.subtotal * (promo.discountValue || 0)) / 100;
                            } else if (promo.type === 'free_shipping') {
                                isFreeShipping = true;
                                discountAmount = orderSummary.shipping;
                            }
                        }

                        return (
                            <CheckoutPromotionBadge
                                key={promo.id}
                                promotion={promo}
                                cartValue={orderSummary.subtotal}
                                discount={discountAmount}
                                isFreeShipping={isFreeShipping}
                            />
                        );
                    })}
                </div>
            ) : isReturningCustomer ? (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[11px] leading-relaxed text-slate-500 italic">
                        As a returning customer, exclusive promotional offers are currently restricted for this session.
                    </p>
                </div>
            ) : null}

            {/* Totals Section */}
            <div className="space-y-3 pt-6 border-t border-slate-100 mt-6">
                {/* <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Subtotal (Incl. GST)</span>
                    <span className="font-semibold text-slate-900">₹{Math.round(orderSummary?.subtotal || 0).toLocaleString('en-IN')}</span>
                </div> */}

                {/* Discount Row (Visible only if discount > 0) */}
                {(orderSummary.promotionDiscount && orderSummary?.promotionDiscount > 0) ? (
                    <div className="flex justify-between text-sm">
                        <span className="text-emerald-600 font-medium">Promotion Applied</span>
                        <span className="font-bold text-emerald-600">- ₹{Math.round(orderSummary?.promotionDiscount || 0).toLocaleString('en-IN')}</span>
                    </div>
                ) : null}

                {(shippingLabel && shippingLabel.toLowerCase() !== 'free') && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Shipping</span>
                        <span className="font-semibold text-brand-brown">{shippingLabel}</span>
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                    <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-bold text-slate-400">INR</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tight">
                                ₹{Math.round(orderSummary?.total || 0).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-slate-400">
                            GST: ₹{Math.round(orderSummary?.tax || 0).toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;