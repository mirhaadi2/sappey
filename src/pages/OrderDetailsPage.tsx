import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Fingerprint, CheckCircle } from "@phosphor-icons/react";
import { useOrder } from "../api/orders/hooks";
import { useOrders } from "../api/orders/hooks";
import { useWebsiteAuth } from "../context/WebsiteAuthContext";
import { ConfirmDialog } from "../components/common";
import { TIMELINE_STEPS } from "../utils/orderStatusMapper";
import { OrderDetailsSkeleton } from "../components/Skeletons";
import {
    OrderDetailsHeader,
    OrderDetailsStats,
    OrderDetailsShipmentContents,
    OrderDetailsFinancialCard,
    OrderDetailsSidebar
} from "../components/OrderDetails";

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useWebsiteAuth();
    const { order, isLoading, error, refetch } = useOrder(orderId || "", !!orderId);
    const { cancelOrder, isCancelingOrder, cancelError } = useOrders();

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);
    const [cancelErrorMsg, setCancelErrorMsg] = useState<string | null>(null);

    const copyToClipboard = useCallback((text: string, field: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    }, []);

    const handleCancelOrder = useCallback(async () => {
        if (!orderId) return;
        
        try {
            setCancelErrorMsg(null);
            await cancelOrder(orderId, "Customer requested cancellation");
            setCancelSuccess(true);
            setShowCancelConfirm(false);
            
            // Refetch order details to show updated status
            setTimeout(() => {
                refetch();
                setCancelSuccess(false);
            }, 2000);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Failed to cancel order. Please try again.";
            setCancelErrorMsg(errorMessage);
            console.error("Cancel order error:", err);
        }
    }, [orderId, cancelOrder, refetch]);

    const timelineData = useMemo(() => {
        if (!order) return [];
        const statusOrder = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "HANDOVER", "DELIVERED"];
        let mappedStatus: string = order.status;

        if (["CONFIRMED", "PENDING"].includes(order.status)) mappedStatus = "ORDER_PLACED";
        else if (["PACKED", "PROCESSING"].includes(order.status)) mappedStatus = "PROCESSING";
        else if (["OUT_FOR_DELIVERY", "SHIPPED", "HANDOVER"].includes(order.status)) mappedStatus = "SHIPPED";

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
            <OrderDetailsHeader
                orderNumber={order.orderNumber}
                onBack={() => navigate("/orders")}
            />

            <main className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Quick Stats Header */}
                        <OrderDetailsStats
                            itemCount={order?.items?.length ?? 0}
                            orderDate={new Date(order?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        />

                        {/* Shipment Contents */}
                        <OrderDetailsShipmentContents
                            items={order?.items || []}
                            orderStatus={order.status}
                            orderId={orderId || ""}
                        />

                        {/* Financial Card */}
                        <OrderDetailsFinancialCard
                            totalAmount={order?.totalAmount ?? "0"}
                            shippingCost={order?.shippingCost ?? "0"}
                            taxAmount={order?.taxAmount ?? "0"}
                            finalAmount={order?.finalAmount ?? "0"}
                            metadata={order?.metadata}
                        />
                    </div>

                    {/* Sidebar Information */}
                    <OrderDetailsSidebar
                        timelineData={timelineData}
                        trackingNumber={order.trackingNumber}
                        shippingDossier={{
                            userName: currentUser?.name || "",
                            shippingAddress: {
                                line1: order.shippingAddressLine1 || undefined,
                                city: order.shippingCity || undefined,
                                state: order.shippingState || undefined,
                                postalCode: order.shippingPostalCode || undefined,
                            },
                            shippingPhone: order.shippingPhone,
                            onCopyPhone: (phone) => copyToClipboard(phone, "phone"),
                            copiedField,
                        }}
                        cancelButton={{
                            orderStatus: order.status,
                            onCancel: () => setShowCancelConfirm(true),
                        }}
                    />
                </div>
            </main>

            <AnimatePresence>
                {showCancelConfirm && (
                    <ConfirmDialog
                        isOpen={showCancelConfirm}
                        onCancel={() => setShowCancelConfirm(false)}
                        onConfirm={handleCancelOrder}
                        type="danger"
                        title="Confirm Cancellation"
                        description="This will halt the current logistics process and trigger a refund to your original payment method."
                        confirmText={isCancelingOrder ? "Processing..." : "Revoke Order"}
                        isLoading={isCancelingOrder}
                    />
                )}
            </AnimatePresence>

            {/* Cancel Success Notification */}
            <AnimatePresence>
                {cancelSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-xl max-w-sm"
                    >
                        <CheckCircle size={24} weight="duotone" className="text-emerald-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-emerald-900 text-sm">Order Cancelled</h4>
                            <p className="text-xs text-emerald-700">Your order has been successfully cancelled. Refund will be processed shortly.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cancel Error Notification */}
            <AnimatePresence>
                {cancelErrorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 shadow-xl max-w-sm"
                    >
                        <XCircle size={24} weight="duotone" className="text-rose-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-rose-900 text-sm">Cancellation Failed</h4>
                            <p className="text-xs text-rose-700">{cancelErrorMsg}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;