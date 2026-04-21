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
import { Input, Select, Checkbox } from "../components/ui";
import { useFormWithValidation } from "../hooks/useFormValidation";
import { checkoutFormSchema, CheckoutFormData } from "../schemas";
import { INDIAN_STATES } from "../constants";

interface AddressFormProps {
  form: ReturnType<typeof useFormWithValidation<CheckoutFormData>>;
  addressFieldPrefix: "deliveryAddress" | "billingAddress";
  showSaveInfo?: boolean;
  phoneLabel?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  form,
  addressFieldPrefix,
  showSaveInfo = false,
  phoneLabel = "Phone",
}) => {
  const { register, formState: { errors } } = form;

  const field = (fieldName: string) => `${addressFieldPrefix}.${fieldName}` as const;
  const getNestedError = (fieldName: string) => {
    const errorObj = errors[addressFieldPrefix] as any;
    return errorObj?.[fieldName];
  };

  return (
    <div className="space-y-4">
      <Select
        label="Country"
        name={field("country")}
        register={register}
        error={getNestedError("country")}
        options={[{ value: 'India', label: 'India' }]}
        placeholder="Select Country"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name={field("firstName")}
          register={register}
          error={getNestedError("firstName")}
          placeholder="First name"
        />
        <Input
          label="Last Name"
          name={field("lastName")}
          register={register}
          error={getNestedError("lastName")}
          placeholder="Last name"
        />
      </div>

      <Input
        label="Address"
        name={field("address")}
        register={register}
        error={getNestedError("address")}
        placeholder="Address"
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          name={field("city")}
          register={register}
          error={getNestedError("city")}
          placeholder="City"
        />
        <Select
          label="State"
          name={field("state")}
          register={register}
          error={getNestedError("state")}
          options={INDIAN_STATES.map(state => ({ value: state, label: state }))}
          placeholder="Select State"
        />
        <Input
          label="PIN Code"
          name={field("pinCode")}
          register={register}
          error={getNestedError("pinCode")}
          placeholder="PIN code"
          type="text"
          maxLength={6}
        />
      </div>

      <div className="relative group">
        <Input
          label={phoneLabel}
          name={field("phone")}
          register={register}
          error={getNestedError("phone")}
          placeholder={phoneLabel}
          type="tel"
          maxLength={10}
        />
        <QuestionIcon
          size={20}
          className="absolute right-4 top-1/3 -translate-y-1/2 text-slate-400 cursor-help z-10"
        />
        <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block transition-opacity duration-200">
          <div className="bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap">
            In case we need to contact you about your order
            <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>

      {showSaveInfo && (
        <Checkbox
          label="Save this information for next time"
          name="saveInfo"
          checked={form.watch("saveInfo")}
          onChange={(e) => form.setValue("saveInfo", e.target.checked)}
        />
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

  // Consolidated Checkout Form - manages all form-related state
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
                          value={checkoutForm.watch(`contact${type.charAt(0).toUpperCase() + type.slice(1)}` as any)}
                          onChange={(e) => {
                            const fieldName = `contact${type.charAt(0).toUpperCase() + type.slice(1)}` as any;
                            checkoutForm.setValue(fieldName, e.target.value);
                          }}
                          onBlur={() => {
                            const fieldName = `contact${type.charAt(0).toUpperCase() + type.slice(1)}` as any;
                            const value = checkoutForm.watch(fieldName);
                            runCustomerLookup(value, type as 'email' | 'phone' | 'whatsapp');
                          }}
                          placeholder={getContactPlaceholder(type as 'email' | 'phone' | 'whatsapp')}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-brown focus:outline-none transition"
                        />
                      </div>
                    </div>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={checkoutForm.watch("newsletter")}
                      onChange={(e) => checkoutForm.setValue("newsletter", e.target.checked)}
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
                              className={`w-full text-left p-4 rounded-2xl border transition ${selectedAddressId === address.id ? 'border-brand-brown bg-brand-brown/5' : 'border-slate-200 bg-white hover:border-brand-brown'
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-brand-brown/10"
            >
              <h2 className="text-xl font-bold text-brand-brown mb-6 flex items-center gap-2">
                <MapPin size={24} />
                Delivery
              </h2>

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
                          onClick={() => toggleSavedAddress(address)}
                          className={`w-full text-left p-4 border-2 rounded-xl transition-all ${selectedAddressId === address.id ? 'border-brand-brown bg-brand-brown/5' : 'border-slate-200 bg-white hover:border-brand-brown'
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
                form={checkoutForm}
                addressFieldPrefix="deliveryAddress"
                showSaveInfo={true}
                phoneLabel="Phone"
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
              className="bg-white rounded-2xl p-6 border border-brand-brown/10 sticky top-32 space-y-4"
            >
              <div className="space-y-4 pb-4 border-b border-slate-200 max-h-64 overflow-y-auto px-2 pt-2">
                {(state?.items ?? []).map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl flex-shrink-0">
                      <img
                        src={item?.product?.images?.[0] || ''}
                        alt={item?.product?.name}
                        className="w-full h-full object-cover rounded-xl overflow-hidden border border-slate-100"
                      />
                      <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md z-20">
                        {item?.quantity}
                      </span>
                    </div>

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