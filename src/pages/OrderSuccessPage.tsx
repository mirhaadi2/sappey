import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  Package,
  Truck,
  House,
  Receipt,
  CreditCard,
  ArrowRight,
  EnvelopeSimple,
  Question
} from "@phosphor-icons/react";

interface OrderSuccessState {
  orderId: string;
  orderNumber?: string;
  orderTotal: number;
  estimatedDelivery: string;
  shippingMethod: string;
  paymentMethod: string;
  address?: string;
  itemCount: number;
}

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state as OrderSuccessState | undefined;
  console.log(orderData, 'orderData');

  useEffect(() => {
    if (!orderData?.orderId) {
      navigate("/shop");
    }
    window.scrollTo(0, 0);
  }, [orderData, navigate]);

  if (!orderData) return null;

  const steps = [
    { label: "Confirmed", icon: <Check weight="bold" />, active: true },
    { label: "Processing", icon: <Package weight="bold" />, active: false },
    { label: "Shipping", icon: <Truck weight="bold" />, active: false },
    { label: "Delivered", icon: <House weight="bold" />, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-emerald-100">
      {/* Top Progress Bar (Subtle) */}
      <div className="h-1.5 w-full bg-emerald-500 fixed top-0 z-50" />

      <main className="max-w-4xl mx-auto pt-16 pb-24 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 text-white rounded-full mb-6 shadow-xl shadow-emerald-200"
          >
            <Check size={40} weight="bold" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
          >
            Thanks for your order!
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-600 max-w-xl mx-auto"
          >
            We've received your order <span className="font-mono font-bold text-slate-900">{orderData?.orderNumber}</span> and are getting it ready for shipment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status Stepper */}
            <section className="bg-white border border-brand-brown/10 rounded-[24px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Order Status</h2>
              <div className="relative flex justify-between">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
                {steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${step.active ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-400"
                      }`}>
                      {step.icon}
                    </div>
                    <span className={`mt-3 text-xs font-bold ${step.active ? "text-emerald-600" : "text-slate-400"}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Information Grid */}
            <section className="bg-white border border-brand-brown/10 rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <Truck size={20} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Shipping Details</h3>
                  </div>
                  <p className="text-slate-900 font-medium">{orderData.address || "Digital Delivery"}</p>
                  <p className="text-sm text-slate-500 mt-1">{orderData.shippingMethod} Shipping</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <CreditCard size={20} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Payment</h3>
                  </div>
                  <p className="text-slate-900 font-medium capitalize">
                    {orderData.paymentMethod === "cod" ? "Cash on Delivery" : orderData.paymentMethod}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Total charged: ₹{orderData.orderTotal.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center gap-3">
                <EnvelopeSimple size={18} className="text-slate-400" />
                <p className="text-xs text-slate-500">
                  A confirmation email has been sent to your registered email address.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-2">Delivery Estimate</h3>
              <p className="text-3xl font-light text-emerald-400 mb-6">{orderData.estimatedDelivery}</p>

              <button
                onClick={() => navigate("/orders")}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Track Order
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping
            </button>

            <div className="p-6 border border-dashed border-slate-300 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Question size={20} />
                <span className="font-bold text-sm">Need help?</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you have any questions about your order, please contact our 24/7 support team.
              </p>
              <button className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
                Chat with an agent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;