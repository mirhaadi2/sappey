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
    CaretRight,
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
import LogisticsTimeline from "../components/LogisticsTimeline";

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
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/orders")}
                            className=" text-slate-600 hover:border-brand-brown hover:text-brand-brown transition-all shadow-sm active:scale-90"
                        >
                            <ArrowLeft size={20} weight="bold" />
                        </button>
                        <div>
                            {/* <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Customer Portal</h4> */}
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <span className="opacity-40">Orders</span>
                                <CaretRight size={12} weight="bold" className="opacity-30" />
                                <span className="text-brand-brown">{order?.orderNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-start lg:items-end gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} weight="duotone" className="text-brand-brown" />
                                Placed {new Date(order?.createdAt ?? new Date()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex flex-col items-start lg:items-end gap-4">
                                <OrderStatusBadge
                                    status={(order?.status as OrderStatus) ?? "PENDING"}
                                    size="md"
                                    showIcon
                                    animated
                                />
                            </div>
                        </div>

                        {/* <button className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-brand-brown transition-all shadow-sm active:scale-95">
                            <Printer size={18} weight="bold" /> Print
                        </button>
                        <button className="flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                            <DownloadSimple size={18} weight="bold" /> Invoice
                        </button> */}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Inventory Side */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-brown/5 flex items-center justify-center text-brand-brown">
                                        <Package size={24} weight="duotone" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Contents</h2>
                                        <p className="text-xs font-bold text-slate-400">Items and quantity overview</p>
                                    </div>
                                </div>
                                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    {order?.items?.length ?? 0} SKUs
                                </span>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {order?.items?.map((item: OrderItemDetail, idx: number) => (
                                    <div key={String(item?.id ?? idx)} className="px-4 transition-colors border-b border-slate-100">
                                        <OrderItemCard item={item} index={idx} isOrderItem={true} />
                                    </div>
                                ))}
                            </div>

                            {/* Loyalty / Promotion Segment */}
                            {order?.metadata?.promotion && (
                                <div className="m-10 p-8 bg-emerald-50/40 border border-emerald-100 rounded-[2.5rem] flex items-center gap-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-full bg-emerald-100/20 skew-x-[-20deg] translate-x-10 group-hover:translate-x-5 transition-transform duration-700" />
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 shrink-0">
                                        <Package size={32} weight="fill" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Special Promotion Applied</p>
                                        <h4 className="text-lg font-black text-slate-900">{order.metadata.promotion.title}</h4>
                                    </div>
                                    <div className="ml-auto relative z-10">
                                        <div className="px-5 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">
                                            Complimentary
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Financial Summary */}
                            <div className="p-1 md:p-1.5">
                                <div className="bg-brand-brown rounded-2xl p-8 text-white relative overflow-hidden">
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 -mr-32" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                        <div className="space-y-5">
                                            <div className="flex justify-between items-center pb-4 border-b border-white/10 text-brand-cream/60 font-bold text-sm">
                                                <span>Subtotal</span>
                                                <span className="text-white">₹{parseFloat(order?.totalAmount ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-white/10 text-brand-cream/60 font-bold text-sm">
                                                <span>Logistics Fee</span>
                                                <span className="text-white">₹{parseFloat(order?.shippingCost ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-brand-cream/60 font-bold text-sm">
                                                <span>Taxation (GST)</span>
                                                <span className="text-white">₹{parseFloat(order?.taxAmount ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end md:items-end md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                                            <p className="text-[10px] font-black text-brand-cream/40 uppercase tracking-[0.4em] mb-3">Amount Payable</p>
                                            <h3 className="text-3xl font-black tracking-tightest mb-4">
                                                ₹{parseFloat(order?.finalAmount ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </h3>
                                            <div className="flex items-center gap-2.5 md:justify-end text-brand-cream/60 text-[10px] font-black uppercase tracking-widest">
                                                <Receipt size={18} />
                                                Verified Transaction • INR
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-4">

                        <LogisticsTimeline timelineData={timelineData} />

                        <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
                                <MapPin size={22} weight="duotone" className="text-brand-brown" />
                                Delivery Details
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recipient</p>
                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{currentUser?.name ?? "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipping Address</p>
                                    <p className="text-[15px] font-bold text-slate-600 leading-relaxed">
                                        {order?.shippingAddressLine1}, {order?.shippingCity}
                                        <br />
                                        <span className="text-slate-900 font-black">{order?.shippingState} {order?.shippingPostalCode}</span>
                                    </p>
                                </div>
                                {order?.shippingPhone && (
                                    <button
                                        onClick={() => copyToClipboard(String(order?.shippingPhone), "phone")}
                                        className="w-full flex items-center justify-between p-2 px-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-brown transition-all group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-white rounded-xl shadow-sm">
                                                <Phone size={20} className="text-slate-400 group-hover:text-brand-brown" />
                                            </div>
                                            <span className="text-sm font-black text-slate-800">{order?.shippingPhone}</span>
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

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                                <CreditCard size={22} weight="duotone" className="text-brand-brown" />
                                Settlement
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</span>
                                    <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-widest border ${order?.paymentStatus === "COMPLETED"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                        }`}>
                                        {order?.paymentStatus ?? "PENDING"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Interaction */}
                        {order?.status === "DELIVERED" && (
                            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-100">
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
                            </div>
                        )}

                        {/* Cancellation Logic */}
                        {order?.status !== "DELIVERED" && order?.status !== "CANCELLED" && (
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                className="w-full py-6 px-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/30 transition-all duration-500 active:scale-[0.98]"
                            >
                                Request Cancellation
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Modals */}
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
                        description="This action will disrupt the active logistics chain and initiate a refund sequence. This record will be permanently flagged in your transaction history."
                        confirmText="Terminate Order"
                        cancelText="Keep Order"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;