import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard } from "@phosphor-icons/react";

interface OrderSuccessState {
  orderId: string;
  orderTotal: number;
  estimatedDelivery: string;
  shippingMethod: string;
  paymentMethod: string;
  address?: string;
  itemCount: number;
}

// Confetti particle component
const ConfettiPiece: React.FC<{ delay: number; duration: number }> = ({ delay, duration }) => {
  return (
    <motion.div
      className="fixed w-2 h-2 rounded-full pointer-events-none"
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: (Math.random() - 0.5) * 400,
        y: Math.random() * 400 + 100,
        opacity: 0,
        rotate: Math.random() * 720,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={{
        left: "50%",
        top: "50%",
        backgroundColor: ["#8B7355", "#D4A574", "#F4E4C1", "#E8DCC4"][Math.floor(Math.random() * 4)],
      }}
    />
  );
};

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order details from navigation state
  const orderData = location.state as OrderSuccessState | undefined;

  useEffect(() => {
    // If no order data, redirect to shop
    if (!orderData?.orderId) {
      navigate("/shop");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: i * 0.02,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-latte to-white py-12 px-4">
      {/* Confetti Animation */}
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} duration={piece.duration} />
      ))}

      <div className="max-w-3xl mx-auto">
        {/* Main Success Card */}
        <motion.div
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        >
          {/* Success Header */}
          <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-12 text-center overflow-hidden">
            {/* Animated background circles */}
            <motion.div
              className="absolute top-4 right-4 w-32 h-32 bg-green-100/30 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-24 h-24 bg-emerald-100/30 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />

            {/* Checkmark Animation */}
            <motion.div
              className="relative mx-auto w-24 h-24 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 10 }}
            >
              <motion.div
                className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 20px rgba(34, 197, 94, 0)"] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <CheckCircle size={56} className="text-white" weight="fill" />
              </motion.div>
            </motion.div>

            {/* Main Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-brand-brown mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 text-lg">Your order has been successfully placed</p>
            </motion.div>
          </div>

          {/* Order Details */}
          <div className="px-8 py-8 space-y-6">
            {/* Order Number Card */}
            <motion.div
              className="bg-white rounded-2xl p-6 border-2 border-green-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-sm text-gray-600 font-medium mb-2">Order Number</p>
              <motion.p className="font-mono text-2xl font-bold text-brand-brown tracking-wider">
                #{orderData.orderId.substring(0, 8).toUpperCase()}
              </motion.p>
            </motion.div>

            {/* Order Amount */}
            <motion.div
              className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-sm text-gray-600 font-medium mb-2">Total Amount</p>
              <motion.p
                className="text-3xl font-bold text-brand-brown"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                ₹{orderData.orderTotal.toFixed(2)}
              </motion.p>
            </motion.div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Info */}
              <motion.div
                className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Truck size={24} className="text-blue-600" weight="bold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estimated Delivery</p>
                    <p className="text-lg font-bold text-brand-brown mt-1">{orderData.estimatedDelivery}</p>
                    <p className="text-sm text-gray-600 capitalize">{orderData.shippingMethod} Shipping</p>
                  </div>
                </div>
              </motion.div>

              {/* Items Count */}
              <motion.div
                className="bg-purple-50 rounded-2xl p-6 border border-purple-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Package size={24} className="text-purple-600" weight="bold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Items in Order</p>
                    <p className="text-lg font-bold text-brand-brown mt-1">{orderData.itemCount} Item{orderData.itemCount !== 1 ? "s" : ""}</p>
                    <p className="text-sm text-gray-600">Ready for shipment</p>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                className="bg-green-50 rounded-2xl p-6 border border-green-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CreditCard size={24} className="text-green-600" weight="bold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payment Method</p>
                    <p className="text-lg font-bold text-brand-brown mt-1 capitalize">{orderData.paymentMethod === "cod" ? "Cash On Delivery" : orderData.paymentMethod}</p>
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              {orderData.address && (
                <motion.div
                  className="bg-pink-50 rounded-2xl p-6 border border-pink-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} className="text-pink-600" weight="bold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Delivery Address</p>
                      <p className="text-lg font-bold text-brand-brown mt-1">{orderData.address}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transition-shadow"
              >
                Track Your Order
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-brand-brown border-2 border-brand-brown hover:bg-brand-brown/5 transition-colors"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
