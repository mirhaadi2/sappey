import { Promotion } from '../api/promotions';
import { OrderItem } from '../api/orders/types';

export interface CheckoutItem {
    product?: Record<string, any>;
    variant?: Record<string, any>;
    quantity?: number;
}

export interface CheckoutPromotionApplicability {
    promotion: Promotion;
    discountAmount: number;
    finalPrice: number;
}

export interface CheckoutOrderSummary {
    items: number;
    subtotal: number;
    tax: number;
    shipping: number;
    promotionDiscount: number;
    selectedPromotion: Promotion | null;
    total: number;
    totalBeforePromo: number;
    shippingReady: boolean;
}

const SHIPPING_RATES: Record<string, number> = {
    standard: 9.99,
    express: 24.99,
    overnight: 49.99,
};

const sanitizeNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? 0 : numberValue;
};

const toPaise = (value: number): number => Math.round(value * 100);
const fromPaise = (value: number): number => parseFloat((value / 100).toFixed(2));

export const getItemUnitPrice = (item: CheckoutItem): number => {
    // If there is a discounted price on the variant, THAT is the unit price.
    // This is distinct from a coupon/promotion.
    return sanitizeNumber(
        item?.variant?.discountedPrice || 
        item?.variant?.price || 
        item?.product?.price || 0
    );
};

export const getItemOriginalUnitPrice = (item: CheckoutItem): number => {
    return sanitizeNumber(item?.variant?.price || item?.product?.price || 0);
};

export const getItemDiscountPercentage = (item: CheckoutItem): number => {
    const original = getItemOriginalUnitPrice(item);
    const current = getItemUnitPrice(item);
    
    if (original > current && original > 0) {
        return Math.floor(((original - current) / original) * 100);
    }
    return 0;
};

export const getItemQuantity = (item: CheckoutItem): number => Math.max(0, sanitizeNumber(item?.quantity));

export const getItemGstRate = (item: CheckoutItem): number => {
    const rate = sanitizeNumber(item?.product?.gst_rate ?? item?.variant?.gst_rate ?? 0);
    return rate;
};

export const getItemSubtotalPaise = (item: CheckoutItem): number => {
    const unitPrice = getItemUnitPrice(item);
    const quantity = getItemQuantity(item);
    return toPaise(unitPrice * quantity);
};

export const getItemTaxPaise = (item: CheckoutItem): number => {
    const subtotalPaise = getItemSubtotalPaise(item);
    const gstRate = getItemGstRate(item);
    return Math.round((subtotalPaise * gstRate) / 100);
};

export const getSubtotalPaise = (items: CheckoutItem[] = []): number => {
    return items.reduce((sum, item) => sum + getItemSubtotalPaise(item), 0);
};

export const getTotalTaxPaise = (items: CheckoutItem[] = []): number => {
    return items.reduce((sum, item) => sum + getItemTaxPaise(item), 0);
};

export const isShippingAddressComplete = (address: Record<string, any>): boolean => {
    return Boolean(
        address?.address?.trim() &&
        address?.city?.trim() &&
        address?.state?.trim() &&
        address?.pinCode?.trim()
    );
};

export const getShippingCostPaise = (shippingMethod: string, shippingReady: boolean): number => {
    if (!shippingReady) return 0;
    const rate = SHIPPING_RATES[shippingMethod] ?? 0;
    return toPaise(rate);
};

export const getSubtotal = (items: CheckoutItem[] = []): number => fromPaise(getSubtotalPaise(items));

export const getOrderSummary = (
    items: CheckoutItem[] = [],
    shippingMethod: string,
    selectedPromotion: CheckoutPromotionApplicability | null,
    deliveryAddress: Record<string, any> = {}
): CheckoutOrderSummary => {
    // Subtotal already respects item-wise discounts
    const subtotalPaise = getSubtotalPaise(items); 
    const taxPaise = getTotalTaxPaise(items);
    const shippingPaise = getShippingCostPaise(shippingMethod, isShippingAddressComplete(deliveryAddress));
    
    // PROMOTION is a separate bucket
    const promotionDiscountPaise = selectedPromotion ? toPaise(selectedPromotion.discountAmount || 0) : 0;

    const totalPaise = subtotalPaise - promotionDiscountPaise + taxPaise + shippingPaise;
    const total = Math.round(fromPaise(totalPaise));

    return {
        items: items.length,
        subtotal: fromPaise(subtotalPaise), // Sum of (item-wise discounted price * qty)
        tax: fromPaise(taxPaise),
        shipping: fromPaise(shippingPaise),
        promotionDiscount: fromPaise(promotionDiscountPaise), // Coupon savings only
        selectedPromotion: selectedPromotion?.promotion ?? null,
        total,
        totalBeforePromo: fromPaise(subtotalPaise + taxPaise + shippingPaise),
        shippingReady: isShippingAddressComplete(deliveryAddress),
    };
};

export const buildOrderItemsPayload = (items: CheckoutItem[] = []): OrderItem[] => {
    return items.map((item) => {
        const variantData = item?.variant || {};
        const unitPrice = getItemUnitPrice(item); // This is now the effective price
        const originalPrice = getItemOriginalUnitPrice(item);

        return {
            productId: item?.product?.id ?? '',
            productVariantId: variantData?.id ?? item?.product?.id ?? '',
            sku: variantData?.sku ?? '',
            quantity: getItemQuantity(item),
            price: originalPrice, // The "MSRP"
            discountedPrice: unitPrice, // The actual price charged
            discountedPercent: variantData?.discounted_percent ?? variantData?.discountedPercent  ?? getItemDiscountPercentage(item),
            gstRate: getItemGstRate(item).toString(),
            gstAmount: fromPaise(getItemTaxPaise(item)),
        };
    });
};
