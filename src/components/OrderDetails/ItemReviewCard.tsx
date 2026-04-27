import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, SealCheck, PaperPlaneRight } from "@phosphor-icons/react";
import { useSubmitReview, useGetReviewByOrderItem } from "../../api/reviews/hooks";

interface ItemReviewCardProps {
  orderId: string;
  id: string; 
  productId: string;
  productName: string;
}

const ItemReviewCard: React.FC<ItemReviewCardProps> = ({
  orderId,
  id: orderItemId,
  productId,
}) => {
  const [itemRating, setItemRating] = useState(0);
  const [itemComment, setItemComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { review, isLoading } = useGetReviewByOrderItem(orderItemId);
  const submitReviewMutation = useSubmitReview();

  // Re-implemented: Dynamic Height Logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [itemComment]);

  const handleSubmit = async () => {
    if (itemRating === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitReviewMutation.mutateAsync({
        orderId, orderItemId, productId,
        rating: itemRating,
        comment: itemComment,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="px-6 pb-6">
      <AnimatePresence mode="wait">
        {review ? (
          // Ultra-Slim Reviewed State
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
          >
            <div className="flex flex-col items-center gap-1 border-r border-slate-100 pr-4">
              <span className="text-[14px] font-black text-slate-900">{review.rating}</span>
              <Star size={12} weight="fill" className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SealCheck size={14} weight="fill" className="text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified Experience</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
            </div>
          </motion.div>
        ) : (
          // Floating Action Review State
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="group relative bg-white border border-slate-200 rounded-[1.5rem] p-4 transition-all focus-within:border-brand-brown focus-within:ring-4 focus-within:ring-brand-brown/5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Star Selection */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setItemRating(s)} 
                      onMouseEnter={() => setHoveredRating(s)} 
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-0.5 transition-transform active:scale-125"
                    >
                      <Star 
                        size={22} 
                        weight={(hoveredRating || itemRating) >= s ? "fill" : "light"} 
                        className={(hoveredRating || itemRating) >= s ? "text-amber-400" : "text-slate-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Textarea */}
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={itemComment}
                  onChange={(e) => setItemComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={1}
                  className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none resize-none py-1 block overflow-hidden leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={itemRating === 0 || isSubmitting}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-brown text-white disabled:bg-slate-100 disabled:text-slate-300 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg shadow-brand-brown/20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <PaperPlaneRight size={18} weight="fill" />
                )}
              </button>
            </div>

            {/* Subtle Label - Only shows when interaction starts */}
            <AnimatePresence>
              {itemRating > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute -top-3 left-4 px-2 bg-white text-[9px] font-black text-brand-brown uppercase tracking-[0.2em]"
                >
                  Quality Rating: {itemRating}/5
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemReviewCard;