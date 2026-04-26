import { Address } from './address';
import { Promotion } from '../api/promotions';

// ============================================
// Contact & Guest Types
// ============================================
export type ContactType = 'email' | 'phone' | 'whatsapp';
export type ShippingMethod = 'standard' | 'express' | 'overnight';
export type PaymentMethod = 'cod' | 'razorpay' | 'cashfree';

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

export interface PaymentSectionProps {
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
}

export interface BillingAddressSectionProps {
    billingSameAsShipping: boolean;
    checkoutForm: any;
    onToggleBillingAddress: (same: boolean) => void;
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
