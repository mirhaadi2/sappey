import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, ShareNetwork } from "@phosphor-icons/react";

interface OrderSuccessModalProps {
  orderId: string;
  orderTotal: number;
  estimatedDelivery: string;
  shippingMethod: string;
  paymentMethod: string;
  address?: string;
  itemCount: number;
  onContinueShopping: () => void;
  onViewOrder: () => void;
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

// Floating particle animation
const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-brand-brown/20"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: -20, opacity: [0, 1, 0] }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
      }}
    />
  );
};

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderId,
  orderTotal,
  estimatedDelivery,
  shippingMethod,
  paymentMethod,
  address,
  itemCount,
  onContinueShopping,
  onViewOrder,
}) => {
  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: i * 0.02,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <motion.div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 overflow-y-auto px-4 py-8 flex justify-center items-start sm:items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    >
      {/* Confetti Animation */}
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} duration={piece.duration} />
      ))}

      {/* Main Success Card */}
      <motion.div
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden relative"
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
              #{orderId.substring(0, 8).toUpperCase()}
            </motion.p>
          </motion.div>

          {/* Order Amount */}
          <motion.div
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-sm text-gray-600 font-medium mb-2">Total Amount</p>
            <motion.p
              className="text-4xl font-bold text-brand-brown"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 80 }}
            >
              ₹{orderTotal.toFixed(2)}
            </motion.p>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Info */}
            <motion.div
              className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Estimated Delivery</p>
                  <p className="font-bold text-gray-900">{estimatedDelivery}</p>
                  <p className="text-xs text-gray-600 mt-1 capitalize">{shippingMethod} Shipping</p>
                </div>
              </div>
            </motion.div>

            {/* Items Count */}
            <motion.div
              className="bg-purple-50 rounded-2xl p-6 border border-purple-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={24} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Items in Order</p>
                  <p className="font-bold text-gray-900">{itemCount} {itemCount === 1 ? "Item" : "Items"}</p>
                  <p className="text-xs text-gray-600 mt-1">Ready for shipment</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard size={24} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Payment Method</p>
                  <p className="font-bold text-gray-900 capitalize">
                    {paymentMethod === "cod" && "Cash on Delivery"}
                    {paymentMethod === "card" && "Credit/Debit Card"}
                    {paymentMethod === "upi" && "UPI"}
                    {paymentMethod === "netbanking" && "Net Banking"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            {address && (
              <motion.div
                className="bg-pink-50 rounded-2xl p-6 border border-pink-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Delivery Address</p>
                    <p className="font-bold text-gray-900 truncate">{address}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <motion.button
              onClick={onViewOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition font-bold text-lg flex items-center justify-center gap-3"
            >
              <Package size={24} />
              Track Your Order
            </motion.button>

            <motion.button
              onClick={onContinueShopping}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 border-2 border-brand-brown text-brand-brown rounded-xl hover:bg-brand-brown/5 transition font-bold text-lg"
            >
              Continue Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 text-gray-600 rounded-xl hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <ShareNetwork size={18} />
              Share Order Details
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p>A confirmation email has been sent to your registered email address</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccessModal;
