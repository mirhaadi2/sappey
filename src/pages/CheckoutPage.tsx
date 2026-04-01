import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart, getVariantKey } from "../context/CardContext";
import { useAuth } from "../context/AuthContext";
import { useAddresses } from "../api/address/hooks";
import { useOrders } from "../api/orders/hooks";
import {
  ArrowLeft, MapPin, Truck, CreditCard, CheckCircle,
  Plus, Package, Info
} from "@phosphor-icons/react";

interface OrderSummary {
  items: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, dispatch } = useCart();
  const { addresses } = useAddresses();
  const { placeOrder, isCreatingOrder, createError } = useOrders();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id || null
  );
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "overnight">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "upi" | "netbanking">("cod");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderStep, setOrderStep] = useState<"shipping" | "payment" | "review" | "confirmation">("shipping");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);

  // Calculate order summary
  const originalShipping = shippingMethod === "standard" ? 9.99 : shippingMethod === "express" ? 24.99 : 49.99;
  const isFreeDelivery = paymentMethod === "cod";
  
  const orderSummary: OrderSummary = {
    items: state.items.length,
    subtotal: state.items.reduce((sum, item) => sum + ( (typeof item.variant === 'object' && item.variant.price)
          ? item.variant.price
          : item.product.price) * item.quantity, 0),
    tax: 0,
    shipping: isFreeDelivery ? 0 : originalShipping,
    total: 0,
  };

  orderSummary.tax = parseFloat((orderSummary.subtotal * 0.08).toFixed(2));
  orderSummary.total = parseFloat((orderSummary.subtotal + orderSummary.tax + orderSummary.shipping).toFixed(2));

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    try {
      // ✅ Map cart items to order items with correct payload structure
      const orderItems = state.items.map((item) => {
        const variantData = typeof item.variant === 'object' ? item.variant : {};
        return {
          productId: item.product.id,
          productVariantId: variantData.id || item.product.id,
          sku: variantData.sku || '',
          quantity: item.quantity,
          price: variantData.price || item.product.price || 0,
          discountedPrice: variantData.discountedPrice || variantData.price || item.product.price || 0,
          discountedPercent: variantData.discountedPercent || 0,
        };
      });

      const orderData = {
        items: orderItems,
        subtotal: orderSummary.subtotal,
        totalAmount: orderSummary.total,
        discountAmount: 0,
        taxAmount: orderSummary.tax,
        shippingCost: orderSummary.shipping,
        shippingAddressId: selectedAddressId,
        paymentMethod,
      };

      console.log("📤 Sending order data to API:", orderData);
      
      const newOrder = await placeOrder(orderData);
      
      console.log("✓ Order created successfully:", newOrder);
      
      // Clear cart
      dispatch({ type: "CLEAR_CART" });
      console.log("✓ Cart cleared");
      
      // Navigate to success page with order details
      navigate("/order-success", {
        state: {
          orderId: newOrder.id,
          orderNumber: newOrder?.orderNumber ? `Order #${newOrder.orderNumber}` : `Order ${newOrder.id}`,
          orderTotal: orderSummary.total,
          estimatedDelivery: new Date(
            Date.now() + (shippingMethod === "standard" ? 6 : shippingMethod === "express" ? 3 : 1) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          shippingMethod,
          paymentMethod,
          address: addresses.find((a) => a.id === selectedAddressId)
            ? `${addresses.find((a) => a.id === selectedAddressId)?.name}, ${addresses.find((a) => a.id === selectedAddressId)?.city}`
            : undefined,
          itemCount: state.items.length,
        },
      });
      
    } catch (err) {
      console.error("✗ Failed to place order:", err);
      // Error is already set in the orderError state from the hook
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-latte to-white">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-2">Please sign in to checkout</p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa transition font-semibold"
          >
            Sign In & Continue
          </button>
        </div>
      </div>
    );
  }

  if (state.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-latte to-white">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa transition font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-latte to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-brown transition mb-4"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-brand-brown">Checkout</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-8">
              {(["shipping", "payment", "review", "confirmation"] as const).map((step, idx) => (
                <div key={step} className="flex items-center flex-1">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition ${
                      orderStep === step
                        ? "bg-brand-brown text-white"
                        : idx < (["shipping", "payment", "review", "confirmation"] as const).indexOf(orderStep)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {idx + 1}
                  </motion.div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition ${
                        idx < (["shipping", "payment", "review", "confirmation"] as const).indexOf(orderStep)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error Alert */}
            {createError && !errorDismissed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex gap-3 mb-6"
              >
                <Info size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-900">Order Error</p>
                  <p className="text-red-800">{(createError as any)?.message || 'Failed to place order'}</p>
                  <button
                    onClick={() => setErrorDismissed(true)}
                    className="text-red-700 underline mt-2 text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}

            {/* Shipping Address Step */}
            <AnimatePresence mode="wait">
              {orderStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-brand-brown flex items-center gap-3 mb-6">
                      <MapPin size={28} />
                      Delivery Address
                    </h2>

                    <div className="space-y-4 mb-6">
                      {addresses.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 font-medium">No addresses saved yet</p>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <motion.label
                            key={address.id}
                            className="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition hover:border-brand-brown hover:bg-brand-brown/5"
                            style={{
                              borderColor: selectedAddressId === address.id ? "var(--color-brand-brown)" : "#e5e7eb",
                              backgroundColor: selectedAddressId === address.id ? "rgba(var(--color-brand-brown), 0.05)" : "white",
                            }}
                          >
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={(e) => setSelectedAddressId(e.target.value)}
                              className="mt-1 w-5 h-5 accent-brand-brown cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{address.name}</p>
                              <p className="text-gray-700 text-sm mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-gray-600 text-sm">{address.country}</p>
                              <p className="text-gray-500 text-xs mt-2">{address.phone}</p>
                              {address.isDefault && (
                                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                  Default Address
                                </span>
                              )}
                            </div>
                          </motion.label>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center gap-2 px-4 py-3 text-brand-brown border-2 border-brand-brown/20 rounded-xl hover:bg-brand-brown/5 transition font-semibold w-full justify-center"
                    >
                      <Plus size={20} />
                      Add New Address
                    </button>
                  </div>

                  {/* Shipping Methods */}
                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-brand-brown flex items-center gap-3 mb-6">
                      <Truck size={24} />
                      Shipping Method
                    </h3>

                    <div className="space-y-4">
                      {[
                        { id: "standard", name: "Standard", time: "5-7 days", price: 9.99 },
                        { id: "express", name: "Express", time: "2-3 days", price: 24.99 },
                        { id: "overnight", name: "Overnight", time: "Next day", price: 49.99 },
                      ].map((method) => (
                        <motion.label
                          key={method.id}
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition hover:border-brand-brown hover:bg-brand-brown/5"
                          style={{
                            borderColor: shippingMethod === method.id ? "var(--color-brand-brown)" : "#e5e7eb",
                            backgroundColor: shippingMethod === method.id ? "rgba(var(--color-brand-brown), 0.05)" : "white",
                          }}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id as any}
                            onChange={(e) => setShippingMethod(e.target.value as any)}
                            className="w-5 h-5 accent-brand-brown cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{method.name}</p>
                            <p className="text-gray-600 text-sm">{method.time}</p>
                          </div>
                          <p className="font-bold text-brand-brown">₹{method.price.toFixed(2)}</p>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setOrderStep("payment")}
                    disabled={!selectedAddressId}
                    className="w-full py-4 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {orderStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-brand-brown flex items-center gap-3 mb-6">
                      <CreditCard size={28} />
                      Payment Method
                    </h2>

                    <div className="space-y-4 mb-8">
                      {[
                        // { id: "upi", name: "UPI", icon: QrCode, desc: "Google Pay, PhonePe, Paytm" },
                        { id: "cod", name: "Cash on Delivery", icon: Package, desc: "Pay when you receive" },
                        // { id: "card", name: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Rupay" },
                        // { id: "netbanking", name: "Net Banking", icon: DollarSign, desc: "All major banks" },
                      ].map((method) => (
                        <motion.label
                          key={method.id}
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition hover:border-brand-brown hover:bg-brand-brown/5"
                          style={{
                            borderColor: paymentMethod === method.id ? "var(--color-brand-brown)" : "#e5e7eb",
                            backgroundColor: paymentMethod === method.id ? "rgba(var(--color-brand-brown), 0.05)" : "white",
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id as any}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-5 h-5 accent-brand-brown cursor-pointer"
                          />
                          <method.icon size={24} className="text-brand-brown flex-shrink-0" weight={paymentMethod === method.id ? "fill" : "regular"} />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{method.name}</p>
                            <p className="text-gray-600 text-sm">{method.desc}</p>
                          </div>
                        </motion.label>
                      ))}
                    </div>

                    {/* Card Payment - Currently Disabled */}
                    {/* {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 space-y-4"
                      >
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
                          <div className="absolute top-4 right-4">
                            <Lock size={24} className="opacity-50" />
                          </div>
                          <p className="text-sm opacity-75 mb-8">Card Number</p>
                          <p className="text-2xl tracking-wider font-mono mb-8">•••• •••• •••• 4242</p>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs opacity-75">Cardholder</p>
                              <p className="font-semibold">{user.email?.split("@")[0].toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-75">Expires</p>
                              <p className="font-semibold">12/26</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex gap-3">
                          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-blue-900 mb-1">Demo Payment</p>
                            <p className="text-blue-800">This is a demo checkout. Use test card 4242 4242 4242 4242.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === "upi" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 space-y-4"
                      >
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
                          <QrCode size={64} className="mx-auto text-purple-600 mb-4" />
                          <p className="font-semibold text-gray-900 mb-2">Scan QR Code with any UPI app</p>
                          <p className="text-gray-600 text-sm mb-4">Works with Google Pay, PhonePe, Paytm, BHIM, and all UPI apps</p>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">No individual app integration needed</p>
                            <p className="text-sm font-mono text-brand-brown">UPI: yourname@bank</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Net Banking - Currently Disabled */}
                    {/* {paymentMethod === "netbanking" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                          <p className="font-semibold text-gray-900 mb-4">Select Your Bank:</p>
                          <div className="grid grid-cols-2 gap-4">
                            {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank", "IDBI Bank"].map((bank) => (
                              <button
                                key={bank}
                                className="p-3 border-2 border-green-200 rounded-lg hover:bg-green-100 transition font-semibold text-sm text-gray-700"
                              >
                                {bank}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )} */}

                    {paymentMethod === "cod" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded flex gap-3">
                          <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-amber-900 mb-1">Cash on Delivery</p>
                            <p className="text-amber-800">Pay ₹{orderSummary.total.toFixed(2)} when your order arrives at your doorstep.</p>
                            <p className="font-semibold text-green-600 mt-2">✨ FREE Delivery - Launch Offer</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <button
                      onClick={() => setOrderStep("review")}
                      className="w-full py-4 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa transition font-bold text-lg"
                    >
                      Review Order
                    </button>
                    <button
                      onClick={() => setOrderStep("shipping")}
                      className="w-full mt-3 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {orderStep === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-brand-brown mb-6">Order Review</h2>

                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Delivery to:</h3>
                      {selectedAddress && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          <p className="font-semibold">{selectedAddress.name}</p>
                          <p>{selectedAddress.addressLine1}</p>
                          {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                          <p>
                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                          </p>
                          <p>{selectedAddress.country}</p>
                          <p className="mt-2 text-gray-600">{selectedAddress.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pb-6 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Shipping Method:</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">{shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)}</p>
                        {isFreeDelivery && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-xs">₹{originalShipping.toFixed(2)}</span>
                            <span className="text-green-600 font-bold text-xs">FREE</span>
                          </div>
                        )}
                      </div>
                      {isFreeDelivery && (
                        <p className="text-xs text-green-600 font-semibold">✨ FREE Delivery - Launch Offer</p>
                      )}
                    </div>

                    <div className="space-y-4 pb-6 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Payment Method:</h3>
                      <p className="text-sm text-gray-700 capitalize">
                        {paymentMethod === "cod" && "Cash on Delivery"}
                        {paymentMethod === "card" && "Credit/Debit Card"}
                        {paymentMethod === "upi" && "UPI"}
                        {paymentMethod === "netbanking" && "Net Banking"}
                      </p>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isCreatingOrder}
                      className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingOrder ? (
                        <>
                          <div className="animate-spin">⏳</div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={24} />
                          Place Order
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setOrderStep("payment")}
                      className="w-full mt-3 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Order Summary Sidebar - Hidden on Confirmation */}
          {orderStep !== "confirmation" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
            <div className="sticky top-32 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
              <h3 className="text-xl font-bold text-brand-brown mb-6 flex items-center gap-2">
                <Package size={24} />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-80 overflow-y-auto">
                {state.items?.map((item) => (
                  <div key={`${item.product.id}-${getVariantKey(item.variant)}`} className="flex items-start gap-4">
                    <img
                      src={item.product.images?.[0] || "https://via.placeholder.com/150"}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm">{item.product.name}</p>
                      <p className="font-sans text-xs text-gray-500 mt-1">
                        Weight: {item.variant?.label || "Standard"}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">Qty: {item.quantity}</p>
                      <p className="font-bold text-brand-brown text-sm mt-1">
                        ₹{(((typeof item.variant === 'object' && item.variant.price)
                                                            ? item.variant.price
                                                            : item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{orderSummary?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{orderSummary?.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <div className="flex items-center gap-2">
                    {isFreeDelivery ? (
                      <>
                        <span className="text-gray-400 line-through text-sm">₹{originalShipping.toFixed(2)}</span>
                        <span className="text-green-600 font-bold text-sm">FREE</span>
                      </>
                    ) : (
                      <span className="text-gray-600">₹{orderSummary?.shipping?.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                {isFreeDelivery && orderStep !== "shipping" && (
                  <div className="text-center py-2 bg-green-50 rounded-lg">
                    <p className="text-green-600 text-xs font-bold">✨ FREE Delivery - Launch Offer</p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand-brown">₹{orderSummary?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </main>


    </div>
  );
};

export default CheckoutPage;
