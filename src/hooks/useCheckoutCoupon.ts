import { useState, useCallback } from 'react';
import { validateCoupon as validateCouponAPI, applyCoupon as applyCouponAPI, CouponValidationResponse } from '../api/coupons';

interface UseCheckoutCouponReturn {
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: CouponValidationResponse | null;
  couponDiscount: number;
  couponLoading: boolean;
  couponError: string | null;
  applyCouponCode: () => Promise<void>;
  clearCoupon: () => void;
}

export const useCheckoutCoupon = (
  userId: string | null,
  cartItems: Array<{ productId: string; categoryId?: string; quantity: number; price: number }>,
  subtotal: number
): UseCheckoutCouponReturn => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const applyCouponCode = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      // Step 1: Validate coupon
      const validation = await validateCouponAPI({
        couponCode: couponCode.trim(),
        userId,
        cartItems,
        subtotal,
      });

      if (!validation.valid) {
        setCouponError(validation.message || 'Coupon is not valid');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      // Step 2: Apply coupon (get discount calculation)
      const applied = await applyCouponAPI({
        couponCode: couponCode.trim(),
        subtotal,
      });

      setAppliedCoupon(validation);
      setCouponDiscount(applied.discountAmount);
      setCouponError(null);
    } catch (error: any) {
      setCouponError(error.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, userId, cartItems, subtotal]);

  const clearCoupon = useCallback(() => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
  }, []);

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponDiscount,
    couponLoading,
    couponError,
    applyCouponCode,
    clearCoupon,
  };
};
