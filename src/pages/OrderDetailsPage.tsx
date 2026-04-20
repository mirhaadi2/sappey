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
    Phone,
    Copy,
    CheckFat,
    Receipt,
    CaretRight,
    TrendUp,
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
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 max-w-sm mx-4"
                >
                    <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                        <Warning size={48} weight="duotone" className="text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Security Check</h2>
                    <p className="text-slate-500 mb-10 leading-relaxed text-sm">Please authenticate your session to access order logistics and private records.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200"
                    >
                        Sign In to Proceed
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isLoading) return <OrderDetailsSkeleton />;

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-4">
                <div className="text-center max-w-md bg-white p-16 rounded-[3rem] border border-slate-100 shadow-2xl">
                    <XCircle size={80} weight="duotone" className="mx-auto text-rose-500 mb-8" />
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Trace Failed</h2>
                    <p className="text-slate-500 mb-10 text-sm">The requested order manifest could not be retrieved from our servers.</p>
                    <button
                        onClick={() => navigate("/orders")}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                        <ArrowLeft weight="bold" /> Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFD] pb-24">
            {/* Elegant Header Navigation */}
            <div className="sticky top-0 z-30 bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-brand-brown hover:border-brand-brown transition-all shadow-sm group"
                        >
                            <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                <span>Manifest</span>
                                <CaretRight size={10} weight="bold" />
                                <span className="text-brand-brown">Tracking</span>
                            </div>
                            <h1 className="text-xl font-black text-slate-900 leading-none">#{order?.orderNumber}</h1>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Clock size={16} weight="duotone" className="text-brand-brown" />
                                {new Date(order?.createdAt ?? "").toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <OrderStatusBadge
                            status={(order?.status as OrderStatus) ?? "PENDING"}
                            size="lg"
                            showIcon
                            animated
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-brown/5 flex items-center justify-center text-brand-brown">
                                    <Package size={24} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo Volume</p>
                                    <p className="text-lg font-black text-slate-900">{order?.items?.length ?? 0} SKUs</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={24} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protection</p>
                                    <p className="text-lg font-black text-slate-900">Insured</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <TrendUp size={24} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</p>
                                    <p className="text-lg font-black text-slate-900">Standard</p>
                                </div>
                            </div>
                        </div>

                        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Order Contents</h3>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Verified Manifest
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50 px-4">
                                {order?.items?.map((item: OrderItemDetail, idx: number) => (
                                    <motion.div 
                                        key={item.id || idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <OrderItemCard item={item} index={idx} isOrderItem={true} />
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Premium Promotion Banner */}
                            {order?.metadata?.promotion && (
                                <div className="m-6 p-8 bg-slate-900 rounded-[2rem] text-white flex items-center gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-full bg-brand-brown/20 skew-x-[-20deg] translate-x-20" />
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-cream shadow-inner border border-white/10 shrink-0">
                                        <Package size={28} weight="fill" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold text-brand-cream/60 uppercase tracking-[0.2em] mb-1">Exclusive Tier Benefit</p>
                                        <h4 className="text-lg font-black tracking-tight">{order.metadata.promotion.title}</h4>
                                    </div>
                                    <div className="ml-auto relative z-10 hidden sm:block">
                                        <div className="px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">
                                            Complimentary
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="bg-brand-brown rounded-2xl p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-brown/20">
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Receipt size={180} weight="duotone" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-white/10">
                                        <h4 className="text-[10px] font-black text-brand-cream/40 uppercase tracking-[0.3em] mb-6">Settlement Breakdown</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-brand-cream/80 font-bold text-sm">
                                                <span>Subtotal</span>
                                                <span className="text-white">₹{parseFloat(order?.totalAmount ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-brand-cream/80 font-bold text-sm">
                                                <span>Logistics & Handling</span>
                                                <span className="text-white">₹{parseFloat(order?.shippingCost ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-brand-cream/80 font-bold text-sm">
                                                <span>Taxation (GST)</span>
                                                <span className="text-white">₹{parseFloat(order?.taxAmount ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-cream/40">
                                        <ShieldCheck size={18} weight="fill" />
                                        Encrypted Secure Payment
                                    </div>
                                </div>
                                
                                <div className="flex flex-col justify-center md:items-end md:text-right">
                                    <p className="text-[10px] font-black text-brand-cream/40 uppercase tracking-[0.4em] mb-4">Final Amount</p>
                                    <h3 className="text-5xl font-black tracking-tighter mb-6">
                                        ₹{parseFloat(order?.finalAmount ?? "0").toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </h3>
                                    <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        {/* Invoice Generated */}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                        <LogisticsTimeline timelineData={timelineData} />

                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-brand-brown/5 flex items-center justify-center text-brand-brown">
                                    <MapPin size={24} weight="duotone" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Delivery Intel</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Recipient</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight">{currentUser?.name ?? "N/A"}</p>
                                </div>
                                
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipping Hub</p>
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed">
                                        {order?.shippingAddressLine1}, {order?.shippingCity}
                                        <br />
                                        <span className="text-slate-900 font-black">{order?.shippingState} {order?.shippingPostalCode}</span>
                                    </p>
                                </div>

                                {order?.shippingPhone && (
                                    <button
                                        onClick={() => copyToClipboard(String(order?.shippingPhone), "phone")}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-brown transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Phone size={20} className="text-slate-400 group-hover:text-brand-brown transition-colors" />
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

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <CreditCard size={24} weight="duotone" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Gateway</h3>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border shadow-sm ${order?.paymentStatus === "COMPLETED"
                                    ? "bg-white text-emerald-600 border-emerald-100"
                                    : "bg-white text-amber-600 border-amber-100"
                                    }`}>
                                    {order?.paymentStatus ?? "PENDING"}
                                </span>
                            </div>
                        </div>

                        {order?.status === "DELIVERED" && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200"
                            >
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
                            </motion.div>
                        )}

                        {order?.status !== "DELIVERED" && order?.status !== "CANCELLED" && (
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                className="w-full py-6 px-4 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-500 active:scale-[0.98]"
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
                        description="This action will terminate the logistics chain and initiate the refund sequence. This cannot be undone."
                        confirmText="Terminate Order"
                        cancelText="Retain Order"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;