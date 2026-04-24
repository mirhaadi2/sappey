import React, { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CardContext";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { useCheckoutPromotions } from "../hooks/useCheckoutPromotions";
import { useApplicablePromotions, Promotion } from "../api/promotions";
import { getOrderSummary, buildOrderItemsPayload, getSubtotal } from "../utils/checkoutCalculations";
import { MapPin, CreditCard, Package, Envelope, Phone, ChatCircle, Plus, CheckCircle, Buildings, House } from "@phosphor-icons/react";
import { useGuestConfig, useFindCustomerByContact } from "../api/guest";
import { useAddresses } from "../api/address/hooks";
import { Address } from "../types/address";
import CheckoutHeader from "../components/CheckoutHeader";
import PageContentModal from "../components/PageContentModal";
import OtpVerificationModal from "../components/OtpVerificationModal";
import { useFormWithValidation } from "../hooks/useFormValidation";
import { checkoutFormSchema, CheckoutFormData } from "../schemas";
import AddressForm from "../components/AddressForm";
import CheckoutItems from "../components/CheckoutItems";
import OrderSummary from "../components/OrderSummary";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useWebsiteAuth();
  const { state, dispatch } = useCart();
  const { placeOrder, isCreatingOrder } = useOrders();
  const { config: guestConfig } = useGuestConfig();
  const checkoutForm = useFormWithValidation<CheckoutFormData>(checkoutFormSchema, {
    defaultValues: {
      contactEmail: '',
      contactPhone: '',
      contactWhatsapp: '',
      deliveryAddress: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        phone: '',
        country: 'India',
      },
      billingAddress: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        phone: '',
        country: 'India',
      },
      billingSameAsShipping: true,
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      newsletter: true,
      saveInfo: true,
    }
  });

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isGuestVerified, setIsGuestVerified] = useState(false);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [verifiedGuest, setVerifiedGuest] = useState<{ contact: string; type: 'email' | 'phone' | 'whatsapp' } | null>(null);
  const [existingCustomer, setExistingCustomer] = useState<{
    id: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    name?: string;
    orderCount: number;
  } | null>(null);
  const [existingAddresses, setExistingAddresses] = useState<Array<any>>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [newDestinationAddress, setNewDestinationAddress] = useState<boolean>(false);
  const [customerLookupError, setCustomerLookupError] = useState<string | null>(null);
  const placeOrderPendingRef = useRef(false);
  const { findCustomerByContact, loading: customerLookupLoading, error: customerLookupServiceError } = useFindCustomerByContact();
  const { addresses: userAddresses = [], isLoading: addressesLoading } = useAddresses();
  const isReturningCustomer = !existingCustomer || existingCustomer?.orderCount > 0;
  const isFirstOrderEligible = !existingCustomer || existingCustomer.orderCount === 0;
  const isWelcomePromotion = (promotion: Promotion) => {
    const text = `${promotion.title} ${promotion.description || ''}`.toLowerCase();
    return text.includes('welcome') || text.includes('first order') || text.includes('new customer');
  };

  const baseSubtotal = useMemo(() => {
    return getSubtotal(state?.items ?? []);
  }, [state?.items]);

  const { data: applicablePromotions = [] } = useApplicablePromotions(baseSubtotal);

  const filteredPromotions = useMemo(() => {
    if (isReturningCustomer) return [];
    if (isFirstOrderEligible) {
      return applicablePromotions.filter((promotion) => isWelcomePromotion(promotion));
    }

    return applicablePromotions;
  }, [applicablePromotions, isReturningCustomer, isFirstOrderEligible]);

  const { bestPromotion } = useCheckoutPromotions(baseSubtotal, filteredPromotions);
  const orderSummary = useMemo(() => {
    const deliveryValues = checkoutForm.watch("deliveryAddress");
    const shippingMethod = checkoutForm.watch("shippingMethod");
    return getOrderSummary(state?.items ?? [], shippingMethod, bestPromotion, {
      firstName: deliveryValues.firstName || '',
      lastName: deliveryValues.lastName || '',
      address: deliveryValues.address || '',
      city: deliveryValues.city || '',
      state: deliveryValues.state || '',
      pinCode: deliveryValues.pinCode || '',
      phone: deliveryValues.phone || '',
      country: deliveryValues.country || 'India',
    });
  }, [state?.items, checkoutForm.watch(), bestPromotion]);

  const shippingLabel = orderSummary.shippingReady
    ? orderSummary.shipping === 0
      ? 'Free'
      : `₹${orderSummary.shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : 'Enter shipping address';

  useEffect(() => {
    if (placeOrderPendingRef.current && isGuestVerified) {
      placeOrderPendingRef.current = false;
      handlePlaceOrder();
    }
  }, [isGuestVerified]);

  useEffect(() => {
    if (customerLookupServiceError) {
      setCustomerLookupError(customerLookupServiceError);
    }
  }, [customerLookupServiceError]);

  const runCustomerLookup = async (
    contact: string,
    type: 'email' | 'phone' | 'whatsapp'
  ) => {
    if (!contact?.trim()) {
      setExistingCustomer(null);
      setExistingAddresses([]);
      setSelectedAddressId(null);
      setCustomerLookupError(null);
      return;
    }

    try {
      setCustomerLookupError(null);
      const result = await findCustomerByContact(contact.trim(), type);

      if (result && result.customer) {
        setExistingCustomer({ ...result.customer, orderCount: result.customer.orderCount ?? 0 });
        setExistingAddresses(result.addresses || []);
        setSelectedAddressId(null);
      } else {
        setExistingCustomer(null);
        setExistingAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (error) {
      setExistingCustomer(null);
      setExistingAddresses([]);
      setSelectedAddressId(null);
      setCustomerLookupError((error as Error).message || 'Unable to lookup customer');
    }
  };

  const applySavedAddress = (address: any) => {
    setSelectedAddressId(address.id);
    checkoutForm.setValue('deliveryAddress.firstName', address.name?.split(' ')?.[0] || '');
    checkoutForm.setValue('deliveryAddress.lastName', address.name?.split(' ')?.slice(1).join(' ') || '');
    checkoutForm.setValue('deliveryAddress.address', address.addressLine1 || '');
    checkoutForm.setValue('deliveryAddress.city', address.city || '');
    checkoutForm.setValue('deliveryAddress.state', address.state || '');
    checkoutForm.setValue('deliveryAddress.pinCode', address.postalCode || '');
    checkoutForm.setValue('deliveryAddress.country', address.country || 'India');
    checkoutForm.setValue('deliveryAddress.phone', address.phone || '');
  };

  const toggleSavedAddress = (address: any) => {
    if (selectedAddressId === address.id) {
      setSelectedAddressId(null);
      return;
    }

    applySavedAddress(address);
  };

  const handlePlaceOrder = async () => {
    const isFormValid = await checkoutForm.trigger();
    if (!isFormValid) {
      console.log("Validation failed", checkoutForm.formState.errors);
      return;
    }

    const formValues = checkoutForm.getValues();
    const deliveryValues = formValues.deliveryAddress;
    const billingValues = formValues.billingSameAsShipping ? deliveryValues : formValues.billingAddress;
    if (!currentUser) {
      if (!formValues.contactEmail && !formValues.contactPhone && !formValues.contactWhatsapp) {
        alert("Please provide at least one contact method (email, phone, or WhatsApp)");
        return;
      }
      if (!isGuestVerified) {
        placeOrderPendingRef.current = true;
        setShowOtpModal(true);
        return;
      }
    }

    try {
      const orderData = {
        guestData: !currentUser ? {
          contact: verifiedGuest?.contact || '',
          contactType: verifiedGuest?.type || 'email',
        } : undefined,
        items: buildOrderItemsPayload(state?.items ?? []),
        subtotal: orderSummary.subtotal,
        totalAmount: orderSummary.total,
        discountAmount: orderSummary.promotionDiscount,
        taxAmount: orderSummary.tax,
        shippingCost: orderSummary.shipping,
        paymentMethod: formValues.paymentMethod,
        shippingAddressId: selectedAddressId || undefined,
        shippingAddress: {
          name: `${deliveryValues.firstName} ${deliveryValues.lastName}`,
          phone: deliveryValues?.phone || formValues.contactPhone || formValues.contactWhatsapp,
          email: currentUser ? currentUser.email : formValues.contactEmail,
          addressLine1: deliveryValues.address,
          city: deliveryValues.city,
          state: deliveryValues.state,
          postalCode: deliveryValues.pinCode,
          country: deliveryValues.country,
        },
        billingAddress: formValues.billingSameAsShipping ? undefined : {
          name: `${billingValues?.firstName} ${billingValues?.lastName}`,
          phone: billingValues?.phone || formValues.contactPhone || formValues.contactWhatsapp,
          email: currentUser ? currentUser.email : formValues.contactEmail,
          addressLine1: billingValues?.address,
          city: billingValues?.city,
          state: billingValues?.state,
          postalCode: billingValues?.pinCode,
          country: billingValues?.country,
        },
        promotionId: orderSummary.selectedPromotion?.id,
      };

      const newOrder = await placeOrder(orderData, guestToken ?? undefined);
      dispatch({ type: "CLEAR_CART" });
      navigate("/order-success", {
        state: {
          orderId: newOrder?.id ?? '',
          orderNumber: newOrder?.orderNumber ? `Order #${newOrder.orderNumber}` : `Order ${newOrder?.id ?? 'Unknown'}`,
          orderTotal: orderSummary.total,
          estimatedDelivery: new Date(
            Date.now() + (formValues.shippingMethod === "standard" ? 6 : formValues.shippingMethod === "express" ? 3 : 1) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          shippingMethod: formValues.shippingMethod,
          paymentMethod: formValues.paymentMethod,
          address: `${deliveryValues.firstName}, ${deliveryValues.city}`,
          itemCount: state?.items?.length ?? 0,
          promotionApplied: orderSummary.selectedPromotion?.title,
          promotionSavings: orderSummary.promotionDiscount,
        },
      });
    } catch (err) {
      console.error("✗ Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

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

  const enabledContactTypes = guestConfig?.enabledContactTypes || { email: true };
  const contactFields = [];
  if (enabledContactTypes.email) contactFields.push('email');
  if (enabledContactTypes.phone) contactFields.push('phone');
  if (enabledContactTypes.whatsapp) contactFields.push('whatsapp');

  const getContactIcon = (type: 'email' | 'phone' | 'whatsapp') => {
    switch (type) {
      case 'email': return <Envelope size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'whatsapp': return <ChatCircle size={20} />;
    }
  };

  const getContactPlaceholder = (type: 'email' | 'phone' | 'whatsapp') => {
    switch (type) {
      case 'email': return 'Enter email address';
      case 'phone': return 'Enter phone number';
      case 'whatsapp': return 'Enter WhatsApp number';
    }
  };

  return (
    <div className="min-h-screen bg-brand-latte">
      <CheckoutHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-6">
            {!currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-brand-brown/10 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-brand-brown">Contact Information</h2>
                  <button
                    onClick={() => openAuthModal("customer")}
                    className="text-brand-brown font-bold text-sm hover:opacity-80 transition-opacity"
                  >
                    Sign In
                  </button>
                </div>

                <div className="space-y-4">
                  {contactFields.map((type) => (
                    <div key={type} className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown transition-transform group-focus-within:scale-110">
                        {getContactIcon(type as 'email' | 'phone' | 'whatsapp')}
                      </div>
                      <input
                        type={type === 'email' ? 'email' : 'tel'}
                        value={checkoutForm.watch(`contact${type.charAt(0).toUpperCase() + type.slice(1)}` as any)}
                        onChange={(e) => checkoutForm.setValue(`contact${type.charAt(0).toUpperCase() + type.slice(1)}` as any, e.target.value)}
                        onBlur={(e) => runCustomerLookup(e.target.value, type as 'email' | 'phone' | 'whatsapp')}
                        placeholder={getContactPlaceholder(type as 'email' | 'phone' | 'whatsapp')}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 focus:outline-none transition-all"
                      />
                    </div>
                  ))}

                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={checkoutForm.watch("newsletter")}
                      onChange={(e) => checkoutForm.setValue("newsletter", e.target.checked)}
                      className="w-5 h-5 accent-brand-brown rounded-md"
                    />
                    <span className="text-sm font-medium text-slate-600">Email me with news and offers</span>
                  </label>

                  {customerLookupLoading && (
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-brown/60 uppercase tracking-widest animate-pulse mt-2">
                      <div className="w-4 h-4 border-2 border-brand-brown border-t-transparent rounded-full animate-spin" />
                      Checking for profile...
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- DELIVERY SECTION --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-brand-brown/10 shadow-sm"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-8 flex items-center gap-3">
                <div className="p-2 bg-brand-brown/5 rounded-xl">
                  <MapPin size={24} weight="duotone" />
                </div>
                Shipping Details
              </h2>

              {/* SAVED ADDRESSES GRID (Show for both Logged In and Recognized Guests) */}
              {(currentUser || existingCustomer) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {currentUser ? "Your Saved Addresses" : "Found in your profile"}
                    </h3>
                    <span className="text-[11px] font-bold text-brand-brown bg-brand-brown/5 px-2 py-1 rounded-md">
                      {(currentUser ? userAddresses : existingAddresses).length} Destinations
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(currentUser ? userAddresses : existingAddresses).map((address: Address) => {
                      const isSelected = selectedAddressId === address.id;
                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => toggleSavedAddress(address)}
                          className={`relative group text-left p-5 rounded-2xl border-2 transition-all duration-300 ${isSelected
                            ? 'border-brand-brown bg-brand-brown/[0.02] shadow-md shadow-brand-brown/5 ring-1 ring-brand-brown/10'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-brown text-white' : 'bg-slate-50 text-slate-400'}`}>
                              {address.name?.toLowerCase().includes('office') ? <Buildings size={16} /> : <House size={16} />}
                            </div>
                            {isSelected ? (
                              <CheckCircle size={22} weight="fill" className="text-brand-brown" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-brand-brown/30 transition-colors" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <p className={`text-sm font-bold ${isSelected ? 'text-brand-brown' : 'text-slate-800'}`}>
                              {address.name || 'Personal Address'}
                            </p>
                            <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-1">
                              {address.addressLine1}, {address.city}
                            </p>
                            <p className="text-[12px] font-medium text-slate-400">
                              {address.state}, {address.postalCode}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    {/* New Destination Button */}
                    {!newDestinationAddress ? (
                      <button
                        type="button"
                        onClick={() => setNewDestinationAddress(true)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all min-h-[145px] ${!selectedAddressId
                          ? 'border-brand-brown bg-brand-brown/[0.02] ring-1 ring-brand-brown/10'
                          : 'border-slate-200 hover:border-brand-brown/40 hover:bg-slate-50 text-slate-400 hover:text-brand-brown'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all ${!selectedAddressId ? 'bg-brand-brown text-white' : 'bg-slate-100 group-hover:bg-brand-brown group-hover:text-white'
                          }`}>
                          <Plus size={20} weight="bold" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest">New Destination</p>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setNewDestinationAddress(false);
                          const firstAddr = currentUser ? userAddresses[0] : existingAddresses[0];
                          if (firstAddr) toggleSavedAddress(firstAddr);
                        }}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-brand-brown bg-brand-brown/[0.02] ring-1 ring-brand-brown/10 transition-all min-h-[145px] group"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center mb-3 shadow-lg shadow-brand-brown/20">
                          <Plus size={20} weight="bold" className="rotate-45" /> {/* Rotated Plus = X */}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-brown">Cancel New Address</p>
                        <p className="text-[10px] mt-1 text-brand-brown/60">Back to saved list</p>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {((!selectedAddressId && (userAddresses.length === 0 && existingAddresses.length === 0))
                  || newDestinationAddress) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-4 border-t border-slate-100">
                        <AddressForm
                          form={checkoutForm}
                          addressFieldPrefix="deliveryAddress"
                          showSaveInfo={!currentUser}
                          phoneLabel="Delivery Phone"
                        />
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
            {/* Shipping Method Section */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-brand-brown/10"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-6 flex items-center gap-2">
                <Truck size={24} />
                Shipping method
              </h2>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-amber-800">
                  Enter your shipping address to view available shipping methods.
                </p>
              </div>
            </motion.div> */}

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-brand-brown/10"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Payment
              </h2>
              {/* <p className="text-sm text-slate-600 mb-6">All transactions are secure and encrypted.</p> */}

              <div className="space-y-3">
                {[
                  // { id: 'razorpay', label: 'Razorpay Secure (UPI, Cards, Int\'l Cards, Wallets)' },
                  // { id: 'cashfree', label: 'Cashfree Payments (UPI,Cards,Int\'l cards,Wallets)' },
                  { id: 'cod', label: 'Cash on Delivery (COD)' },
                ].map((method) => (
                  <label key={method.id} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-brand-brown transition"
                    style={{
                      borderColor: checkoutForm.watch("paymentMethod") === method.id ? '#6B4423' : '#E5E7EB',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={checkoutForm.watch("paymentMethod") === method.id as any}
                      onChange={(e) => checkoutForm.setValue("paymentMethod", e.target.value as any)}
                      className="w-5 h-5 accent-brand-brown"
                    />
                    <span className="text-sm font-medium text-slate-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-brand-brown/10"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-6">Billing address</h2>

              <div className="space-y-3">
                <label
                  className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-brown transition"
                  onClick={() => {
                    checkoutForm.setValue("billingSameAsShipping", true);
                    checkoutForm.clearErrors("billingAddress");
                  }}
                >
                  <input
                    type="radio"
                    name="billing"
                    checked={checkoutForm.watch("billingSameAsShipping")}
                    readOnly
                    className="w-5 h-5 accent-brand-brown"
                  />
                  <span className="text-sm font-medium text-slate-700">Same as shipping address</span>
                </label>

                <label
                  className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-brown transition"
                  onClick={() => checkoutForm.setValue("billingSameAsShipping", false)}
                >
                  <input
                    type="radio"
                    name="billing"
                    checked={!checkoutForm.watch("billingSameAsShipping")}
                    readOnly
                    className="w-5 h-5 accent-brand-brown"
                  />
                  <span className="text-sm font-medium text-slate-700">Use a different billing address</span>
                </label>
              </div>
              {!checkoutForm.watch("billingSameAsShipping") && (
                <div className="mt-6">
                  <AddressForm
                    form={checkoutForm}
                    addressFieldPrefix="billingAddress"
                    showSaveInfo={false}
                    phoneLabel="Phone (Optional)"
                  />
                </div>
              )}
            </motion.div>
            <motion.button
              onClick={handlePlaceOrder}
              disabled={isCreatingOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingOrder ? "Processing..." : "Complete order"}
            </motion.button>
            <div className="flex justify-center gap-6 text-sm text-slate-600 flex-wrap">
              <button onClick={() => setOpenModal('returns-and-refunds')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Refund policy</button>
              <button onClick={() => setOpenModal('shipping-policy')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Shipping</button>
              <button onClick={() => setOpenModal('privacy-policy')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Privacy policy</button>
              <button onClick={() => setOpenModal('terms-and-conditions')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Terms of service</button>
              <button onClick={() => setOpenModal('about-sappey')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Contact</button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-28 space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-brand-brown/10">
                <CheckoutItems state={state} />
              </div>

              <OrderSummary
                orderSummary={orderSummary}
                filteredPromotions={filteredPromotions}
                isReturningCustomer={isReturningCustomer}
                shippingLabel={shippingLabel}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <PageContentModal
        isOpen={openModal === 'returns-and-refunds'}
        onClose={() => setOpenModal(null)}
        slug="returns-refunds"
        title="Refund Policy"
      />
      <PageContentModal
        isOpen={openModal === 'shipping-policy'}
        onClose={() => setOpenModal(null)}
        slug="shipping-policy"
        title="Shipping Policy"
      />
      <PageContentModal
        isOpen={openModal === 'privacy-policy'}
        onClose={() => setOpenModal(null)}
        slug="privacy-policy"
        title="Privacy Policy"
      />
      <PageContentModal
        isOpen={openModal === 'terms-and-conditions'}
        onClose={() => setOpenModal(null)}
        slug="terms-and-conditions"
        title="Terms & Conditions"
      />
      <PageContentModal
        isOpen={openModal === 'about-sappey'}
        onClose={() => setOpenModal(null)}
        slug="about-sappey"
        title="About Us"
      />

      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={(data) => {
          setVerifiedGuest({ contact: data.contact, type: data.type });
          setGuestToken(data.guestToken);
          setIsGuestVerified(true);
          setShowOtpModal(false);
        }}
        contactData={{
          email: checkoutForm.watch("contactEmail"),
          phone: checkoutForm.watch("contactPhone"),
          whatsapp: checkoutForm.watch("contactWhatsapp"),
        }}
        defaultType={checkoutForm.watch("contactEmail") ? 'email' : checkoutForm.watch("contactPhone") ? 'phone' : 'whatsapp'}
      />
    </div>
  );
};

export default CheckoutPage;