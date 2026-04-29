import { Address } from './address';
import { Promotion } from '../api/promotions';
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from '../schemas';
import { CartState } from "../context/CardContext";
import { useFormWithValidation } from '../hooks/useFormValidation';
// ============================================
// Contact & Guest Types
// ============================================
export type ContactType = 'email' | 'phone' | 'whatsapp';
export type ShippingMethod = 'standard' | 'express' | 'overnight';
export type PaymentMethod = 'cod' | 'razorpay' | 'cashfree';

export interface ContactInformationSectionProps {
    form: UseFormReturn<CheckoutFormData>;
    enabledContactTypes: {
        email?: boolean;
        phone?: boolean;
        whatsapp?: boolean;
    };
    onSignIn: () => void;
    onContactChange: (contact: string, type: 'email' | 'phone' | 'whatsapp') => void;
    customerLookupLoading: boolean;
    customerLookupError?: string | null;
}

export interface OrderSummaryData {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    // promotionDiscount?: number; // Added to match getOrderSummary output
}

export interface OrderSummaryProps {
    orderSummary: OrderSummaryData;
    filteredPromotions: Promotion[];
    isReturningCustomer: boolean;
    shippingLabel: string;
}

export interface VerifiedGuest {
    contact: string;
    type: ContactType;
}

export interface ExistingCustomer {
    id: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    name?: string;
    orderCount: number;
}

export interface GuestConfig {
    enabledContactTypes?: {
        email?: boolean;
        phone?: boolean;
        whatsapp?: boolean;
    };
}

// ============================================
// Form Data Types
// ============================================
export interface DeliveryAddressFormData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
    country: string;
}

export interface CheckoutFormDataType {
    contactEmail: string;
    contactPhone: string;
    contactWhatsapp: string;
    deliveryAddress: DeliveryAddressFormData;
    billingAddress: DeliveryAddressFormData;
    billingSameAsShipping: boolean;
    paymentMethod: PaymentMethod;
    shippingMethod: ShippingMethod;
    newsletter: boolean;
    saveInfo: boolean;
}

// ============================================
// Order Summary Types
// ============================================
export interface OrderSummaryData {
    subtotal: number;
    tax: number;
    shipping: number;
    shippingReady: boolean;
    promotionDiscount: number;
    total: number;
    selectedPromotion?: Promotion;
}

export interface OrderItemPayload {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
}

export interface PlaceOrderPayload {
    guestData?: {
        contact: string;
        contactType: ContactType;
    };
    items: OrderItemPayload[];
    subtotal: number;
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    shippingCost: number;
    paymentMethod: PaymentMethod;
    shippingAddressId?: string;
    shippingAddress: {
        name: string;
        phone: string;
        email: string;
        addressLine1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    billingAddress?: {
        name: string;
        phone: string;
        email: string;
        addressLine1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    promotionId?: string;
}

// ============================================
// Component Props Types
// ============================================
export interface GuestContactSectionProps {
    currentUser: any;
    guestConfig?: GuestConfig;
    checkoutForm: any;
    runCustomerLookup: (contact: string, type: ContactType) => Promise<void>;
    customerLookupLoading: boolean;
    openAuthModal: (type: string) => void;
}

export interface AddressSectionProps {
    currentUser: any;
    userAddresses: Address[];
    existingAddresses: Address[];
    selectedAddressId: string | null;
    newDestinationAddress: boolean;
    checkoutForm: any;
    onToggleSavedAddress: (address: Address) => void;
    onAddressSelect: (address: Address) => void;
    onToggleNewAddress: () => void;
}

export interface OrderSummaryPanelProps {
    orderSummary: OrderSummaryData;
    filteredPromotions: Promotion[];
    isReturningCustomer: boolean;
    shippingLabel: string;
}

export interface CheckoutPageContextValue {
    isGuestVerified: boolean;
    setIsGuestVerified: (value: boolean) => void;
    guestToken: string | null;
    setGuestToken: (token: string | null) => void;
    verifiedGuest: VerifiedGuest | null;
    setVerifiedGuest: (guest: VerifiedGuest | null) => void;
    existingCustomer: ExistingCustomer | null;
    setExistingCustomer: (customer: ExistingCustomer | null) => void;
    existingAddresses: Address[];
    setExistingAddresses: (addresses: Address[]) => void;
    selectedAddressId: string | null;
    setSelectedAddressId: (id: string | null) => void;
    newDestinationAddress: boolean;
    setNewDestinationAddress: (value: boolean) => void;
    customerLookupError: string | null;
    setCustomerLookupError: (error: string | null) => void;
}

export interface OtpVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: (data: { contact: string; type: 'email' | 'phone' | 'whatsapp'; guestToken: string }) => void;
    contactData: {
        email: string;
        phone: string;
        whatsapp: string;
    };
    defaultType?: 'email' | 'phone' | 'whatsapp';
}

export interface PageContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    slug: string;
    title: string;
}

export interface CheckoutSidebarProps {
    state: CartState;
    orderSummary: any;
    filteredPromotions: any[];
    isReturningCustomer: boolean;
    shippingLabel: string;
}

export interface PromotionBadgeProps {
    promotion?: {
        id: string;
        title: string;
        type: 'fixed_discount' | 'percentage_discount' | 'free_gift' | 'free_shipping' | 'bundle' | 'tiered';
        bannerText: string;
        minOrderValue?: number;
        discountValue?: number;
        freeText?: string;
        badgeIcon?: string;
    };
    cartValue: number;
    discount?: number;
    isFreeShipping?: boolean;
}

export interface CheckoutItemsProps {
    state: CartState;
}

export interface BillingAddressSectionProps {
    form: UseFormReturn<CheckoutFormData>;
}

export interface AddressFormProps {
    form: ReturnType<typeof useFormWithValidation<CheckoutFormData>>;
    addressFieldPrefix: "deliveryAddress" | "billingAddress";
    showSaveInfo?: boolean;
    phoneLabel?: string;
    onPincodeServiceabilityChange?: (isServiceable: boolean | null) => void;
}

export interface PaymentSectionProps {
    form: UseFormReturn<CheckoutFormData>;
}

export interface ShippingDetailsSectionProps {
    form: UseFormReturn<CheckoutFormData>;
    userAddresses: Address[];
    existingAddresses: Address[];
    selectedAddressId: string | null;
    selectedAddressServiceable: boolean | null;
    selectedAddressServiceabilityLoading: boolean;
    newDestinationAddress: boolean;
    currentUser: any;
    existingCustomer: any;
    onToggleSavedAddress: (address: Address) => void;
    onSetNewDestinationAddress: (value: boolean) => void;
    onCancelNewAddress: () => void;
    onDeliveryPincodeServiceabilityChange?: (isServiceable: boolean | null) => void;
}