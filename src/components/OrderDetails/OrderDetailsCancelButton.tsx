import React from "react";
import { OrderDetailsCancelButtonProps } from "../../types/OrderDetailsPage";

const OrderDetailsCancelButton: React.FC<OrderDetailsCancelButtonProps> = ({ orderStatus, onCancel }) => {
    if (orderStatus === "DELIVERED" || orderStatus === "CANCELLED" || orderStatus === "SHIPPED") {
        return null;
    }

    return (
        <button
            onClick={onCancel}
            className="w-full py-6 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] transition-all border border-dashed border-slate-200 hover:border-rose-200"
        >
            Request Cancellation
        </button>
    );
};

export default OrderDetailsCancelButton;