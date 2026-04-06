import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Package, MapPin, CreditCard, Clock, 
    XCircle, Warning, Printer, DownloadSimple, 
    Phone, Copy, CheckFat
} from "@phosphor-icons/react";
import { useOrder } from "../api/orders/hooks";
import { useAuth } from "../context/AuthContext";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderItemCard from "../components/OrderItemCard";
import {TIMELINE_STEPS } from "../utils/orderStatusMapper";
import { OrderDetailsSkeleton } from "../components/Skeletons";

// --- Types ---
type OrderStatus = 
    | "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "HANDOVER" 
    | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "DELIVERY_FAILED" 
    | "RTO" | "CANCELLED" | "FAILED" | "REFUNDED";

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { order, isLoading, error } = useOrder(orderId || "", !!orderId);

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const copyToClipboard = useCallback((text: string, field: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    }, []);

    const timelineData = useMemo(() => {
        if (!order) return [];
        const statusOrder: string[] = TIMELINE_STEPS.map(s => s.status);
        
        // Logical mapping for internal steps (PACKED/HANDOVER fall under PROCESSING in the visual timeline)
        let mappedStatus = order.status;
        if (["PACKED", "HANDOVER"].includes(order?.status ?? '')) mappedStatus = "PROCESSING";
        if (["OUT_FOR_DELIVERY"].includes(order?.status ?? '')) mappedStatus = "SHIPPED";

        const currentIndex = statusOrder.indexOf(mappedStatus);

        return TIMELINE_STEPS.map((step, idx) => ({
            ...step,
            isCompleted: idx < currentIndex || (order?.status === "DELIVERED" && idx === currentIndex),
            isActive: idx === currentIndex && order?.status !== "DELIVERED",
            isUpcoming: idx > currentIndex
        }));
    }, [order]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-sm">
                    <Warning size={48} weight="duotone" className="mx-auto text-amber-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
                    <p className="text-slate-500 mb-6">Please log in to track enterprise shipments.</p>
                    <button onClick={() => navigate("/")} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">Return to Login</button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <OrderDetailsSkeleton />;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
                    <XCircle size={64} weight="duotone" className="mx-auto text-rose-500 mb-4" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Order Not Located</h2>
                    <button onClick={() => navigate("/orders")} className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                        <ArrowLeft weight="bold" /> Back to Ledger
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <button onClick={() => navigate("/orders")} className="group flex items-center gap-2 text-slate-500 hover:text-[#9a5d2e] font-bold transition-all text-sm uppercase tracking-wider">
                        <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        Back to All Orders
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition shadow-sm">
                            <Printer size={18} weight="bold" /> Print Record
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                            <DownloadSimple size={18} weight="bold" /> Get Invoice
                        </button>
                    </div>
                </div>

                {/* Status Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] border-2 p-6 px-10 mb-8 bg-white border-brand-brown/5 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-brand-brown/40">Tracking Reference</span>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${order?.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            </div>
                            <h1 className="text-3xl font-black text-brand-brown tracking-tighter mb-2">#{order?.orderNumber}</h1>
                            <p className="text-slate-500 font-bold text-sm flex items-center gap-2">
                                <Clock weight="bold" className="text-brand-brown/30" />
                                {new Date(order?.createdAt ?? new Date()).toLocaleDateString("en-US", { dateStyle: 'full' })}
                            </p>
                        </div>
                        <OrderStatusBadge status={(order?.status as OrderStatus) ?? 'PENDING'} size="lg" showIcon animated />
                    </div>
                </motion.div>

                {/* Timeline Progress */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-8 shadow-sm">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 text-center">Fulfillment Lifecycle</h3>
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 px-4">
                        <div className="hidden md:block absolute top-7 left-0 w-full h-[2px] bg-slate-100 -z-0" />
                        {timelineData.map((step) => (
                            <div key={step.status} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 flex-1">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 
                                    ${step.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 
                                      step.isActive ? 'bg-[#9a5d2e] border-none text-white scale-110 shadow-lg' : 
                                      'bg-white border-slate-200 text-slate-300'}`}>
                                    {step.isCompleted ? <CheckFat size={24} weight="fill" /> : <step.icon size={24} weight={step.isActive ? "bold" : "regular"} />}
                                </div>
                                <div className="text-left md:text-center">
                                    <p className={`text-xs font-black uppercase tracking-tighter ${step.isUpcoming ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                                    {step.isActive && <p className="text-[10px] font-bold text-[#9a5d2e] uppercase mt-1 animate-pulse">In Progress</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                    <Package size={24} weight="duotone" className="text-[#9a5d2e]" /> Consignment Items
                                </h2>
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase">
                                    {order?.items?.length ?? 0} Units
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {order?.items?.map((item: any, idx: number) => (
                                    <div key={item?.id ?? idx} className="p-8">
                                        <OrderItemCard item={item} index={idx} isOrderItem={true} />
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-[#9a5d2e] text-brand-cream rounded-b-3xl">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-slate-400 font-bold text-sm">
                                        <span className="text-brand-cream">Subtotal</span>
                                        <span className="text-white">₹{parseFloat(order?.totalAmount ?? '0').toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold text-sm">
                                        <span className="text-brand-cream">Shipping & Handling</span>
                                        <span className="text-white">₹{parseFloat(order?.shippingCost ?? '0').toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold text-sm">
                                        <span className="text-brand-cream">Applicable Tax</span>
                                        <span className="text-white">₹{parseFloat(order?.taxAmount ?? '0').toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-brand-cream flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-brand-cream uppercase tracking-[0.2em] mb-1">Grand Total</p>
                                        <h3 className="text-4xl font-black tracking-tighter">₹{parseFloat(order?.finalAmount ?? '0').toFixed(2)}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-brand-cream uppercase tracking-widest mb-1">Currency</p>
                                        <p className="font-bold ">INR (Indian Rupee)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Delivery Info */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin size={20} weight="duotone" className="text-[#9a5d2e]" /> Destination
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Recipient</p>
                            <p className="text-sm font-black text-slate-900 uppercase mb-4">{user?.name ?? 'N/A'}</p>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">
                                {order?.shippingAddressLine1 ?? ''}, {order?.shippingCity ?? ''}<br />
                                {order?.shippingState ?? ''} — {order?.shippingPostalCode ?? ''}
                            </p>
                            {order?.shippingPhone && (
                                <button onClick={() => copyToClipboard(String(order?.shippingPhone), "phone")} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-700">{order?.shippingPhone}</span>
                                    </div>
                                    {copiedField === 'phone' ? <CheckFat className="text-emerald-500" weight="fill" /> : <Copy className="text-slate-300" />}
                                </button>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <CreditCard size={20} weight="duotone" className="text-[#9a5d2e]" /> Settlement
                            </h3>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-3">
                                <span className="text-xs font-bold text-slate-500">Status</span>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${(order?.paymentStatus === 'COMPLETED') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {order?.paymentStatus ?? 'PENDING'}
                                </span>
                            </div>
                        </div>

                        {/* Cancellation Logic */}
                        {(order?.status !== "DELIVERED" && order?.status !== "CANCELLED") && (
                            <button onClick={() => setShowCancelConfirm(true)} className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:border-rose-100 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                Terminate Transaction
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showCancelConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl">
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                                <Warning size={32} weight="duotone" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Cancellation?</h3>
                            <p className="text-slate-500 font-medium mb-8">This action will halt the logistics flow and is logged for audit purposes.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowCancelConfirm(false)} className="py-3 bg-slate-100 text-slate-900 rounded-xl font-black text-xs uppercase">Abort</button>
                                <button onClick={() => { setShowCancelConfirm(false); console.log("Cancel Request for:", orderId); }} className="py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-rose-100">Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;