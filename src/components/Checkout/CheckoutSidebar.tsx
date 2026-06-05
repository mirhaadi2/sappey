import React from "react";
import { motion } from "framer-motion";
import { CheckoutItems } from "./index";
import { OrderSummary } from "./index";
import { CheckoutSidebarProps } from "../../types";

const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
    state,
    dispatch,
    orderSummary,
    filteredPromotions,
    isReturningCustomer,
    shippingLabel,
    couponCode,
    onCouponCodeChange,
    onApplyCoupon,
    couponLoading,
    couponError,
    appliedCoupon,
    couponDiscount,
    onClearCoupon,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-28 space-y-4"
        >
            <div className="bg-white rounded-2xl p-6 border border-brand-brown/10">
                <CheckoutItems state={state} dispatch={dispatch} />
            </div>

            <OrderSummary
                orderSummary={orderSummary}
                filteredPromotions={filteredPromotions}
                isReturningCustomer={isReturningCustomer}
                shippingLabel={shippingLabel}
                couponCode={couponCode}
                onCouponCodeChange={onCouponCodeChange}
                onApplyCoupon={onApplyCoupon}
                couponLoading={couponLoading}
                couponError={couponError}
                appliedCoupon={appliedCoupon}
                couponDiscount={couponDiscount}
                onClearCoupon={onClearCoupon}
            />
        </motion.div>
    );
};

export default CheckoutSidebar;