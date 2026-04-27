import React from "react";
import { Star } from "@phosphor-icons/react";
import { LazySection } from "../common";
import { ReviewSkeleton } from "../../components/Skeletons";
import { ProductReviewsSectionProps } from "../../types/ProductDetails";

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
    reviews,
    statistics,
    reviewsLoading
}) => {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="mt-16">
            <LazySection fallback={<ReviewSkeleton />}>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-headline text-brand-brown mb-4">Customer Chronicles</h2>
                    <p className="text-slate-400 text-sm">Honest experiences from our wellness community</p>

                    {/* Rating Statistics */}
                    {statistics && (
                        <div className="mt-8 p-8 bg-gradient-to-br from-brand-latte/50 to-brand-latte/20 rounded-3xl border border-brand-latte/30">
                            <div className="flex items-center justify-center gap-6">
                                <div className="text-center">
                                    <div className="text-5xl font-headline text-brand-brown mb-2">
                                        {statistics.averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex justify-center text-amber-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} weight={i < Math.round(statistics.averageRating) ? "fill" : "regular"} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        Based on {statistics.totalReviews} reviews
                                    </p>
                                </div>

                                {/* Rating Distribution */}
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-500 w-8">{rating}★</span>
                                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 transition-all duration-300"
                                                    style={{
                                                        width: `${statistics.totalReviews > 0 ? (statistics.ratingDistribution[rating as keyof typeof statistics.ratingDistribution] / statistics.totalReviews) * 100 : 0}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400 w-8 text-right">
                                                {statistics.ratingDistribution[rating as keyof typeof statistics.ratingDistribution] || 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="break-inside-avoid bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((s) => (
                                        <Star key={s} size={12} weight={s < review.rating ? "fill" : "regular"} />
                                    ))}
                                </div>
                                {review.isVerified && (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        ✓ VERIFIED
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-600 italic text-sm leading-relaxed mb-6">"{review.comment || "No comment provided"}"</p>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                <div className="w-8 h-8 rounded-full bg-brand-latte flex items-center justify-center text-[10px] font-black text-brand-brown uppercase">
                                    {review.customer?.name?.[0] || "C"}
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-brand-brown uppercase tracking-widest block">
                                        {review.customer?.name || "Anonymous"}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </LazySection>
        </div>
    );
};

export default ProductReviewsSection;