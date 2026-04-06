import { useMemo } from 'react';
import { useApplicablePromotions } from '../api/promotions';
import { Promotion } from '../api/promotions';

interface PromotionApplicability {
    promotion: Promotion;
    discountAmount: number;
    finalPrice: number;
}

/**
 * Professional promotion calculation hook for checkout
 * Evaluates promotion conditions and calculates discounts
 */
export const useCheckoutPromotions = (subtotal: number) => {
    // Fetch promotions applicable to current cart value
    const { data: applicablePromotions = [] } = useApplicablePromotions(subtotal);

    // Calculate the best promotion (highest discount)
    const bestPromotion = useMemo<PromotionApplicability | null>(() => {
        if (!applicablePromotions || applicablePromotions.length === 0) {
            return null;
        }

        // Sort by priority (higher priority first)
        const sorted = [...applicablePromotions].sort((a, b) => b.priority - a.priority);

        const topPromotion = sorted[0];
        if (!topPromotion) return null;

        // Calculate discount based on promotion type
        const discountAmount = calculateDiscount(topPromotion, subtotal);

        return {
            promotion: topPromotion,
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            finalPrice: parseFloat((subtotal - discountAmount).toFixed(2)),
        };
    }, [applicablePromotions, subtotal]);

    // Get all applicable promotions with calculated discounts
    const allApplicableWithDiscount = useMemo<PromotionApplicability[]>(() => {
        return applicablePromotions.map((promo: any) => {
            const discountAmount = calculateDiscount(promo, subtotal);
            return {
                promotion: promo,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                finalPrice: parseFloat((subtotal - discountAmount).toFixed(2)),
            };
        });
    }, [applicablePromotions, subtotal]);

    return {
        bestPromotion,
        allApplicablePromotions: allApplicableWithDiscount,
        hasPromotions: applicablePromotions.length > 0,
    };
};

/**
 * Calculate discount amount based on promotion type
 */
function calculateDiscount(promotion: Promotion, subtotal: number): number {
    // Check usage limit
    if (promotion.usageLimit && promotion.currentUsage && promotion.currentUsage >= promotion.usageLimit) {
        return 0;
    }

    switch (promotion.type) {
        case 'fixed_discount':
            // Fixed amount discount
            return Math.min(promotion.discountValue || 0, subtotal);

        case 'percentage_discount':
            // Percentage-based discount
            return parseFloat(((subtotal * (promotion.discountValue || 0)) / 100).toFixed(2));

        case 'free_shipping':
            // Free shipping (handled separately in checkout)
            return 0;

        case 'free_gift':
            // Free gift (no direct discount on subtotal)
            return 0;

        case 'bundle':
            // Bundle discount (if applicable)
            return promotion.discountValue || 0;

        case 'tiered':
            // Tiered discount based on order value
            return promotion.discountValue || 0;

        default:
            return 0;
    }
}

/**
 * Format promotion description for display
 */
export const formatPromotionDescription = (promotion: Promotion): string => {
    switch (promotion.type) {
        case 'fixed_discount':
            return `Save ₹${promotion.discountValue} on this order`;

        case 'percentage_discount':
            return `Get ${promotion.discountValue}% discount`;

        case 'free_shipping':
            return 'Free shipping on this order';

        case 'free_gift':
            return `${promotion.freeText || 'Get a free gift'} with this order`;

        case 'bundle':
            return 'Bundle offer - Save more when you buy together';

        case 'tiered':
            return 'Tiered pricing - More savings at higher order values';

        default:
            return promotion.description || 'Great offer!';
    }
};

/**
 * Get promotion badge icon/color
 */
export const getPromotionBadgeStyle = (
    type: Promotion['type']
): { color: string; bgColor: string; icon: string } => {
    const styles = {
        fixed_discount: { color: 'text-green-600', bgColor: 'bg-green-100', icon: '💰' },
        percentage_discount: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '📊' },
        free_shipping: { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '🚚' },
        free_gift: { color: 'text-pink-600', bgColor: 'bg-pink-100', icon: '🎁' },
        bundle: { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '📦' },
        tiered: { color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: '📈' },
    };

    return styles[type] || { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '✨' };
};
