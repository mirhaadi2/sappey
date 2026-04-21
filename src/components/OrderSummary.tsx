import React from 'react';
import CheckoutPromotionBadge from './CheckoutPromotionBadge';
import { Promotion } from "../api/promotions";


interface OrderSummaryData {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

interface OrderSummaryProps {
    orderSummary: OrderSummaryData;
    filteredPromotions: Promotion[];
    isReturningCustomer: boolean;
    shippingLabel: string;
}

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
                <input
                    type="text"
                    placeholder="Discount code"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-brand-brown focus:outline-none text-sm"
                />
                <button className="w-full text-right text-brand-brown font-semibold text-sm hover:underline">
                    Apply
                </button>
            </div>

            {/* Promotions Logic */}
            {filteredPromotions?.length > 0 ? (
                <div className="space-y-2 pt-3">
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
                            } else {
                                discountAmount = 0;
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
                <p className="text-xs italic text-slate-500 pt-3">
                    This customer has placed previous orders, so promotional offers are not available.
                </p>
            ) : null}

            {/* Totals Section */}
            <div className="space-y-2 pt-4 border-t border-slate-200 mt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">₹{orderSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold text-brand-brown">{shippingLabel}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <div className="text-right">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-slate-600">INR</span>
                            <span className="text-2xl">₹{orderSummary.total.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-slate-600">
                            Including ₹{orderSummary.tax.toFixed(2)} in taxes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;