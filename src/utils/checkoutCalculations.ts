import { Promotion } from '../api/promotions';

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
    const variantPrice = item?.variant && typeof item.variant === 'object' ? sanitizeNumber(item.variant.price) : 0;
    if (variantPrice > 0) {
        return variantPrice;
    }

    return sanitizeNumber(item?.product?.price);
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
    const subtotalPaise = getSubtotalPaise(items);
    const taxPaise = getTotalTaxPaise(items);
    const shippingReady = isShippingAddressComplete(deliveryAddress);
    const shippingPaise = getShippingCostPaise(shippingMethod, shippingReady);
    const promotionDiscountPaise = selectedPromotion ? toPaise(selectedPromotion.discountAmount || 0) : 0;

    const totalPaise = subtotalPaise - promotionDiscountPaise + taxPaise + shippingPaise;

    return {
        items: items.length,
        subtotal: fromPaise(subtotalPaise),
        tax: fromPaise(taxPaise),
        shipping: fromPaise(shippingPaise),
        promotionDiscount: fromPaise(promotionDiscountPaise),
        selectedPromotion: selectedPromotion?.promotion ?? null,
        total: fromPaise(totalPaise),
        totalBeforePromo: fromPaise(subtotalPaise + taxPaise + shippingPaise),
        shippingReady,
    };
};

export const buildOrderItemsPayload = (items: CheckoutItem[] = []): Record<string, any>[] => {
    return items.map((item) => {
        const variantData = item?.variant && typeof item.variant === 'object' ? item.variant : {};
        const unitPrice = getItemUnitPrice(item);
        const quantity = getItemQuantity(item);

        return {
            productId: item?.product?.id ?? '',
            productVariantId: variantData?.id ?? item?.product?.id ?? '',
            sku: variantData?.sku ?? '',
            quantity,
            price: unitPrice,
            discountedPrice: sanitizeNumber(variantData?.discountedPrice ?? variantData?.price ?? item?.product?.price ?? 0),
            discountedPercent: sanitizeNumber(variantData?.discountedPercent ?? 0),
            gstRate: getItemGstRate(item).toString(),
            gstAmount: fromPaise(getItemTaxPaise(item)),
        };
    });
};
