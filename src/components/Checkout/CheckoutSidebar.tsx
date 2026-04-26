import React from "react";
import { motion } from "framer-motion";
import CheckoutItems from "../CheckoutItems";
import OrderSummary from "../OrderSummary";
import { CartState } from "../../context/CardContext";

interface CheckoutSidebarProps {
    state: CartState;
    orderSummary: any;
    filteredPromotions: any[];
    isReturningCustomer: boolean;
    shippingLabel: string;
}

const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
    state,
    orderSummary,
    filteredPromotions,
    isReturningCustomer,
    shippingLabel,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-28 space-y-4"
        >
            <div className="bg-white rounded-2xl p-6 border border-brand-brown/10">
                <CheckoutItems state={state} />
            </div>

            <OrderSummary
                orderSummary={orderSummary}
                filteredPromotions={filteredPromotions}
                isReturningCustomer={isReturningCustomer}
                shippingLabel={shippingLabel}
            />
        </motion.div>
    );
};

export default CheckoutSidebar;