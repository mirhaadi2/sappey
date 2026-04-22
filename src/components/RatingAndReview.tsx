import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, PaperPlaneTilt } from "@phosphor-icons/react";
import { useSubmitReview, useGetReviewByOrderItem } from "../api/reviews/hooks";

interface OrderItem {
  orderItemId: string;     // Unique order item ID for this specific purchase
  productId: string;
  productName: string;
  productImage?: string;
  variant?: string;
  quantity?: number;       // Quantity of this item in the order
}

interface RatingAndReviewProps {
  orderId: string;
  orderItems?: OrderItem[];
  onSubmit?: (ratings: { orderItemId: string; productId: string; rating: number; comment: string }[]) => void;
}

const ReviewItemCard: React.FC<{
  item: OrderItem;
  orderId: string;
  onReviewSubmitted: () => void;
  submitReviewMutation: any;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}> = ({ item, orderId, onReviewSubmitted, submitReviewMutation, isSubmitting, setIsSubmitting }) => {
  const [itemRating, setItemRating] = useState(0);
  const [itemComment, setItemComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { review, isLoading } = useGetReviewByOrderItem(item.orderItemId);

  const handleSubmit = async () => {
    if (itemRating === 0) return;

    setIsSubmitting(true);
    try {
      await submitReviewMutation.mutateAsync({
        orderId,
        orderItemId: item.orderItemId,
        productId: item.productId,
        rating: itemRating,
        comment: itemComment,
      });
      setIsSubmitted(true);
      onReviewSubmitted();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show existing review if it exists
  if (review) {
    return (
      <motion.div
        key={item.orderItemId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-blue-200 rounded-xl p-4 bg-blue-50"
      >
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
            <div className="flex items-center gap-2 mt-1">
              {item.variant && (
                <p className="text-xs text-slate-500">{item.variant}</p>
              )}
              {item.quantity && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Qty: {item.quantity}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Your Review</p>
            {review.isVerified && (
              <span className="text-xs text-blue-600 font-medium">✓ Verified</span>
            )}
          </div>
        </div>

        {/* Existing Rating */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                weight={review.rating >= star ? "fill" : "regular"}
                className={`${
                  review.rating >= star
                    ? "text-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-700">{review.rating}/5</span>
        </div>

        {/* Existing Comment */}
        {review.comment && (
          <div className="mb-3 p-3 bg-white rounded-lg border border-blue-100">
            <p className="text-sm text-slate-700">{review.comment}</p>
          </div>
        )}

        {/* Review Date */}
        <p className="text-xs text-slate-500">
          Posted on {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </motion.div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        key={item.orderItemId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-slate-200 rounded-xl p-4 bg-slate-50"
      >
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
            <div className="flex items-center gap-2 mt-1">
              {item.variant && (
                <p className="text-xs text-slate-500">{item.variant}</p>
              )}
              {item.quantity && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Qty: {item.quantity}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500\">Item Review</p>
            <p className="text-xs text-slate-400 font-mono\">{item.orderItemId.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        </div>
      </motion.div>
    );
  }

  // Show submitted state
  if (isSubmitted) {
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

  // Show review form
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
          <div className="flex items-center gap-2 mt-1">
            {item.variant && (
              <p className="text-xs text-slate-500">{item.variant}</p>
            )}
            {item.quantity && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Qty: {item.quantity}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Item Review</p>
          <p className="text-xs text-slate-400 font-mono">{item.orderItemId.slice(0, 8)}</p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setItemRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-colors duration-200"
            >
              <Star
                size={24}
                weight={(hoveredRating || itemRating) >= star ? "fill" : "regular"}
                className={`transition-colors duration-200 ${
                  (hoveredRating || itemRating) >= star
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
          value={itemComment}
          onChange={(e) => setItemComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
          rows={3}
          maxLength={300}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-500">
            {itemComment?.length}/300 characters
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={itemRating === 0 || isSubmitting}
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
};

const RatingAndReview: React.FC<RatingAndReviewProps> = ({ orderId, orderItems = [], onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);

  const submitReviewMutation = useSubmitReview();

  const handleReviewSubmitted = () => {
    const newCount = submittedCount + 1;
    setSubmittedCount(newCount);
    if (newCount === orderItems.length && onSubmit) {
      onSubmit(
        orderItems.map((item) => ({
          orderItemId: item.orderItemId,
          productId: item.productId,
          rating: 5, // placeholder - actual rating is from review
          comment: "",
        }))
      );
    }
  };

  if (orderItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-brand-brown/10 rounded-2xl p-[clamp(1.2rem,3vw,1.8rem)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1"
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
        {(orderItems && Array.isArray(orderItems)) &&
          orderItems?.map((item) => (
            <ReviewItemCard
              key={item.orderItemId}
              item={item}
              orderId={orderId}
              onReviewSubmitted={handleReviewSubmitted}
              submitReviewMutation={submitReviewMutation}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          ))}
      </div>
    </motion.div>
  );
};

export default RatingAndReview;