import React from "react";
import { motion } from "framer-motion";
import { Tag, Truck, Clock, XCircle, CheckCircle, CaretRight } from "@phosphor-icons/react";
import { OrderListingListProps } from "../../types/OrderListingPage";

const OrderListingList: React.FC<OrderListingListProps> = ({ orders, getStatusConfig, onViewDetails }) => {
    if (orders?.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100"
            >
                <Tag size={80} weight="duotone" className="mx-auto text-slate-100 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Orders Found</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    We couldn't find any orders matching your criteria. Try adjusting your filters or search query.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders?.map((order, idx) => {
                const config = getStatusConfig(order.status);

                // Safety check for styles
                const statusBgClass = config?.bg || "bg-slate-400";
                const statusTextClass = config?.text || "text-slate-500";

                return (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.45 }}
                        className="group relative bg-white rounded-[24px] border border-[#EFE7DC] p-4 px-6 hover:shadow-[0_25px_70px_rgba(0,0,0,0.06)] transition-all duration-500"
                    >

                        {/* TOP */}
                        <div className="flex items-start justify-between gap-5">

                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-3">

                                    <div className={`w-2 h-2 rounded-full ${statusBgClass}`} />

                                    <span className={`text-[10px] tracking-[0.25em] uppercase font-semibold ${statusTextClass}`}>
                                        {config?.label || order.status}
                                    </span>
                                </div>

                                <h3 className="font-serif text-[1.6rem] text-[#1A1815] leading-none">
                                    {order.orderNumber || order.id.slice(-6).toUpperCase()}
                                </h3>

                                <p className="mt-2 text-[13px] text-[#7A746B]">
                                    Placed on{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            {/* PRICE */}
                            <div className="text-right shrink-0">

                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9489] font-semibold mb-1">
                                    Total
                                </p>

                                <p className="font-serif text-2xl text-[#1A1815]">
                                    ₹{order.finalAmount
                                        ? Number(order.finalAmount).toLocaleString()
                                        : "0"}
                                </p>
                            </div>
                        </div>

                        {/* DIVIDER */}
                        {/* <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#B08A37]/20 to-transparent" /> */}

                        {/* TRACKING */}
                        <div className="flex items-center gap-5 mt-8">

                            {/* ORIGIN */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9489] mb-1">
                                    Origin
                                </p>

                                <p className="text-sm text-[#1A1815] font-medium">
                                    Warehouse
                                </p>
                            </div>

                            {/* PROGRESS */}
                            <div className="flex-1 relative">

                                <div className="h-[3px] rounded-full bg-[#ECE6DD] overflow-hidden">

                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width:
                                                order.status === "DELIVERED"
                                                    ? "100%"
                                                    : order.status === "SHIPPED"
                                                        ? "65%"
                                                        : "25%",
                                        }}
                                        className="h-full rounded-full bg-gradient-to-r from-[#B08A37] to-[#D4AF37]"
                                    />
                                </div>

                                <Truck
                                    size={18}
                                    weight="fill"
                                    className={`absolute -top-[7px] transition-all duration-700 ${order.status === "DELIVERED"
                                            ? "right-0 text-[#B08A37]"
                                            : "left-[55%] text-[#B08A37]"
                                        }`}
                                />
                            </div>

                            {/* DESTINATION */}
                            <div className="text-right">

                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9489] mb-1">
                                    Destination
                                </p>

                                <p className="text-sm text-[#1A1815] font-medium">
                                    Residence
                                </p>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-8 pt-2 flex items-center justify-between">

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9489] mb-1">
                                    Order Summary
                                </p>

                                <p className="text-sm text-[#1A1815] font-medium">
                                    {order.itemsCount || 0}{" "}
                                    {Number(order.itemsCount) === 1
                                        ? "Premium Item"
                                        : "Premium Items"}
                                </p>
                            </div>

                            <button
                                onClick={() => onViewDetails(order.id)}
                                className="group/button inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#1A1815] hover:text-[#B08A37] transition-colors"
                            >
                                Track Order

                                <CaretRight
                                    size={14}
                                    weight="bold"
                                    className="group-hover/button:translate-x-1 transition-transform"
                                />
                            </button>
                        </div>

                    </motion.div>
                );
            })}
        </div>
    );
};

export default OrderListingList;