import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Package, MapPin, XCircle,
    Phone, Copy, CheckFat, Receipt, CaretRight, ShieldCheck,
    Truck, SealCheck, Fingerprint, CalendarBlank
} from "@phosphor-icons/react";
import { useOrder } from "../api/orders/hooks";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import OrderItemCard from "../components/OrderItemCard";
import ItemReviewCard from "../components/ItemReviewCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { TIMELINE_STEPS } from "../utils/orderStatusMapper";
import { OrderDetailsSkeleton } from "../components/Skeletons";
import { OrderItemDetail } from "../api/orders";
import LogisticsTimeline from "../components/LogisticsTimeline";

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
        let mappedStatus: string = order.status;

        if (["CONFIRMED", "PENDING"].includes(order.status)) mappedStatus = "ORDER_PLACED";
        else if (["PACKED", "HANDOVER", "PROCESSING"].includes(order.status)) mappedStatus = "PROCESSING";
        else if (["OUT_FOR_DELIVERY", "SHIPPED"].includes(order.status)) mappedStatus = "SHIPPED";

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
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 bg-white rounded-[3rem] shadow-2xl shadow-brand-brown/5 border border-slate-100 max-w-sm mx-4">
                    <div className="w-20 h-20 bg-brand-cream/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <Fingerprint size={40} weight="duotone" className="text-brand-brown" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Identity Required</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed text-sm">Authentication is required to access this secure logistics manifest.</p>
                    <button onClick={() => navigate("/")} className="w-full py-4 bg-brand-brown text-white rounded-2xl font-bold shadow-lg shadow-brand-brown/20 hover:bg-slate-900 transition-all active:scale-95 uppercase text-xs tracking-widest">
                        Verify Identity
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isLoading) return <OrderDetailsSkeleton />;

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-4 text-center">
                <div className="max-w-md">
                    <XCircle size={64} weight="duotone" className="mx-auto text-rose-500 mb-6" />
                    <h2 className="text-2xl font-black text-slate-900">Trace Failed</h2>
                    <p className="text-slate-500 mt-2 mb-8">This manifest does not exist in our digital archives.</p>
                    <button onClick={() => navigate("/orders")} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 font-sans selection:bg-brand-cream selection:text-brand-brown">
            <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate("/orders")} className="p-2 hover:bg-slate-50 rounded-full transition-all border border-slate-100 group">
                            <ArrowLeft size={18} weight="bold" className="text-slate-400 group-hover:text-brand-brown" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                                <span>Manifest</span>
                                <CaretRight size={8} weight="bold" className="text-slate-300" />
                                <span className="text-brand-brown">{order.orderNumber}</span>
                            </div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Order Architecture</h1>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                        <ShieldCheck size={16} weight="fill" className="text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secured Node</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Quick Stats Header */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon={Package} label="SKU Count" value={`${order?.items?.length} Items`} />
                            <StatCard icon={CalendarBlank} label="Ordered" value={new Date(order?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} />
                            <StatCard icon={Truck} label="Carrier" value="Premium Logistics" />
                            <StatCard icon={SealCheck} label="Authenticity" value="Verified" />
                        </div>

                        {/* Shipment Contents */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-brand-brown rounded-full" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Shipment Inventory</h3>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <div className="divide-y divide-slate-50">
                                    {order?.items?.map((item: OrderItemDetail, idx: number) => (
                                        <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                                            <div className="p-4 hover:bg-slate-50/50 transition-colors">
                                                <OrderItemCard item={item} index={idx} isOrderItem={true} />
                                            </div>
                                            {order.status === "DELIVERED" && (
                                                <ItemReviewCard
                                                    {...item}
                                                    orderId={orderId || ""}
                                                    productId={item.productId || ""}
                                                    productName={item.productName || "Product"}
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Financial Card - Minimal Glass Style */}
                        <section className="bg-brand-brown rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl shadow-brand-brown/20">
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Receipt size={180} weight="duotone" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                <div className="space-y-6">
                                    <div>
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
                                    {/* <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-cream/40">
                                        <ShieldCheck size={18} weight="fill" />
                                        Encrypted Secure Payment
                                    </div> */}
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

                    {/* Sidebar Information */}
                    <div className="lg:col-span-4 space-y-8">
                        <LogisticsTimeline timelineData={timelineData} />

                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xl shadow-slate-200/30">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Shipping Dossier</h3>
                            <div className="space-y-10">
                                <div>
                                    <p className="text-[9px] font-black text-brand-brown/50 uppercase tracking-widest mb-3">Recipient Identity</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                            <Fingerprint size={20} className="text-slate-400" />
                                        </div>
                                        <p className="text-lg font-black text-slate-900 tracking-tight">{currentUser?.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[9px] font-black text-brand-brown/50 uppercase tracking-widest mb-3">Destination</p>
                                    <div className="flex gap-4">
                                        <MapPin size={22} weight="duotone" className="text-slate-300 shrink-0 mt-1" />
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                                            {order.shippingAddressLine1}, {order.shippingCity}<br />
                                            <span className="text-slate-900 font-black">{order.shippingState} {order.shippingPostalCode}</span>
                                        </p>
                                    </div>
                                </div>

                                {order.shippingPhone && (
                                    <button
                                        onClick={() => copyToClipboard(String(order.shippingPhone), "phone")}
                                        className="w-full flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:border-brand-brown transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-brand-brown/20 shadow-sm">
                                                <Phone size={16} className="text-slate-400 group-hover:text-brand-brown" />
                                            </div>
                                            <span className="text-sm font-black text-slate-800">{order.shippingPhone}</span>
                                        </div>
                                        {copiedField === "phone" ? (
                                            <CheckFat className="text-emerald-500" weight="fill" />
                                        ) : (
                                            <Copy size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Secondary Action */}
                        {order.status !== "DELIVERED" && order.status !== "CANCELLED" && order.status !== "SHIPPED" && (
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                className="w-full py-6 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] transition-all border border-dashed border-slate-200 hover:border-rose-200"
                            >
                                Request Cancellation
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showCancelConfirm && (
                    <ConfirmDialog
                        isOpen={showCancelConfirm}
                        onCancel={() => setShowCancelConfirm(false)}
                        onConfirm={() => { setShowCancelConfirm(false); }}
                        type="danger"
                        title="Confirm Cancellation"
                        description="This will halt the current logistics process and trigger a refund to your original payment method."
                        confirmText="Revoke Order"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
        <Icon size={22} weight="duotone" className="text-brand-brown" />
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </div>
);

export default OrderDetailsPage;