import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Package, Warning } from '@phosphor-icons/react';
import { Promotion } from '../../api/promotions';
import { formatPromotionDescription, getPromotionBadgeStyle } from '../../hooks/useCheckoutPromotions';
import { PromotionCardProps } from '../../types/Promotion';

export const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  discountAmount,
  isSelected = false,
  onSelect,
  showDetails = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { bgColor, color, icon } = getPromotionBadgeStyle(promotion.type);
  const isExpired = new Date(promotion.validUntil) < new Date();
  const isUsageLimitReached =
    promotion.usageLimit && promotion.currentUsage ? promotion.currentUsage >= promotion.usageLimit : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-brand-brown bg-brand-latte/30' : 'border-gray-200 bg-white hover:border-brand-brown/30'
      } ${isExpired || isUsageLimitReached ? 'opacity-60' : ''}`}
      onClick={() => !isExpired && !isUsageLimitReached && onSelect?.(promotion)}
    >
      {/* Header Section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Badge + Title */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${bgColor} rounded-full p-2 text-lg`}>{icon}</div>
              <h3 className="font-semibold text-gray-900 flex-1">{promotion.title}</h3>
              {isSelected && (
                <div className="flex-shrink-0">
                  <CheckCircle size={20} weight="fill" className="text-green-600" />
                </div>
              )}
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className={`${color} font-bold`}>{formatPromotionDescription(promotion)}</span>
              {isExpired && (
                <span className="text-red-600 text-xs font-medium flex items-center gap-1">
                  <Warning size={12} />
                  Expired
                </span>
              )}
              {isUsageLimitReached && (
                <span className="text-orange-600 text-xs font-medium flex items-center gap-1">
                  <Warning size={12} />
                  Limit reached
                </span>
              )}
            </div>

            {/* Discount Display */}
            {discountAmount > 0 && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <p className="text-green-700 font-bold text-sm">
                  💚 Save ₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} on this order
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Validity Information */}
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <p><Calendar size={20} className="inline-block mr-1" /> Valid until: {new Date(promotion.validUntil).toLocaleDateString('en-IN')}</p>
          {promotion.usageLimit && (
            <p>
              📊 Uses: {promotion.currentUsage || 0}/{promotion.usageLimit}
              {isUsageLimitReached && ' (Offer exhausted)'}
            </p>
          )}
        </div>

        {/* Expand Button */}
        {showDetails && promotion.description && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="mt-3 w-full py-2 text-sm text-brand-brown hover:bg-brand-latte/50 rounded-lg transition-colors font-medium"
          >
            {expanded ? '▼ Less details' : '▶ More details'}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && promotion.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200"
          >
            <div className="p-4 bg-gray-50 text-sm text-gray-700">
              <p className="leading-relaxed">{promotion.description}</p>

              {/* Conditions */}
              {(promotion.minOrderValue || promotion.applicableCategories?.length) && (
                <div className="mt-3 space-y-1 text-xs">
                  <p className="font-semibold text-gray-800">Terms & Conditions:</p>
                  {promotion.minOrderValue && (
                    <p>✓ Minimum order value: ₹{promotion.minOrderValue.toLocaleString('en-IN')}</p>
                  )}
                  {promotion.applicableCategories && promotion.applicableCategories.length > 0 && (
                    <p>✓ Applicable to: {promotion.applicableCategories.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface PromotionListProps {
  promotions: Array<Promotion & { discountAmount: number }>;
  selectedPromotionId?: string;
  onSelectPromotion?: (promotion: Promotion) => void;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * PromotionList component - displays all applicable promotions
 */
export const PromotionList: React.FC<PromotionListProps> = ({
  promotions,
  selectedPromotionId,
  onSelectPromotion,
  loading = false,
  emptyMessage = 'No promotions available for this order',
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!promotions || promotions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Package size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
      className="space-y-3"
    >
      {promotions.map((promo) => (
        <PromotionCard
          key={promo.id}
          promotion={promo}
          discountAmount={promo.discountAmount}
          isSelected={selectedPromotionId === promo.id}
          onSelect={onSelectPromotion}
          showDetails={true}
        />
      ))}
    </motion.div>
  );
};
