import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, PaperPlaneTilt } from "@phosphor-icons/react";
import { useSubmitReview } from "../api/reviews/hooks";

interface OrderItem {
  orderItemId: string;
  productId: string;
  productName: string;
  productImage?: string;
  variant?: string;
}

interface RatingAndReviewProps {
  orderId: string;
  orderItems?: OrderItem[];
  onSubmit?: (ratings: { orderItemId: string; productId: string; rating: number; comment: string }[]) => void;
}

const RatingAndReview: React.FC<RatingAndReviewProps> = ({ orderId, orderItems = [], onSubmit }) => {
  const [itemRatings, setItemRatings] = useState<Record<string, { rating: number; comment: string; submitted: boolean }>>({});
  const [hoveredRatings, setHoveredRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (itemId: string, rating: number) => {
    setItemRatings(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], rating }
    }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setItemRatings(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment }
    }));
  };

  const submitReviewMutation = useSubmitReview();

  const handleSubmit = async (itemId: string) => {
    const itemData = itemRatings[itemId];
    if (!itemData || itemData.rating === 0) return;

    const item = orderItems.find((orderItem) => orderItem.orderItemId === itemId);
    if (!item) return;

    setIsSubmitting(true);
    try {
      await submitReviewMutation.mutateAsync({
        orderId,
        orderItemId: item.orderItemId,
        productId: item.productId,
        rating: itemData.rating,
        comment: itemData.comment,
      });

      setItemRatings(prev => {
        const nextState = {
          ...prev,
          [itemId]: { ...prev[itemId], submitted: true },
        };

        if (orderItems.every((orderItem) => nextState[orderItem.orderItemId]?.submitted) && onSubmit) {
          const ratings = orderItems.map((orderItem) => ({
            orderItemId: orderItem.orderItemId,
            productId: orderItem.productId,
            rating: nextState[orderItem.orderItemId]?.rating || 0,
            comment: nextState[orderItem.orderItemId]?.comment || "",
          }));
          onSubmit(ratings);
        }

        return nextState;
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-brand-brown/10 rounded-[24px] p-[clamp(1.5rem,3vw,2rem)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1"
    >
      <div className="text-center mb-[clamp(1.5rem,2vw,2rem)]">
        <h2 className="text-[clamp(1rem,2vw,1.25rem)] font-bold text-slate-900 mb-2">
          Rate Your Experience
        </h2>
        <p className="text-[clamp(0.875rem,1.5vw,1rem)] text-slate-600">
          Share your feedback for each item to help us improve
        </p>
      </div>

      <div className="space-y-[clamp(1.5rem,2vw,2rem)]">
        {(orderItems && Array.isArray(orderItems)) && orderItems?.map((item) => {
          const itemData = itemRatings[item.orderItemId] || { rating: 0, comment: "", submitted: false };

          if (itemData.submitted) {
            return (
              <motion.div
                key={item.orderItemId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                  <PaperPlaneTilt size={20} weight="bold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                  <p className="text-xs text-emerald-600">Review submitted successfully!</p>
                </div>
              </motion.div>
            );
          }

          return (
            <div key={item.orderItemId} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-900">{item.productName}</h3>
                  {item.variant && (
                    <p className="text-xs text-slate-500">{item.variant}</p>
                  )}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(item.orderItemId, star)}
                      onMouseEnter={() => setHoveredRatings(prev => ({ ...prev, [item.orderItemId]: star }))}
                      onMouseLeave={() => setHoveredRatings(prev => ({ ...prev, [item.orderItemId]: 0 }))}
                      className="p-1 transition-colors duration-200"
                    >
                      <Star
                        size={24}
                        weight={(hoveredRatings[item.orderItemId] || itemData.rating) >= star ? "fill" : "regular"}
                        className={`transition-colors duration-200 ${
                          (hoveredRatings[item.orderItemId] || itemData.rating) >= star
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="mb-4">
                <textarea
                  value={itemData.comment}
                  onChange={(e) => handleCommentChange(item.orderItemId, e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                  rows={3}
                  maxLength={300}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    {itemData?.comment?.length}/300 characters
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit(item.orderItemId)}
                disabled={itemData.rating === 0 || isSubmitting}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt size={16} weight="bold" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RatingAndReview;