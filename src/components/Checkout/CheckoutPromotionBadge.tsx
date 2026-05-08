import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Truck, Percent, Tag, TrendUp } from '@phosphor-icons/react';
import { PromotionBadgeProps } from '../../types';

const CheckoutPromotionBadge: React.FC<PromotionBadgeProps> = ({
    promotion,
    cartValue,
    discount = 0,
    isFreeShipping = false,
}) => {
    if (!promotion) return null;

    const getPromotionIcon = () => {
        if (promotion.badgeIcon) {
            return <span className="text-lg">{promotion.badgeIcon}</span>;
        }

        switch (promotion.type) {
            case 'free_gift':
                return <Gift size={20} weight="bold" className="text-brand-brown" />;
            case 'free_shipping':
                return <Truck size={20} weight="bold" className="text-green-600" />;
            case 'percentage_discount':
                return <Percent size={20} weight="bold" className="text-blue-600" />;
            case 'fixed_discount':
                return <Tag size={20} weight="bold" className="text-purple-600" />;
            case 'bundle':
                return <TrendUp size={20} weight="bold" className="text-orange-600" />;
            default:
                return <Gift size={20} weight="bold" className="text-brand-brown" />;
        }
    };

    const getPromotionBgColor = () => {
        switch (promotion.type) {
            case 'free_gift':
                return 'bg-brand-brown/10 border-brand-brown/30';
            case 'free_shipping':
                return 'bg-green-50 border-green-200';
            case 'percentage_discount':
                return 'bg-blue-50 border-blue-200';
            case 'fixed_discount':
                return 'bg-purple-50 border-purple-200';
            case 'bundle':
                return 'bg-orange-50 border-orange-200';
            default:
                return 'bg-brand-latte border-brand-brown/20';
        }
    };

    const getPromotionTextColor = () => {
        switch (promotion.type) {
            case 'free_gift':
                return 'text-brand-brown';
            case 'free_shipping':
                return 'text-green-800';
            case 'percentage_discount':
                return 'text-blue-800';
            case 'fixed_discount':
                return 'text-purple-800';
            case 'bundle':
                return 'text-orange-800';
            default:
                return 'text-brand-brown';
        }
    };

    const getPromotionDescription = () => {
        switch (promotion.type) {
            case 'free_gift':
                return `${promotion.freeText || 'Free Gift'} included!`;
            case 'free_shipping':
                return 'Free shipping applied!';
            case 'percentage_discount':
                return `${promotion.discountValue}% discount applied!`;
            case 'fixed_discount':
                return `₹${promotion.discountValue} discount applied!`;
            case 'bundle':
                return `${promotion.discountValue}% bundle discount applied!`;
            default:
                return 'Promotion applied!';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`p-3 rounded-xl border-2 ${getPromotionBgColor()} flex items-start gap-3 mb-3`}
        >
            <div className="flex-shrink-0 mt-0.5">{getPromotionIcon()}</div>
            <div className="flex-1 min-w-0">
                <p className={`text-xs font-black uppercase tracking-widest ${getPromotionTextColor()}`}>
                    {getPromotionDescription()}
                </p>
                <p className={`text-xs ${getPromotionTextColor()} opacity-80 mt-1`}>
                    {promotion.title}
                </p>
            </div>
            {discount > 0 && (
                <div className="flex-shrink-0 text-right">
                    <p className={`text-sm font-bold ${getPromotionTextColor()}`}>
                        -₹{Math.round(Number(discount))}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default CheckoutPromotionBadge;
