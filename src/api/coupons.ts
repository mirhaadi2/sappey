// import { apiClient } from './index';

import { apiMethods } from ".";

export interface ValidateCouponRequest {
  couponCode: string;
  userId: string | null;
  cartItems: Array<{ productId: string; categoryId?: string; quantity: number; price: number }>;
  subtotal: number;
}

export interface ApplyCouponRequest {
  couponCode: string;
  subtotal: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon: {
    id: string;
    code: string;
    type: 'fixed_discount' | 'percentage_discount' | 'free_shipping' | 'free_order';
    discountValue?: number;
    maxDiscountAmount?: number;
    minOrderValue?: number;
  } | null;
  discountAmount: number;
  message?: string;
}

export interface CouponApplyResponse {
  couponId: string;
  couponCode: string;
  couponType: 'fixed_discount' | 'percentage_discount' | 'free_shipping' | 'free_order';
  discountAmount: number;
}

/**
 * Validate coupon code with cart details
 */
export const validateCoupon = async (
  data: ValidateCouponRequest
): Promise<CouponValidationResponse> => {
  try {
    const response = await apiMethods.post<{ success: boolean; data: CouponValidationResponse }>(
      '/website/coupons/validate',
      data
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Failed to validate coupon';
    throw new Error(message);
  }
};

/**
 * Apply coupon and get discount amount
 */
export const applyCoupon = async (
  data: ApplyCouponRequest
): Promise<CouponApplyResponse> => {
  try {
    const response = await apiMethods.post<{ success: boolean; data: CouponApplyResponse }>(
      '/website/coupons/apply',
      data
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Failed to apply coupon';
    throw new Error(message);
  }
};

export default {
  validateCoupon,
  applyCoupon,
};
