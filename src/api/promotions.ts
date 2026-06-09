import { useMemo } from 'react';
import apiClient from './index';
import { useQuery } from '@tanstack/react-query';
import { isPromotionApplicableToCart, PromotionCartItem } from '../utils/promotionUtils';

// Types
export interface Promotion {
    id: string;
    title: string;
    description?: string;
    type: 'fixed_discount' | 'percentage_discount' | 'free_gift' | 'free_shipping' | 'bundle' | 'tiered';
    bannerText: string;
    minOrderValue?: number;
    maxOrderValue?: number;
    minQuantity?: number;
    maxQuantity?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    excludeProducts?: string[];
    discountValue?: number;
    giftProductId?: string;
    freeText?: string;
    validFrom: string;
    validUntil: string;
    usageLimit?: number;
    currentUsage?: number;
    isActive: boolean;
    priority: number;
    displayOnHomepage: boolean;
    displayOnCheckout: boolean;
    displayOnProductPages: boolean;
    badgeIcon?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PromotionResponse {
    success: boolean;
    data: Promotion[] | Promotion;
}

/**
 * Fetch active promotions applicable to current cart value
 */
export const fetchApplicablePromotions = async (cartValue: number = 0): Promise<Promotion[]> => {
    const response = await apiClient.get<PromotionResponse>(
        `/website/promotions/active${cartValue > 0 ? `?cartValue=${cartValue}` : ''}`
    );
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
};

/**
 * Fetch all active promotions
 */
export const fetchActivePromotions = async (): Promise<Promotion[]> => {
    const response = await apiClient.get<PromotionResponse>('/website/promotions/active');
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
};

/**
 * Hook to get active promotions
 */
export const usePromotions = () => {
    return useQuery<Promotion[], Error>({
        queryKey: ['promotions', 'active'] as const,
        queryFn: fetchActivePromotions,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to get applicable promotions based on cart value
 */
export const useApplicablePromotions = (
    cartValue: number = 0,
    cartItems: PromotionCartItem[] = []
) => {
    const query = useQuery<Promotion[], Error>({
        queryKey: ['promotions', 'applicable', cartValue] as const,
        queryFn: () => fetchApplicablePromotions(cartValue),
        staleTime: cartValue > 0 ? 30 * 1000 : 5 * 60 * 1000, // 30s if calc, 5m if static
        enabled: true,
    });

    // Memoize the data to prevent unnecessary re-renders and filter by actual cart items
    const applicablePromotions = useMemo(() => {
        if (!query.data) return [];
        return query.data.filter((promo: Promotion) =>
            promo.isActive &&
            promo.displayOnCheckout !== false &&
            isPromotionApplicableToCart(promo, cartItems, cartValue)
        );
    }, [query.data, cartItems, cartValue]);

    return {
        ...query,
        data: applicablePromotions,
    };
};

/**
 * Get homepage banner promotions
 */
export const useHomepagePromotions = () => {
    return useQuery<Promotion[], Error>({
        queryKey: ['promotions', 'homepage'] as const,
        queryFn: async () => {
            const promos = await fetchActivePromotions();
            return promos;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Get promotion by ID (admin only)
 */
export const fetchPromotionById = async (id: string) => {
    const response = await apiClient.get<PromotionResponse>(`/admin/website/promotions/${id}`);
    const data = response.data.data;
    return Array.isArray(data) ? data[0] : data;
};

/**
 * Hook to get single promotion (admin)
 */
export const usePromotion = (id: string | undefined) => {
    return useQuery({
        queryKey: ['promotions', id],
        queryFn: () => fetchPromotionById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Create promotion (admin only)
 */
export const createPromotion = async (data: Partial<Promotion>) => {
    const response = await apiClient.post<PromotionResponse>('/admin/website/promotions', data);
    const result = response.data.data;
    return Array.isArray(result) ? result[0] : result;
};

/**
 * Update promotion (admin only)
 */
export const updatePromotionData = async (id: string, data: Partial<Promotion>) => {
    const response = await apiClient.put<PromotionResponse>(
        `/admin/website/promotions/${id}`,
        data
    );
    const result = response.data.data;
    return Array.isArray(result) ? result[0] : result;
};

/**
 * Delete promotion (admin only)
 */
export const deletePromotionData = async (id: string) => {
    return apiClient.delete(`/admin/website/promotions/${id}`);
};

export default {
    fetchApplicablePromotions,
    fetchActivePromotions,
    usePromotions,
    useApplicablePromotions,
    useHomepagePromotions,
    usePromotion,
    createPromotion,
    updatePromotionData,
    deletePromotionData,
};
