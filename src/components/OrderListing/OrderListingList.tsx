import React from "react";
import { motion } from "framer-motion";
import { Tag, Truck, Clock, XCircle, CheckCircle, CaretRight } from "@phosphor-icons/react";
import { OrderListingListProps } from "../../types/OrderListingPage";

const OrderListingList: React.FC<OrderListingListProps> = ({ orders, getStatusConfig, onViewDetails }) => {
    if (orders.length === 0) {
        return (
            <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Tag size={80} weight="duotone" className="mx-auto text-slate-100 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Nothing to show</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">We couldn't find any orders matching your current criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orders.map((order, idx) => {
                const config = getStatusConfig(order.status);
                const statusBgClass = config?.bg.replace("bg-", "bg-") || "bg-slate-400";

                return (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="group relative bg-white rounded-2xl border border-slate-100 flex flex-col hover:border-[#3d2b1f]/20 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(61,43,31,0.12)]"
                    >
                        <div className="p-6 pb-4 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${statusBgClass}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${config?.text ?? "text-slate-500"}`}>
                                        {config?.label || order.status}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black text-[#3d2b1f] tracking-tight group-hover:translate-x-1 transition-transform">
                                    {order.orderNumber || order.id.slice(-6).toUpperCase()}
                                </h4>
                                <p className="text-xs text-slate-400 font-bold mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long" })}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-2xl text-center min-w-0 sm:min-w-[100px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Amount</p>
                                <div className="flex items-center justify-center gap-0.5 text-[#3d2b1f] font-black text-lg">
                                    {order.finalAmount ? Number(order.finalAmount).toLocaleString() : "0"}
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-3 mx-6 bg-[#FAF9F6] rounded-[2rem] border border-slate-50 flex items-center justify-between relative overflow-hidden">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                                    <Clock size={20} weight="duotone" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dispatch</span>
                                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-[80px]">Sappey Hub</span>
                                </div>
                            </div>

                            <div className="flex-1 px-4 flex flex-col items-center gap-2">
                                <Truck size={18} weight="duotone" className={`transition-all duration-1000 ${order.status === "DELIVERED" ? "text-[#3d2b1f] ml-auto" : "text-slate-300"}`} />
                                <div className="w-full h-[3px] bg-slate-200 rounded-full relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: order.status === "DELIVERED" ? "100%" : order.status === "SHIPPED" ? "60%" : "20%" }}
                                        className="absolute inset-y-0 left-0 bg-[#3d2b1f]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 relative z-10 text-right">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery</span>
                                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-[80px]">Residence</span>
                                </div>
                                <div className={`w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center ${order.status === "DELIVERED" ? "bg-[#3d2b1f] text-white" : "bg-white text-slate-200"}`}>
                                    {order.status === "CANCELLED" ? <XCircle size={20} weight="fill" /> : <CheckCircle size={20} weight="fill" />}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Package</span>
                                    <span className="text-xs font-bold text-slate-600">{order.itemsCount} Premium Items</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onViewDetails(order.id)}
                                className="px-6 py-2 bg-[#65442e] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brown-900/10 hover:bg-black hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 group/btn"
                            >
                                View Details
                                <CaretRight weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default OrderListingList;
