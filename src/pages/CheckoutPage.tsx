import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CardContext";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { useCheckoutPromotions } from "../hooks/useCheckoutPromotions";
import { useApplicablePromotions, Promotion } from "../api/promotions";
import { getOrderSummary, buildOrderItemsPayload, getSubtotal } from "../utils/checkoutCalculations";
import { MapPin, CreditCard, Package, Envelope, Phone, ChatCircle, QuestionIcon } from "@phosphor-icons/react";
import { useGuestConfig, useFindCustomerByContact } from "../api/guest";
import { useAddresses } from "../api/address/hooks";
import { Address } from "../types/address";
import CheckoutHeader from "../components/CheckoutHeader";
import PageContentModal from "../components/PageContentModal";
import CheckoutPromotionBadge from "../components/CheckoutPromotionBadge";
import OtpVerificationModal from "../components/OtpVerificationModal";

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Dadra and Nagar Haveli", "Daman and Diu", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface AddressFormProps {
  data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    pinCode: string;
    country: string;
  };
  onChange: (data: any) => void;
  showSaveInfo?: boolean;
  saveInfo?: boolean;
  onSaveInfoChange?: (value: boolean) => void;
  phoneLabel?: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    pinCode?: string;
    country?: string;
  };
}

const AddressForm: React.FC<AddressFormProps> = ({
  data,
  onChange,
  showSaveInfo = false,
  saveInfo = true,
  onSaveInfoChange,
  phoneLabel = "Phone",
  errors = {}
}) => {
  // Common styles for all inputs to ensure consistency
  const inputClass = "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-0 transition";
  const getInputClass = (fieldName: keyof typeof errors) => `${inputClass} ${errors[fieldName] ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-brand-brown'}`;

  return (
    <div className="space-y-4">
      <div>
        <select
          value={data.country}
          onChange={(e) => onChange({ ...data, country: e.target.value })}
          className={getInputClass('country')}
        >
          <option>India</option>
        </select>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            placeholder="First name"
            className={getInputClass('firstName')}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            placeholder="Last name"
            className={getInputClass('lastName')}
            autoComplete="off"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="Address"
          className={getInputClass('address')}
          autoComplete="off"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <input
        type="text"
        placeholder="Apartment, suite, etc. (optional)"
        className={inputClass}
        autoComplete="off"
      />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="City"
            className={getInputClass('city')}
            autoComplete="off"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <select
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            className={getInputClass('state')}
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
        <div>
          <input
            type="text"
            value={data.pinCode}
            onChange={(e) => onChange({ ...data, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            placeholder="PIN code"
            className={getInputClass('pinCode')}
            autoComplete="off"
            maxLength={6}
          />
          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
        </div>
      </div>

      <div className="relative group flex items-center">
        <input
          type="text"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          placeholder={phoneLabel}
          className={getInputClass('phone')}
          autoComplete="off"
          maxLength={10}
        />
        <QuestionIcon
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-help"
        />
        <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block transition-opacity duration-200">
          <div className="bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap">
            In case we need to contact you about your order
            <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      {showSaveInfo && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={(e) => onSaveInfoChange?.(e.target.checked)}
            className="w-5 h-5 text-brand-brown rounded border-slate-300 focus:ring-0"
          />
          <span className="text-sm text-slate-700">Save this information for next time</span>
        </label>
      )}
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useWebsiteAuth();
  const { state, dispatch } = useCart();
  const { placeOrder, isCreatingOrder } = useOrders();
  const { config: guestConfig } = useGuestConfig();

  // Form state
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    whatsapp: '',
  });
  const [deliveryData, setDeliveryData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    country: 'India',
  });
  const [deliveryErrors, setDeliveryErrors] = useState<{
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    pinCode?: string;
    country?: string;
  }>({});
  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi" | "netbanking">("cod");
  const [shippingMethod] = useState<"standard" | "express" | "overnight">("standard");
  const [newsletter, setNewsletter] = useState(true);
  const [saveInfo, setSaveInfo] = useState(true);
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
  const [customerLookupError, setCustomerLookupError] = useState<string | null>(null);
  const placeOrderPendingRef = useRef(false);

  const { findCustomerByContact, loading: customerLookupLoading, error: customerLookupServiceError } = useFindCustomerByContact();
  const { addresses: userAddresses = [], isLoading: addressesLoading } = useAddresses();

  const isReturningCustomer = !existingCustomer || existingCustomer?.orderCount  > 0;
  const isFirstOrderEligible = !existingCustomer || existingCustomer.orderCount === 0;

  const isWelcomePromotion = (promotion: Promotion) => {
    const text = `${promotion.title} ${promotion.description || ''}`.toLowerCase();
    return text.includes('welcome') || text.includes('first order') || text.includes('new customer');
  };

  // Calculate base subtotal using centralized order math utilities
  const baseSubtotal = useMemo(() => {
    return getSubtotal(state?.items ?? []);
  }, [state?.items]);

  // Fetch applicable promotions based on cart value using the hook
  const { data: applicablePromotions = [] } = useApplicablePromotions(baseSubtotal);

  const filteredPromotions = useMemo(() => {
    if (isReturningCustomer) {
      return [];
    }

    if (isFirstOrderEligible) {
      return applicablePromotions.filter((promotion) => isWelcomePromotion(promotion));
    }

    return applicablePromotions;
  }, [applicablePromotions, isReturningCustomer, isFirstOrderEligible]);

  const { bestPromotion } = useCheckoutPromotions(baseSubtotal, filteredPromotions);
  const orderSummary = useMemo(() => {
    return getOrderSummary(state?.items ?? [], shippingMethod, bestPromotion, deliveryData);
  }, [state?.items, shippingMethod, bestPromotion, deliveryData]);

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

  const validateDeliveryAddress = () => {
    const errors: typeof deliveryErrors = {};

    // First Name validation
    if (!deliveryData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (deliveryData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(deliveryData.firstName.trim())) {
      errors.firstName = "First name can only contain letters and spaces";
    }

    // Last Name validation (optional but if provided, validate)
    if (deliveryData.lastName.trim() && !/^[a-zA-Z\s]+$/.test(deliveryData.lastName.trim())) {
      errors.lastName = "Last name can only contain letters and spaces";
    }

    // Address validation
    if (!deliveryData.address.trim()) {
      errors.address = "Address is required";
    } else if (deliveryData.address.trim().length < 10) {
      errors.address = "Please provide a complete address (minimum 10 characters)";
    }

    // City validation
    if (!deliveryData.city.trim()) {
      errors.city = "City is required";
    } else if (deliveryData.city.trim().length < 2) {
      errors.city = "City name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(deliveryData.city.trim())) {
      errors.city = "City name can only contain letters and spaces";
    }

    // State validation
    if (!deliveryData.state.trim()) {
      errors.state = "Please select a state";
    }

    // PIN Code validation
    if (!deliveryData.pinCode.trim()) {
      errors.pinCode = "PIN code is required";
    } else if (!/^[1-9][0-9]{5}$/.test(deliveryData.pinCode.trim())) {
      errors.pinCode = "Please enter a valid 6-digit PIN code";
    }

    // Country validation
    if (!deliveryData.country.trim()) {
      errors.country = "Country is required";
    }

    // Phone validation
    if (!deliveryData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9][0-9]{9}$/.test(deliveryData.phone.trim())) {
      errors.phone = "Please enter a valid 10-digit mobile number starting with 6-9";
    }

    setDeliveryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeliveryDataChange = (data: typeof deliveryData) => {
    setDeliveryData(data);
    // Clear errors for fields that are being edited
    const updatedErrors = { ...deliveryErrors };
    (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
      if (updatedErrors[key] && data[key]?.trim()) {
        delete updatedErrors[key];
      }
    });
    setDeliveryErrors(updatedErrors);
  };

  const applySavedAddress = (address: any) => {
    setSelectedAddressId(address.id);
    setDeliveryData((prev) => ({
      ...prev,
      firstName: address.name?.split(' ')?.[0] || prev.firstName,
      lastName: address.name?.split(' ')?.slice(1).join(' ') || prev.lastName,
      address: address.addressLine1 || prev.address,
      city: address.city || prev.city,
      state: address.state || prev.state,
      pinCode: address.postalCode || prev.pinCode,
      country: address.country || prev.country,
      phone: address.phone || prev.phone,
    }));
  };

  const toggleSavedAddress = (address: any) => {
    if (selectedAddressId === address.id) {
      setSelectedAddressId(null);
      return;
    }

    applySavedAddress(address);
  };

  const handlePlaceOrder = async () => {
    // Validate delivery address
    if (!validateDeliveryAddress()) {
      // Scroll to the first error field
      const firstErrorField = Object.keys(deliveryErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`) || document.querySelector('.delivery-section');
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // For guest users, require OTP verification
    if (!currentUser) {
      if (!contactData.email && !contactData.phone && !contactData.whatsapp) {
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
        paymentMethod,
        shippingAddressId: selectedAddressId || undefined,
        shippingAddress: {
          name: `${deliveryData.firstName} ${deliveryData.lastName}`,
          phone: deliveryData?.phone || contactData.phone || contactData.whatsapp,
          email: contactData.email,
          addressLine1: deliveryData.address,
          city: deliveryData.city,
          state: deliveryData.state,
          postalCode: deliveryData.pinCode,
          country: deliveryData.country,
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
            Date.now() + (shippingMethod === "standard" ? 6 : shippingMethod === "express" ? 3 : 1) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          shippingMethod,
          paymentMethod,
          address: `${deliveryData.firstName}, ${deliveryData.city}`,
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

  console.log(state?.items,'Checkout items');
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
      case 'email':
        return <Envelope size={20} />;
      case 'phone':
        return <Phone size={20} />;
      case 'whatsapp':
        return <ChatCircle size={20} />;
    }
  };

  const getContactPlaceholder = (type: 'email' | 'phone' | 'whatsapp') => {
    switch (type) {
      case 'email':
        return 'Enter email address';
      case 'phone':
        return 'Enter phone number';
      case 'whatsapp':
        return 'Enter WhatsApp number';
    }
  };

  return (
    <div className="min-h-screen bg-brand-latte">
      <CheckoutHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Section - Only for non-logged-in users */}
            {!currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 border border-brand-brown/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-brand-brown">Contact</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => openAuthModal("customer")}
                      className="text-brand-brown font-semibold text-sm hover:underline"
                    >
                      Sign In
                    </button>
                    {/* <button
                      onClick={() => openAuthModal("guest")}
                      className="text-brand-brown font-semibold text-sm hover:underline"
                    >
                      Continue as Guest
                    </button> */}
                  </div>
                </div>
                <div className="space-y-4">
                  {contactFields.map((type) => (
                    <div key={type}>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown opacity-60">
                          {getContactIcon(type as 'email' | 'phone' | 'whatsapp')}
                        </div>
                        <input
                          type={type === 'email' ? 'email' : 'tel'}
                          value={contactData[type as 'email' | 'phone' | 'whatsapp']}
                          onChange={(e) =>
                            setContactData((prev) => ({
                              ...prev,
                              [type]: e.target.value,
                            }))
                          }
                          onBlur={() => runCustomerLookup(contactData[type as 'email' | 'phone' | 'whatsapp'], type as 'email' | 'phone' | 'whatsapp')}
                          placeholder={getContactPlaceholder(type as 'email' | 'phone' | 'whatsapp')}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-brown focus:outline-none transition"
                        />
                      </div>
                    </div>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="w-5 h-5 text-brand-brown rounded"
                    />
                    <span className="text-sm text-slate-700">Email me with news and offers</span>
                  </label>

                  {customerLookupLoading && (
                    <div className="text-sm text-slate-500 mt-4">Checking for saved customer and addresses...</div>
                  )}

                  {existingCustomer && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-4">
                      <p className="text-sm text-slate-700 mb-3">
                        We found an existing customer profile for{' '}
                        <span className="font-semibold text-slate-900">
                          {existingCustomer.email || existingCustomer.phone || existingCustomer.whatsapp}
                        </span>.
                        Choose one of the saved addresses below, or enter a different shipping address.
                      </p>

                      {existingAddresses.length > 0 ? (
                        <div className="space-y-3">
                          {existingAddresses.map((address) => (
                            <button
                              key={address.id}
                              type="button"
                              onClick={() => toggleSavedAddress(address)}
                              className={`w-full text-left p-4 rounded-2xl border transition ${
                                selectedAddressId === address.id ? 'border-brand-brown bg-brand-brown/5' : 'border-slate-200 bg-white hover:border-brand-brown'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="font-semibold text-slate-900">{address.name || 'Shipping address'}</p>
                                  <p className="text-sm text-slate-600">
                                    {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                                  </p>
                                  <p className="text-sm text-slate-600">{address.country}</p>
                                  {selectedAddressId === address.id && (
                                    <p className="text-xs text-slate-500 mt-2">Click again to deselect and enter a different address.</p>
                                  )}
                                </div>
                                {selectedAddressId === address.id && (
                                  <span className="text-xs font-semibold text-brand-brown">Selected</span>
                                )}
                              </div>
                            </button>
                          ))}

                          {selectedAddressId && (
                            <button
                              type="button"
                              onClick={() => setSelectedAddressId(null)}
                              className="text-sm text-brand-brown font-semibold mt-2"
                            >
                              Use a different address
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">No saved shipping addresses found. Please enter a new address below.</p>
                      )}
                    </div>
                  )}

                  {customerLookupError && (
                    <p className="text-sm text-red-600 mt-3">{customerLookupError}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Delivery Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-brand-brown/10"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-6 flex items-center gap-2">
                <MapPin size={24} />
                Delivery
              </h2>

              {/* Address Selection for Logged-in Users */}
              {currentUser && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Shipping Address</h3>

                  {addressesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown"></div>
                    </div>
                  ) : userAddresses.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {userAddresses.map((address: Address) => (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => {
                            if (selectedAddressId === address.id) {
                              setSelectedAddressId(null);
                              setDeliveryData({
                                firstName: '',
                                lastName: '',
                                address: '',
                                city: '',
                                state: '',
                                pinCode: '',
                                country: 'India',
                                phone: '',
                              });
                            } else {
                              setSelectedAddressId(address.id);
                              setDeliveryData({
                                firstName: address.name?.split(' ')[0] || '',
                                lastName: address.name?.split(' ').slice(1).join(' ') || '',
                                address: address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ''),
                                city: address.city || '',
                                state: address.state || '',
                                pinCode: address.postalCode || '',
                                country: address.country || 'India',
                                phone: address.phone || '',
                              });
                            }
                          }}
                          className={`w-full text-left p-4 border-2 rounded-xl transition-all ${
                            selectedAddressId === address.id ? 'border-brand-brown bg-brand-brown/5' : 'border-slate-200 bg-white hover:border-brand-brown'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">{address.name || 'Shipping address'}</p>
                              <p className="text-sm text-slate-600">
                                {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-slate-600">{address.country}</p>
                              {selectedAddressId === address.id && (
                                <p className="text-xs text-slate-500 mt-2">Click again to deselect and enter a different address.</p>
                              )}
                            </div>
                            {selectedAddressId === address.id && (
                              <span className="text-xs font-semibold text-brand-brown">Selected</span>
                            )}
                          </div>
                        </button>
                      ))}

                      {selectedAddressId && (
                        <button
                          type="button"
                          onClick={() => setSelectedAddressId(null)}
                          className="text-sm text-brand-brown font-semibold mt-2"
                        >
                          Use a different address
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 mb-4">No saved shipping addresses found. Please enter a new address below.</p>
                  )}
                </div>
              )}

              <AddressForm
                data={deliveryData}
                onChange={handleDeliveryDataChange}
                showSaveInfo={true}
                saveInfo={saveInfo}
                onSaveInfoChange={setSaveInfo}
                phoneLabel="Phone"
                errors={deliveryErrors}
              />
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
                      borderColor: paymentMethod === method.id ? '#6B4423' : '#E5E7EB',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id as any}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-5 h-5 accent-brand-brown"
                    />
                    <span className="text-sm font-medium text-slate-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Billing Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-brand-brown/10"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-6">Billing address</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-brown transition"
                  onClick={() => setBillingData((prev) => ({ ...prev, sameAsShipping: true }))}
                >
                  <input
                    type="radio"
                    name="billing"
                    checked={billingData.sameAsShipping}
                    onChange={() => setBillingData((prev) => ({ ...prev, sameAsShipping: true }))}
                    className="w-5 h-5 accent-brand-brown"
                  />
                  <span className="text-sm font-medium text-slate-700">Same as shipping address</span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-brown transition"
                  onClick={() => setBillingData((prev) => ({ ...prev, sameAsShipping: false }))}
                >
                  <input
                    type="radio"
                    name="billing"
                    checked={!billingData.sameAsShipping}
                    onChange={() => setBillingData((prev) => ({ ...prev, sameAsShipping: false }))}
                    className="w-5 h-5 accent-brand-brown"
                  />
                  <span className="text-sm font-medium text-slate-700">Use a different billing address</span>
                </label>
              </div>

              {!billingData.sameAsShipping && (
                <div className="mt-6">
                  <AddressForm
                    data={billingData}
                    onChange={(data) => setBillingData((prev) => ({ ...prev, ...data }))}
                    showSaveInfo={false}
                    phoneLabel="Phone (Optional)"
                  />
                </div>
              )}
            </motion.div>

            {/* Pay Now Button */}
            <motion.button
              onClick={handlePlaceOrder}
              disabled={isCreatingOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingOrder ? "Processing..." : "Complete order"}
            </motion.button>

            {/* Footer Links */}
            <div className="flex justify-center gap-6 text-sm text-slate-600 flex-wrap">
              <button onClick={() => setOpenModal('returns-and-refunds')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Refund policy</button>
              <button onClick={() => setOpenModal('shipping-policy')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Shipping</button>
              <button onClick={() => setOpenModal('privacy-policy')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Privacy policy</button>
              <button onClick={() => setOpenModal('terms-and-conditions')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Terms of service</button>
              <button onClick={() => setOpenModal('about-sappey')} className="text-brand-brown font-medium hover:underline cursor-pointer bg-none border-none p-0">Contact</button>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 border border-brand-brown/10 sticky top-32 space-y-4"
            >
              {/* Items */}
              <div className="space-y-4 pb-4 border-b border-slate-200 max-h-64 overflow-y-auto px-2 pt-2">
                {(state?.items ?? []).map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    {/* Product Image Container */}
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl flex-shrink-0">
                      <img
                        src={item?.product?.images?.[0] || ''}
                        alt={item?.product?.name}
                        className="w-full h-full object-cover rounded-xl overflow-hidden border border-slate-100"
                      />

                      {/* Quantity Badge - Now has 'breathing room' because of the parent's padding */}
                      <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md z-20">
                        {item?.quantity}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-slate-700 line-clamp-2 mb-1">
                        {item?.product?.name}
                      </p>
                      <p className="text-sm font-medium text-slate-700 line-clamp-2 mb-1">
                        {item?.variant?.weight ? `${item.variant.weight} ${item.variant.weightUnit || 'g'}` : ''}
                      </p>

                      <p className="text-sm font-bold text-slate-900">
                        ₹{(((typeof item?.variant === 'object' && item?.variant?.price)
                          ? item.variant.price
                          : item?.product?.price ?? 0) * (item?.quantity ?? 1)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-brand-brown focus:outline-none text-sm"
                />
                <button className="w-full text-right text-brand-brown font-semibold text-sm hover:underline">
                  Apply
                </button>
              </div>

              {/* Applicable Promotions */}
              {filteredPromotions.length > 0 ? (
                <div className="space-y-2 pt-3">
                  {filteredPromotions.map((promo: any) => {
                    let discountAmount = 0;
                    let isFreeShipping = false;

                    if (promo.type === 'fixed_discount' && orderSummary.subtotal >= (promo.minOrderValue || 0)) {
                      discountAmount = promo.discountValue || 0;
                    } else if (promo.type === 'percentage_discount' && orderSummary.subtotal >= (promo.minOrderValue || 0)) {
                      discountAmount = (orderSummary.subtotal * (promo.discountValue || 0)) / 100;
                    } else if (promo.type === 'free_shipping' && orderSummary.subtotal >= (promo.minOrderValue || 0)) {
                      isFreeShipping = true;
                      discountAmount = orderSummary.shipping;
                    }

                    return (
                      <CheckoutPromotionBadge
                        key={promo.id}
                        promotion={promo}
                        cartValue={orderSummary.subtotal}
                        discount={discountAmount}
                        isFreeShipping={isFreeShipping}
                      />
                    );
                  })}
                </div>
              ) : isReturningCustomer ? (
                <p className="text-xs italic text-slate-500 pt-3">
                  This customer has placed previous orders, so promotional offers are not available.
                </p>
              ) : null}

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">₹{orderSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold text-brand-brown">{shippingLabel}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-slate-600">INR</span>
                      <span className="text-2xl">₹{orderSummary.total.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Including ₹{orderSummary.tax.toFixed(2)} in taxes
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Page Content Modals */}
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

      {/* OTP Verification Modal for Guest Checkout */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={(data) => {
          setVerifiedGuest({ contact: data.contact, type: data.type });
          setGuestToken(data.guestToken);
          setIsGuestVerified(true);
          setShowOtpModal(false);
        }}
        contactData={contactData}
        defaultType={contactData.email ? 'email' : contactData.phone ? 'phone' : 'whatsapp'}
      />
    </div>
  );
};

export default CheckoutPage;
