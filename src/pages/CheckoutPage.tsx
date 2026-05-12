import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CardContext";
import { useWebsiteAuth } from "../context/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { useCheckoutPromotions } from "../hooks/useCheckoutPromotions";
import { useApplicablePromotions } from "../api/promotions";
import { getOrderSummary, buildOrderItemsPayload, getSubtotal, getTotalTaxPaise } from "../utils/checkoutCalculations";
import { Package } from "@phosphor-icons/react";
import { useGuestConfig, useFindCustomerByContact } from "../api/guest";
import { useAddresses } from "../api/address/hooks";
import { useCheckPincodeServiceability, useCalculateShippingCharges } from "../api/integrations/delhivery";
import { useFormWithValidation } from "../hooks/useFormValidation";
import { checkoutFormSchema, CheckoutFormData } from "../schemas";
import {
  ContactInformationSection,
  ShippingDetailsSection,
  PaymentSection,
  BillingAddressSection,
  CheckoutSidebar,
  CheckoutHeader,
  OtpVerificationModal,
  PageContentModal
} from "../components/Checkout";

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
  const [selectedAddressServiceable, setSelectedAddressServiceable] = useState<boolean | null>(null);
  const [selectedAddressServiceabilityLoading, setSelectedAddressServiceabilityLoading] = useState<boolean>(false);
  const [deliveryAddressServiceable, setDeliveryAddressServiceable] = useState<boolean | null>(null);
  const [newDestinationAddress, setNewDestinationAddress] = useState<boolean>(false);
  const [customerLookupError, setCustomerLookupError] = useState<string | null>(null);
  const placeOrderPendingRef = useRef(false);
  const { findCustomerByContact, loading: customerLookupLoading, error: customerLookupServiceError } = useFindCustomerByContact();
  const { mutate: checkPincodeServiceability } = useCheckPincodeServiceability();
  const { addresses: userAddresses = [] } = useAddresses();
  const isReturningCustomer = Boolean(existingCustomer && existingCustomer.orderCount > 0);
  const isFirstOrderEligible = Boolean(existingCustomer && existingCustomer.orderCount === 0);
  // const isWelcomePromotion = (promotion: Promotion) => {
  //   const text = `${promotion.title} ${promotion.description || ''}`.toLowerCase();
  //   return text.includes('welcome') || text.includes('first order') || text.includes('new customer');
  // };

  const shippingOriginPincode = import.meta.env.VITE_ORIGIN_PINCODE?.trim() || '';
  const deliveryPincode = checkoutForm.watch("deliveryAddress.pinCode");
  const shippingMethod = checkoutForm.watch("shippingMethod");

  const getCartWeightGrams = (items: any[] = []) => {
    return items.reduce((sum, item) => {
      let rawWeight = item?.variant?.weight ?? item?.product?.weight ?? 0;
      let weight = Number(rawWeight) || 0;
      const unit = String(item?.variant?.weightUnit ?? item?.product?.weightUnit ?? 'G').toLowerCase();
      if (unit === 'kg') weight *= 1000;
      return sum + weight * (Number(item?.quantity) || 0);
    }, 0);
  };

  const cartWeightGrams = useMemo(() => getCartWeightGrams(state?.items ?? []), [state?.items]);

  const shippingChargeParams = useMemo(() => ({
    d_pin: shippingOriginPincode,
    o_pin: deliveryPincode,
    cgm: cartWeightGrams,
    md: "E",
    ss: "Delivered",
    pt: "Pre-paid"
    // shipping_method: shippingMethod,
  }), [shippingOriginPincode, deliveryPincode, cartWeightGrams, shippingMethod]);

  const { data: shippingChargesApiResponse } = useCalculateShippingCharges(shippingChargeParams, {
    enabled: Boolean(shippingChargeParams.d_pin && shippingChargeParams.o_pin),
  });

  const shippingChargesFromApi = useMemo(() => {
    // 1. Handle Array vs Object safely
    const apiData = Array.isArray(shippingChargesApiResponse?.data) && shippingChargesApiResponse.data.length > 0
      ? shippingChargesApiResponse.data[0]
      : shippingChargesApiResponse;

    if (!apiData) return 0;

    // 2. Priority check for the keys found in your JSON
    // total_amount (104.14) or gross_amount (88.26)
    if (typeof apiData.total_amount === 'number') return apiData.total_amount;
    if (typeof apiData.gross_amount === 'number') return apiData.gross_amount;

    // 3. Fallback for your previous logic
    if (typeof apiData.amount === 'number') return apiData.amount;
    if (typeof apiData.charge === 'number') return apiData.charge;
    if (typeof apiData.total === 'number') return apiData.total;
    if (typeof apiData.value === 'number') return apiData.value;

    if (Array.isArray(apiData.charges)) {
      return Number(apiData.charges[0]?.amount || 0);
    }

    return Number(apiData?.rate || apiData?.fee || 0);
  }, [shippingChargesApiResponse]);

  const baseSubtotal = useMemo(() => {
    return getSubtotal(state?.items ?? []);
  }, [state?.items]);
  const fromPaise = (value: number): number => parseFloat((value / 100).toFixed(2));
  const baseTax = fromPaise(getTotalTaxPaise(state?.items ?? []))
  const { data: applicablePromotions = [] } = useApplicablePromotions(baseSubtotal + baseTax);

  const isWelcomePromotion = (promo: any) => {
    return promo.type === 'fixed_discount' && promo.title.toLowerCase().includes('welcome');
  };

  const filteredPromotions = useMemo(() => {

    // 1. If they are a returning customer, filter OUT the welcome offers 
    // but keep general offers (Free shipping, gifts, etc.)
    if (isReturningCustomer) {
      return applicablePromotions.filter((promotion) => !isWelcomePromotion(promotion));
    }

    // 2. If they are eligible for a first order, you might want to show 
    // ONLY the welcome offer or ALL offers. 
    // Usually, showing ALL is better for conversion.
    if (isFirstOrderEligible) {
      // If you want ONLY welcome offers:
      // return applicablePromotions.filter((promotion) => isWelcomePromotion(promotion));

      // If you want BOTH welcome + general offers (Recommended):
      return applicablePromotions;
    }

    // 3. Fallback: Return all active promotions
    return applicablePromotions;
  }, [applicablePromotions, isReturningCustomer, isFirstOrderEligible]);

  const { bestPromotion } = useCheckoutPromotions(baseSubtotal, filteredPromotions);
  const orderSummary = useMemo(() => {
    const deliveryValues = checkoutForm.watch("deliveryAddress");
    const shippingMethod = checkoutForm.watch("shippingMethod");
    const baseSummary = getOrderSummary(state?.items ?? [], shippingMethod, bestPromotion, {
      firstName: deliveryValues.firstName || '',
      lastName: deliveryValues.lastName || '',
      address: deliveryValues.address || '',
      city: deliveryValues.city || '',
      state: deliveryValues.state || '',
      pinCode: deliveryValues.pinCode || '',
      phone: deliveryValues.phone || '',
      country: deliveryValues.country || 'India',
    });

    const freeShippingApplied = bestPromotion?.promotion?.type === 'free_shipping';
    const rawShipping = shippingChargesFromApi !== null && !Number.isNaN(shippingChargesFromApi)
      ? Number(shippingChargesFromApi)
      : baseSummary.shipping;
    const shipping = freeShippingApplied ? 0 : rawShipping;
    const promotionDiscount = baseSummary.promotionDiscount;

    const hasApiShipping = shippingChargesFromApi !== null && !Number.isNaN(shippingChargesFromApi) && shippingChargesFromApi > 0;
    const shippingReady = baseSummary.shippingReady || hasApiShipping;

    return {
      ...baseSummary,
      shipping,
      promotionDiscount,
      shippingReady,
      total: Math.round(baseSummary.subtotal - promotionDiscount + baseSummary.tax + shipping),
      totalBeforePromo: Number((baseSummary.subtotal + baseSummary.tax + rawShipping).toFixed(2)),
    };
  }, [state?.items, checkoutForm.watch(), bestPromotion, shippingChargesFromApi]);

  const shippingLabel = orderSummary?.shippingReady
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
    setSelectedAddressServiceable(null);
    checkoutForm.setValue('deliveryAddress.firstName', address.name?.split(' ')?.[0] || '');
    checkoutForm.setValue('deliveryAddress.lastName', address.name?.split(' ')?.slice(1).join(' ') || '');
    checkoutForm.setValue('deliveryAddress.address', address.addressLine1 || '');
    checkoutForm.setValue('deliveryAddress.city', address.city || '');
    checkoutForm.setValue('deliveryAddress.state', address.state || '');
    checkoutForm.setValue('deliveryAddress.pinCode', address.postalCode || '');
    checkoutForm.setValue('deliveryAddress.country', address.country || 'India');
    checkoutForm.setValue('deliveryAddress.phone', address.phone || '');

    const pincode = address.postalCode?.toString?.() || '';
    if (/^\d{6}$/.test(pincode)) {
      setSelectedAddressServiceabilityLoading(true);
      checkPincodeServiceability(pincode, {
        onSuccess: (response) => {
          const isServiceable = response.data?.delivery_codes?.some((item: any) => {
            const details = item.postal_code;
            return (
              details?.pin?.toString() === pincode &&
              details?.pre_paid === 'Y' &&
              details?.cod === 'Y' &&
              details?.cash === 'Y' &&
              details?.repl === 'Y' &&
              details?.pickup === 'Y'
            );
          }) || false;
          setSelectedAddressServiceable(isServiceable);
          setSelectedAddressServiceabilityLoading(false);
        },
        onError: () => {
          setSelectedAddressServiceable(false);
          setSelectedAddressServiceabilityLoading(false);
        }
      });
    }
  };

  const toggleSavedAddress = (address: any) => {
    if (selectedAddressId === address.id) {
      setSelectedAddressId(null);
      setSelectedAddressServiceable(null);
      setDeliveryAddressServiceable(null);
      return;
    }

    setDeliveryAddressServiceable(null);
    applySavedAddress(address);
  };

  const handleSetNewDestinationAddress = (value: boolean) => {
    setNewDestinationAddress(value);
    if (value) {
      setSelectedAddressId(null);
      setSelectedAddressServiceable(null);
      setDeliveryAddressServiceable(null);
    }
  };

  const handlePlaceOrder = async () => {
    const isFormValid = await checkoutForm.trigger();
    if (!isFormValid) {
      // console.log("Validation failed", checkoutForm.formState.errors);
      return;
    }

    const formValues = checkoutForm.getValues();
    const deliveryValues = formValues.deliveryAddress;
    const billingValues = formValues.billingSameAsShipping ? deliveryValues : formValues.billingAddress;
    const effectiveServiceability = selectedAddressId ? selectedAddressServiceable : deliveryAddressServiceable;
    if (effectiveServiceability === false) {
      alert("Cannot place order because delivery is not available for the selected PIN code.");
      return;
    }

    if (!currentUser) {
      if (!formValues.contactEmail && !formValues.contactPhone && !formValues.contactWhatsapp) {
        alert("Please provide a Email");
        if (checkoutForm.setFocus) {
          if (document.querySelector('input[name="contactEmail"]')) {
            checkoutForm.setFocus('contactEmail');
          } else if (document.querySelector('input[name="contactPhone"]')) {
            checkoutForm.setFocus('contactPhone');
          } else if (document.querySelector('input[name="contactWhatsapp"]')) {
            checkoutForm.setFocus('contactWhatsapp');
          }
        } else {
          const firstField = document.querySelector<HTMLInputElement>('input[name="contactEmail"], input[name="contactPhone"], input[name="contactWhatsapp"]');
          firstField?.focus();
        }
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

  // const enabledContactTypes = guestConfig?.enabledContactTypes || { email: true };

  return (
    <div className="min-h-screen bg-brand-latte">
      <CheckoutHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-6">
            {!currentUser && (
              <ContactInformationSection
                form={checkoutForm}
                enabledContactTypes={guestConfig?.enabledContactTypes || { email: true }}
                onSignIn={() => openAuthModal("customer")}
                onContactChange={runCustomerLookup}
                customerLookupLoading={customerLookupLoading}
                customerLookupError={customerLookupError}
              />
            )}

            {/* --- DELIVERY SECTION --- */}
            <ShippingDetailsSection
              form={checkoutForm}
              userAddresses={userAddresses}
              existingAddresses={existingAddresses}
              selectedAddressId={selectedAddressId}
              selectedAddressServiceable={selectedAddressServiceable}
              selectedAddressServiceabilityLoading={selectedAddressServiceabilityLoading}
              newDestinationAddress={newDestinationAddress}
              currentUser={currentUser}
              existingCustomer={existingCustomer}
              onToggleSavedAddress={toggleSavedAddress}
              onSetNewDestinationAddress={handleSetNewDestinationAddress}
              onDeliveryPincodeServiceabilityChange={setDeliveryAddressServiceable}
              onCancelNewAddress={() => {
                setNewDestinationAddress(false);
                const firstAddr = currentUser ? userAddresses[0] : existingAddresses[0];
                if (firstAddr) toggleSavedAddress(firstAddr);
              }}
            />

            {/* Payment Section */}
            <PaymentSection form={checkoutForm} />

            {/* Billing Address Section */}
            <BillingAddressSection form={checkoutForm} />
            <motion.button
              onClick={handlePlaceOrder}
              disabled={isCreatingOrder || selectedAddressServiceable === false || (!selectedAddressId && deliveryAddressServiceable === false)}
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
            <CheckoutSidebar
              state={state}
              dispatch={dispatch}
              orderSummary={orderSummary}
              filteredPromotions={filteredPromotions}
              isReturningCustomer={isReturningCustomer}
              shippingLabel={shippingLabel}
            />
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