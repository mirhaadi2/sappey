import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart, getVariantKey } from "../context/CardContext";
import { useAuth } from "../context/AuthContext";
import { useAddresses } from "../api/address/hooks";
import { useOrders } from "../api/orders/hooks";
import { useCheckoutPromotions, formatPromotionDescription } from "../hooks/useCheckoutPromotions";
import { useHomepagePromotions } from "../api/promotions";
import { PromotionList } from "../components/PromotionCard";
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle, Plus, Package, Info, Tag } from "@phosphor-icons/react";
import { Gift } from "lucide-react";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, dispatch } = useCart();
  const { addresses } = useAddresses();
  const { placeOrder, isCreatingOrder, createError } = useOrders();

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    addresses.find((a) => a.isDefault)?.id
  );
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "overnight">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "upi" | "netbanking">("cod");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderStep, setOrderStep] = useState<"shipping" | "payment" | "review" | "confirmation">("shipping");
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | undefined>(undefined);
  const { data: promotionBanners = [] } = useHomepagePromotions();
  const hasBanner = promotionBanners && promotionBanners.length > 0;
  const headerTopPosition = hasBanner ? "top-24" : "top-16";
  const sidebarTopPosition = hasBanner ? "top-40" : "top-32";
  const baseSubtotal = useMemo(() => {
    return (state?.items ?? []).reduce((sum, item) => sum + ((typeof item?.variant === 'object' && item?.variant?.price)
      ? item.variant.price
      : item?.product?.price ?? 0) * (item?.quantity ?? 0), 0);
  }, [state?.items]);
  const { bestPromotion, allApplicablePromotions } = useCheckoutPromotions(baseSubtotal);
  const originalShipping = shippingMethod === "standard" ? 9.99 : shippingMethod === "express" ? 24.99 : 49.99;
  const orderSummary = useMemo(() => {
    const subtotal = baseSubtotal;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const selectedPromo = selectedPromotionId 
      ? allApplicablePromotions.find((p) => p.promotion.id === selectedPromotionId)
      : bestPromotion;

    // Check if promotion offers free shipping
    const isFreeShippingPromo = selectedPromo?.promotion?.type === 'free_shipping';
    const shipping = isFreeShippingPromo ? 0 : originalShipping;
    const promotionDiscount = selectedPromo?.discountAmount ?? 0;

    return {
      items: state?.items?.length ?? 0,
      subtotal,
      tax,
      shipping,
      promotionDiscount,
      selectedPromotion: selectedPromo?.promotion || null,
      total: parseFloat((subtotal - promotionDiscount + tax + shipping).toFixed(2)),
      totalBeforePromo: parseFloat((subtotal + tax + shipping).toFixed(2)),
    };
  }, [baseSubtotal, selectedPromotionId, allApplicablePromotions, bestPromotion, originalShipping]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    try {
      const orderItems = (state?.items ?? []).map((item) => {
        const variantData = typeof item?.variant === 'object' ? (item?.variant ?? {}) : {};
        return {
          productId: item?.product?.id ?? '',
          productVariantId: variantData?.id ?? item?.product?.id ?? '',
          sku: variantData?.sku ?? '',
          quantity: item?.quantity ?? 0,
          price: variantData?.price ?? item?.product?.price ?? 0,
          discountedPrice: variantData?.discountedPrice ?? variantData?.price ?? item?.product?.price ?? 0,
          discountedPercent: variantData?.discountedPercent ?? 0,
        };
      });

      const orderData = {
        items: orderItems,
        subtotal: orderSummary.subtotal,
        totalAmount: orderSummary.total,
        discountAmount: orderSummary.promotionDiscount,
        taxAmount: orderSummary.tax,
        shippingCost: orderSummary.shipping,
        shippingAddressId: selectedAddressId,
        paymentMethod,
        promotionId: orderSummary.selectedPromotion?.id,
        promotionDetails: orderSummary.selectedPromotion ? {
          id: orderSummary.selectedPromotion.id,
          title: orderSummary.selectedPromotion.title,
          type: orderSummary.selectedPromotion.type,
          discount: orderSummary.promotionDiscount,
        } : undefined,
      };

      const newOrder = await placeOrder(orderData);
      dispatch({ type: "CLEAR_CART" });
      navigate("/order-success", {
        state: {
          orderId: newOrder?.id ?? '',
          orderNumber: newOrder?.orderNumber ? `Order #${newOrder.orderNumber}` : `Order ${newOrder?.id ?? 'Unknown'}`,
          orderTotal: orderSummary.total,
          estimatedDelivery: new Date(
            Date.now() + (shippingMethod === "standard" ? 6 : shippingMethod === "express" ? 3 : 1) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          shippingMethod,
          paymentMethod,
          address: (addresses ?? []).find((a) => a?.id === selectedAddressId)
            ? `${(addresses ?? []).find((a) => a?.id === selectedAddressId)?.name ?? 'N/A'}, ${(addresses ?? []).find((a) => a?.id === selectedAddressId)?.city ?? 'N/A'}`
            : undefined,
          itemCount: state?.items?.length ?? 0,
          promotionApplied: orderSummary.selectedPromotion?.title,
          promotionSavings: orderSummary.promotionDiscount,
        },
      });

    } catch (err) {
      console.error("✗ Failed to place order:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-latte to-white">
        <div className="text-center">
          <Package size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 text-lg mb-2">Please sign in to checkout</p>
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

  if ((state?.items?.length ?? 0) === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-latte to-white">
        <div className="text-center">
          <Package size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 text-lg mb-2">Your cart is empty</p>
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

  const selectedAddress = (addresses ?? []).find((a) => a?.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-latte to-white">
      <div className={`bg-white border-b border-slate-100 sticky z-40 ${headerTopPosition}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-brand-brown hover:text-brand-cocoa transition-colors font-medium"
          >
            <ArrowLeft size={20} weight="bold" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-brand-brown">Checkout</h1>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between mb-8">
              {(["shipping", "payment", "review", "confirmation"] as const).map((step, idx) => (
                <div key={step} className="flex items-center flex-1">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition ${orderStep === step
                        ? "bg-brand-brown text-white"
                        : idx < (["shipping", "payment", "review", "confirmation"] as const).indexOf(orderStep)
                          ? "bg-green-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {idx + 1}
                  </motion.div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition ${idx < (["shipping", "payment", "review", "confirmation"] as const).indexOf(orderStep)
                          ? "bg-green-500"
                          : "bg-slate-300"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
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
            <AnimatePresence mode="wait">
              {orderStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[24px] p-8 border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
                    <h2 className="text-2xl font-bold text-brand-brown flex items-center gap-3 mb-6">
                      <MapPin size={28} />
                      Delivery Address
                    </h2>
                    <div className="space-y-4 mb-6">
                      {addresses.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                          <MapPin size={32} className="mx-auto text-slate-400 mb-2" />
                          <p className="text-slate-600 font-medium">No addresses saved yet</p>
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
                              <p className="font-bold text-slate-900">{address.name}</p>
                              <p className="text-slate-700 text-sm mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-slate-600 text-sm">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-slate-600 text-sm">{address.country}</p>
                              <p className="text-slate-500 text-xs mt-2">{address.phone}</p>
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
                  <div className="bg-white rounded-[24px] p-8 border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
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
                            <p className="font-bold text-slate-900">{method.name}</p>
                            <p className="text-slate-600 text-sm">{method.time}</p>
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
                  <div className="bg-white rounded-[24px] p-8 border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
                    <h2 className="text-2xl font-bold text-brand-brown flex items-center gap-3 mb-6">
                      <CreditCard size={28} />
                      Payment Method
                    </h2>
                    <div className="space-y-4 mb-8">
                      {[{ id: "cod", name: "Cash on Delivery", icon: Package, desc: "Pay when you receive" },].map((method) => (
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
                            <p className="font-bold text-slate-900">{method.name}</p>
                            <p className="text-slate-600 text-sm">{method.desc}</p>
                          </div>
                        </motion.label>
                      ))}
                    </div>
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
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {allApplicablePromotions && allApplicablePromotions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-brand-brown flex items-center gap-2 mb-4">
                            <Tag size={24} />
                            Available Offers
                          </h3>
                          <p className="text-sm text-slate-600 mb-4">
                            <Gift size={20} className="inline-block mr-2" />
                            Great news! You qualify for {allApplicablePromotions.length} offer{allApplicablePromotions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <PromotionList
                          promotions={allApplicablePromotions.map((p) => ({
                            ...p.promotion,
                            discountAmount: p.discountAmount,
                          }))}
                          selectedPromotionId={selectedPromotionId}
                          onSelectPromotion={(promo) => setSelectedPromotionId(promo.id)}
                        />
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
                      className="w-full mt-3 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-bold"
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
                  <div className="bg-white rounded-[24px] p-8 border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
                    <h2 className="text-2xl font-bold text-brand-brown mb-6">Order Review</h2>
                    <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900">Delivery to:</h3>
                      {selectedAddress && (
                        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">
                          <p className="font-semibold">{selectedAddress.name}</p>
                          <p>{selectedAddress.addressLine1}</p>
                          {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                          <p>
                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                          </p>
                          <p>{selectedAddress.country}</p>
                          <p className="mt-2 text-slate-600">{selectedAddress.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 pb-6 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900">Shipping Method:</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-700">{shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)}</p>
                        {orderSummary?.shipping === 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 line-through text-xs">₹{originalShipping.toFixed(2)}</span>
                            <span className="text-green-600 font-bold text-xs">FREE</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4 pb-6 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900">Payment Method:</h3>
                      <p className="text-sm text-slate-700 capitalize">
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
                        <><div className="animate-spin">⏳</div>Processing...</>
                      ) : (
                        <><CheckCircle size={24} />Place Order</>
                      )}
                    </button>
                    <button
                      onClick={() => setOrderStep("payment")}
                      className="w-full mt-3 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-bold"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {orderStep !== "confirmation" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className={`sticky bg-white rounded-[24px] p-8 border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] ${sidebarTopPosition}`}>
                <h3 className="text-xl font-bold text-brand-brown mb-6 flex items-center gap-2">
                  <Package size={24} />
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 max-h-80 overflow-y-auto">
                  {state.items?.map((item) => (
                    <div key={`${item.product.id}-${getVariantKey(item.variant)}`} className="flex items-start gap-4">
                      <img
                        src={item.product.images?.[0] || "https://via.placeholder.com/150"}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate text-sm">{item.product.name}</p>
                        <p className="font-sans text-xs text-slate-500 mt-1">
                          Weight: {item.variant?.weight ? `${item.variant.weight} ${item.variant.weightUnit ?? 'g'}` : "Standard"}
                        </p>
                        <p className="text-slate-600 text-xs mt-1">Qty: {item.quantity}</p>
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
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{orderSummary?.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>₹{orderSummary?.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Shipping</span>
                    <div className="flex items-center gap-2">
                      {orderSummary?.shipping === 0 ? (
                        <>
                          <span className="text-slate-400 line-through text-sm">₹{originalShipping.toFixed(2)}</span>
                          <span className="text-green-600 font-bold text-sm">FREE</span>
                        </>
                      ) : (
                        <span className="text-slate-600">₹{orderSummary?.shipping?.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  {orderSummary?.promotionDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center pt-2 border-t border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-green-600" />
                        <span className="text-green-600 font-bold text-sm">Promotion</span>
                      </div>
                      <span className="text-green-600 font-bold">-₹{orderSummary?.promotionDiscount?.toFixed(2)}</span>
                    </motion.div>
                  )}
                  {orderSummary?.selectedPromotion && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700 font-medium">
                        ✨ {orderSummary.selectedPromotion.title}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {formatPromotionDescription(orderSummary.selectedPromotion)}
                      </p>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <div className="text-right">
                      {orderSummary?.promotionDiscount > 0 && (
                        <div className="text-slate-400 line-through text-sm">
                          ₹{orderSummary?.totalBeforePromo?.toFixed(2)}
                        </div>
                      )}
                      <span className="text-brand-brown">₹{orderSummary?.total?.toFixed(2)}</span>
                    </div>
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