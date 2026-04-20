import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Clock,
    XCircle,
    Warning,
    Printer,
    DownloadSimple,
    Phone,
    Copy,
    CheckFat,
    Receipt,
    ShieldCheck,
} from "@phosphor-icons/react";
import { useOrder } from "../api/orders/hooks";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderItemCard from "../components/OrderItemCard";
import ConfirmDialog from "../components/ConfirmDialog";
import RatingAndReview from "../components/RatingAndReview";
import { TIMELINE_STEPS } from "../utils/orderStatusMapper";
import { OrderDetailsSkeleton } from "../components/Skeletons";
import { OrderItemDetail } from "../api/orders";

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "HANDOVER"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "DELIVERY_FAILED"
    | "RTO"
    | "CANCELLED"
    | "FAILED"
    | "REFUNDED";

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useWebsiteAuth();
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
        const statusOrder = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
        let mappedStatus: any = order.status;

        if (["CONFIRMED", "PENDING"].includes(order.status)) {
            mappedStatus = "ORDER_PLACED";
        } else if (["PACKED", "HANDOVER", "PROCESSING"].includes(order.status)) {
            mappedStatus = "PROCESSING";
        } else if (["OUT_FOR_DELIVERY", "SHIPPED"].includes(order.status)) {
            mappedStatus = "SHIPPED";
        }

        const currentIndex = statusOrder.indexOf(mappedStatus);

        return TIMELINE_STEPS.map((step, idx) => ({
            ...step,
            isCompleted: idx < currentIndex || (order.status === "DELIVERED" && idx === currentIndex),
            isActive: idx === currentIndex && order.status !== "DELIVERED",
            isUpcoming: idx > currentIndex,
        }));
    }, [order]);

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100 max-w-sm">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Warning size={40} weight="duotone" className="text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Access Restricted</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">Please authenticate your session to view sensitive logistics data.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
                    >
                        Return to Authentication
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) return <OrderDetailsSkeleton />;

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-4">
                <div className="text-center max-w-md bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <XCircle size={64} weight="duotone" className="mx-auto text-rose-500 mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Record Not Found</h2>
                    <button
                        onClick={() => navigate("/orders")}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <ArrowLeft weight="bold" /> Return to Ledger
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
                
                {/* Refined Navigation Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <button
                        onClick={() => navigate("/orders")}
                        className="group inline-flex items-center gap-2 text-brand-brown/60 hover:text-brand-brown font-bold transition-all text-sm uppercase tracking-widest"
                    >
                        <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-brand-brown transition-colors">
                            <ArrowLeft size={16} weight="bold" />
                        </div>
                        Back to Orders
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-brand-brown hover:text-brand-brown transition-all shadow-sm active:scale-95">
                            <Printer size={18} weight="bold" /> Print Document
                        </button>
                        <button className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                            <DownloadSimple size={18} weight="bold" /> Export Invoice
                        </button>
                    </div>
                </div>

                {/* Hero Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white p-8 md:p-10 mb-8 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-brown/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-slate-100 rounded-lg font-black text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                    System ID
                                </span>
                                <div className={`w-2 h-2 rounded-full ${order?.status === "DELIVERED" ? "bg-emerald-500" : "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]"}`} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-brand-brown tracking-tightest mb-4">
                                {order?.orderNumber}
                            </h1>
                            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock weight="bold" className="text-brand-brown/40" />
                                    {new Date(order?.createdAt ?? new Date()).toLocaleDateString("en-US", { dateStyle: "long" })}
                                </div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <ShieldCheck weight="bold" className="text-emerald-500" />
                                    Verified Transaction
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <OrderStatusBadge
                                status={(order?.status as OrderStatus) ?? "PENDING"}
                                size="lg"
                                showIcon
                                animated
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Timeline Progress */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-brown/10" />
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 text-center md:text-left">
                        Logistics Progression
                    </h3>
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-4">
                        <div className="hidden md:block absolute top-7 left-0 w-full h-[2px] bg-slate-50 -z-0" />
                        {timelineData.map((step) => (
                            <div key={step.status} className="relative z-10 flex flex-row md:flex-col items-center gap-5 md:gap-4 flex-1">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 
                                    ${step.isCompleted 
                                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" 
                                        : step.isActive 
                                            ? "bg-brand-brown border-transparent text-white scale-110 shadow-2xl shadow-brand-brown/30" 
                                            : "bg-white border-slate-100 text-slate-300"}`}
                                >
                                    {step.isCompleted ? <CheckFat size={24} weight="fill" /> : <step.icon size={24} weight={step.isActive ? "bold" : "regular"} />}
                                </div>
                                <div className="text-left md:text-center">
                                    <p className={`text-[11px] font-black uppercase tracking-widest ${step.isUpcoming ? "text-slate-300" : "text-slate-900"}`}>
                                        {step.label}
                                    </p>
                                    {step.isActive && (
                                        <p className="text-[9px] font-black text-brand-brown uppercase mt-1 tracking-tighter animate-pulse">
                                            Current Phase
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                    <Package size={26} weight="duotone" className="text-brand-brown" /> 
                                    Inventory Summary
                                </h2>
                                <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                                    {order?.items?.length ?? 0} SKUs
                                </span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {order?.items?.map((item: OrderItemDetail, idx: number) => (
                                    <div key={String(item?.id ?? idx)} className="px-6 hover:bg-slate-50/50 transition-colors">
                                        <OrderItemCard item={item} index={idx} isOrderItem={true} />
                                    </div>
                                ))}
                            </div>

                            {/* Applied Promotion */}
                            {order?.metadata?.promotion && (
                                <div className="m-8 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                        <Package size={28} weight="fill" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Loyalty Perk Applied</p>
                                        <h4 className="text-base font-black text-slate-900">{order.metadata.promotion.title}</h4>
                                    </div>
                                    <div className="ml-auto px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase tracking-tighter">
                                        Complimentary
                                    </div>
                                </div>
                            )}

                            {/* Financial Summary */}
                            <div className="p-8 md:p-10 bg-brand-brown text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-[-20deg] translate-x-16" />
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-brand-cream/60 font-bold text-sm">
                                            <span>Subtotal</span>
                                            <span className="text-white">₹{parseFloat(order?.totalAmount ?? "0").toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-brand-cream/60 font-bold text-sm">
                                            <span>Logistics Fee</span>
                                            <span className="text-white">₹{parseFloat(order?.shippingCost ?? "0").toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-brand-cream/60 font-bold text-sm">
                                            <span>Taxation (GST)</span>
                                            <span className="text-white">₹{parseFloat(order?.taxAmount ?? "0").toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end md:items-end md:text-right border-t md:border-t-0 md:border-l border-brand-cream/20 pt-6 md:pt-0 md:pl-10">
                                        <p className="text-[10px] font-black text-brand-cream/60 uppercase tracking-[0.3em] mb-2">Grand Total Settlement</p>
                                        <h3 className="text-5xl font-black tracking-tightest mb-2">
                                            ₹{parseFloat(order?.finalAmount ?? "0").toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                        </h3>
                                        <div className="flex items-center gap-2 md:justify-end text-brand-cream/80 text-xs font-bold uppercase tracking-widest">
                                            <Receipt size={16} /> Secure Payment • INR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-8">
                        {/* Recipient Details */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <div className="p-2 bg-brand-brown/5 rounded-lg text-brand-brown">
                                    <MapPin size={20} weight="duotone" />
                                </div>
                                Consignee Detail
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</p>
                                    <p className="text-base font-black text-slate-900 uppercase">{currentUser?.name ?? "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Shipping Destination</p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                        {order?.shippingAddressLine1}, {order?.shippingCity}
                                        <br />
                                        <span className="text-slate-900">{order?.shippingState} — {order?.shippingPostalCode}</span>
                                    </p>
                                </div>
                                {order?.shippingPhone && (
                                    <button
                                        onClick={() => copyToClipboard(String(order?.shippingPhone), "phone")}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-brand-brown transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Phone size={20} className="text-slate-400 group-hover:text-brand-brown" />
                                            <span className="text-sm font-black text-slate-700">{order?.shippingPhone}</span>
                                        </div>
                                        {copiedField === "phone" ? (
                                            <CheckFat className="text-emerald-500" weight="fill" />
                                        ) : (
                                            <Copy size={18} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Settlement Status */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <div className="p-2 bg-brand-brown/5 rounded-lg text-brand-brown">
                                    <CreditCard size={20} weight="duotone" />
                                </div>
                                Settlement
                            </h3>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Status</span>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                                    order?.paymentStatus === "COMPLETED" 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}>
                                    {order?.paymentStatus ?? "PENDING"}
                                </span>
                            </div>
                        </div>

                        {/* Rating Component */}
                        {order?.status === "DELIVERED" && (
                            <RatingAndReview
                                orderId={orderId || ""}
                                orderItems={order?.items?.map(item => ({
                                    orderItemId: item.id || item.productId,
                                    productId: item.productId,
                                    productName: item.productName || "Product",
                                    productImage: item.productImage,
                                    variant: item.variantLabel
                                })) || []}
                            />
                        )}

                        {/* Order Cancellation */}
                        {order?.status !== "DELIVERED" && order?.status !== "CANCELLED" && (
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                className="w-full py-5 border border-slate-200 text-slate-400 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-300"
                            >
                                Terminate Transaction
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showCancelConfirm && (
                    <ConfirmDialog
                        isOpen={showCancelConfirm}
                        onCancel={() => setShowCancelConfirm(false)}
                        onConfirm={() => {
                            setShowCancelConfirm(false);
                            console.log("Cancel Request for:", orderId);
                        }}
                        type="danger"
                        title="Authorize Cancellation?"
                        description="This action will disrupt the active logistics chain and initiate a refund sequence. This record will be permanently flagged."
                        confirmText="Confirm Termination"
                        cancelText="Maintain Shipment"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;