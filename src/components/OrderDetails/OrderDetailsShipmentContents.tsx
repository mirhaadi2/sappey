import React from "react";
import { motion } from "framer-motion";
import { OrderItemCard, ItemReviewCard } from "./index";
import { OrderDetailsShipmentContentsProps } from "../../types/OrderDetailsPage";

const OrderDetailsShipmentContents: React.FC<OrderDetailsShipmentContentsProps> = ({
    items,
    orderStatus,
    orderId
}) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-brand-brown rounded-full" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Shipment Inventory</h3>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="divide-y divide-slate-50">
                    {items.map((item, idx) => (
                        <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                            <div className="p-4 hover:bg-slate-50/50 transition-colors">
                                <OrderItemCard item={item} index={idx} isOrderItem={true} />
                            </div>
                            {orderStatus === "DELIVERED" && (
                                <ItemReviewCard
                                    {...item}
                                    orderId={orderId}
                                    productId={item.productId || ""}
                                    productName={item.productName || "Product"}
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OrderDetailsShipmentContents;