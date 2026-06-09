import type { Promotion } from '../api/promotions';

export interface PromotionCartItem {
    productId: string;
    categoryId?: string;
    quantity: number;
    price: number;
}

const normalizeString = (value?: string | number | null): string => {
    if (value === undefined || value === null) return '';
    return String(value).trim().toLowerCase();
};

const normalizeList = (values?: string[] | Set<string> | null): string[] => {
    const list = values instanceof Set ? Array.from(values) : values ?? [];
    return list.map(normalizeString).filter(Boolean);
};

const buildSearchSet = (items: PromotionCartItem[], selector: (item: PromotionCartItem) => string | undefined): Set<string> => {
    return new Set(
        items
            .map(selector)
            .map(normalizeString)
            .filter(Boolean)
    );
};

const anyMatch = (required: string[], actual: Set<string>): boolean => {
    if (required.length === 0) return true;
    return required.some((value) => actual.has(value));
};

const allMatch = (required: string[], actual: Set<string>): boolean => {
    if (required.length === 0) return true;
    return required.every((value) => actual.has(value));
};

const getCartTotals = (cartItems: PromotionCartItem[]) => {
    return cartItems.reduce(
        (acc, item) => {
            const quantity = Number(item.quantity) || 0;
            return {
                totalQuantity: acc.totalQuantity + quantity,
                totalValue: acc.totalValue + (Number(item.price) || 0) * quantity,
            };
        },
        { totalQuantity: 0, totalValue: 0 }
    );
};

const requiresAllMatches = (promotion: Promotion): boolean => {
    return promotion.type === 'free_gift' || promotion.type === 'bundle' || promotion.type === 'tiered';
};

const hasExplicitEligibilityConditions = (promotion: Promotion): boolean => {
    return Boolean(
        promotion.minOrderValue ||
        promotion.maxOrderValue ||
        promotion.minQuantity ||
        promotion.maxQuantity ||
        (promotion.applicableCategories?.length ?? 0) > 0 ||
        (promotion.applicableProducts?.length ?? 0) > 0 ||
        (promotion.excludeProducts?.length ?? 0) > 0
    );
};

export const isPromotionApplicableToCart = (
    promotion: Promotion,
    cartItems: PromotionCartItem[] = [],
    subtotal: number = 0
): boolean => {
    if (!promotion || !promotion.isActive) return false;
    if (promotion.displayOnCheckout === false) return false;

    const normalizedProductIds = buildSearchSet(cartItems, (item) => item.productId);
    const normalizedCategories = buildSearchSet(cartItems, (item) => item.categoryId);
    const excludedProductIds = normalizeList(promotion.excludeProducts);
    const requiredProductIds = normalizeList(promotion.applicableProducts);
    const requiredCategories = normalizeList(promotion.applicableCategories);
    const { totalQuantity } = getCartTotals(cartItems);
    const requireAll = requiresAllMatches(promotion);

    if (promotion.minOrderValue && subtotal < Number(promotion.minOrderValue)) {
        return false;
    }

    if (promotion.maxOrderValue && subtotal > Number(promotion.maxOrderValue)) {
        return false;
    }

    if (promotion.minQuantity && totalQuantity < Number(promotion.minQuantity)) {
        return false;
    }

    if (promotion.maxQuantity && totalQuantity > Number(promotion.maxQuantity)) {
        return false;
    }

    if (!hasExplicitEligibilityConditions(promotion) && promotion.type !== 'fixed_discount' && promotion.type !== 'percentage_discount') {
        return false;
    }

    if (excludedProductIds.length > 0) {
        for (const excluded of excludedProductIds) {
            if (normalizedProductIds.has(excluded)) {
                return false;
            }
        }
    }

    if (requiredProductIds.length > 0) {
        const productMatch = requireAll
            ? allMatch(requiredProductIds, normalizedProductIds)
            : anyMatch(requiredProductIds, normalizedProductIds);
        if (!productMatch) return false;
    }

    // if (requiredCategories.length > 0) {
    //     const categoryMatch = requireAll
    //         ? allMatch(requiredCategories, normalizedCategories)
    //         : anyMatch(requiredCategories, normalizedCategories);
    //     if (!categoryMatch) return false;
    // }

    return true;
};

export const calculatePromotionDiscount = (promotion: Promotion, subtotal: number): number => {
    // Treat free shipping, gift, and other structural promotions as zero discount in the summary
    if (promotion.usageLimit && promotion.currentUsage && promotion.currentUsage >= promotion.usageLimit) {
        return 0;
    }

    switch (promotion.type) {
        case 'fixed_discount':
            return Math.min(promotion.discountValue || 0, subtotal);
        case 'percentage_discount':
            return parseFloat(((subtotal * (promotion.discountValue || 0)) / 100).toFixed(2));
        case 'free_shipping':
        case 'free_gift':
            return 0;
        case 'bundle':
        case 'tiered':
            return promotion.discountValue || 0;
        default:
            return 0;
    }
};
