import React from "react";
import { Star, Sparkle } from "@phosphor-icons/react";
import { LazySection } from "../common";
import { ReviewSkeleton } from "../../components/Skeletons";
import { ProductReviewsSectionProps } from "../../types/ProductDetails";

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
    reviews,
    statistics,
    reviewsLoading,
}) => {
    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="relative mt-20 overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-[#B08A37]/10 blur-[100px] rounded-full" />

            <LazySection fallback={<ReviewSkeleton />}>

                {/* HEADER */}
                <div className="relative max-w-7xl mx-auto mb-16 px-1 md:px-4 ">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

                        {/* LEFT SECTION */}
                        <div className="w-full lg:max-w-[52%] text-center lg:text-left">

                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
                                <div className="w-10 h-[1px] bg-[#B08A37]" />

                                <span className="uppercase tracking-[0.35em] text-[#B08A37] text-[10px] font-semibold">
                                    Customer Experiences
                                </span>

                                <div className="w-10 h-[1px] bg-[#B08A37]" />
                            </div>

                            {/* Heading */}
                            {/* <h2
                                className="font-serif text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] text-[#1A1815]"
                                style={{
                                    fontWeight: 500,
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                Trusted By

                                <span className="block italic text-[#B08A37] mt-2">
                                    Wellness Families
                                </span>
                            </h2> */}
                            <h2
                                className="font-serif text-[clamp(1.75rem,4vw,3rem)] leading-none text-[#1A1815] max-w-3xl"
                                style={{
                                    fontWeight: 500,
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                Trusted By{" "}

                                <span className="italic text-[#B08A37]">
                                    Wellness Families
                                </span>
                            </h2>

                            {/* Subtitle */}
                            <p className="mt-4 text-[#6B665E] text-[13px] leading-[1.9] max-w-2xl mx-auto lg:mx-0">
                                Honest experiences from customers who trust Sappey
                                for freshness, purity, and premium quality.
                            </p>
                        </div>

                        {/* RIGHT SECTION */}
                        {statistics && (
                            <div className="w-full lg:max-w-[460px] rounded-[24px] bg-white/75 backdrop-blur-xl border border-[#B08A37] shadow-[0_10px_40px_rgba(0,0,0,0.05)] px-8 py-6">

                                <div className="flex items-center gap-8">

                                    {/* LEFT RATING */}
                                    <div className="shrink-0 text-center min-w-[150px]">

                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <Sparkle
                                                size={16}
                                                weight="fill"
                                                className="text-[#B08A37]"
                                            />

                                            <span className="uppercase tracking-[0.2em] text-[10px] text-[#B08A37] font-bold whitespace-nowrap">
                                                Premium Rating
                                            </span>
                                        </div>

                                        <div className="font-serif text-5xl leading-none text-[#1A1815]">
                                            {statistics.averageRating.toFixed(1)}
                                        </div>

                                        <div className="flex justify-center gap-1 text-[#D4A017] mt-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={15}
                                                    weight={
                                                        i < Math.round(statistics.averageRating)
                                                            ? "fill"
                                                            : "regular"
                                                    }
                                                />
                                            ))}
                                        </div>

                                        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#6B665E] font-semibold whitespace-nowrap">
                                            {statistics.totalReviews} Reviews
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px self-stretch bg-[#B08A37]/10" />

                                    {/* Distribution */}
                                    <div className="flex-1 space-y-3">

                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div
                                                key={rating}
                                                className="flex items-center gap-3"
                                            >

                                                <span className="w-7 text-[11px] text-[#6B665E] font-medium">
                                                    {rating}★
                                                </span>

                                                <div className="flex-1 h-[6px] bg-[#EEE8DE] rounded-full overflow-hidden">

                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-[#B08A37] to-[#D4AF37]"
                                                        style={{
                                                            width: `${statistics.totalReviews > 0
                                                                ? (statistics.ratingDistribution[
                                                                    rating as keyof typeof statistics.ratingDistribution
                                                                ] /
                                                                    statistics.totalReviews) *
                                                                100
                                                                : 0
                                                                }%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="w-5 text-right text-[11px] text-[#6B665E]">
                                                    {statistics.ratingDistribution[
                                                        rating as keyof typeof statistics.ratingDistribution
                                                    ] || 0}
                                                </span>

                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* REVIEW GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="group relative rounded-[28px] bg-white/70 backdrop-blur-xl border border-white/40 p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition-all duration-500"
                        >

                            {/* Hover Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-[#B08A37]/5 via-transparent to-[#B08A37]/10 rounded-[28px]" />

                            {/* Stars */}
                            <div className="relative flex items-center justify-between mb-5">

                                <div className="flex gap-1 text-[#D4A017]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            weight={i < review.rating ? "fill" : "regular"}
                                        />
                                    ))}
                                </div>

                                {review.isVerified && (
                                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                                        Verified
                                    </span>
                                )}
                            </div>

                            {/* Review */}
                            <p className="relative text-[#5E5A55] italic text-sm leading-relaxed mb-4">
                                “{review.comment || "Excellent premium quality products."}”
                            </p>

                            {/* Footer */}
                            <div className="relative flex items-center gap-4 pt-5 border-t border-[#B08A37]/10">

                                <div className="w-8 h-8 rounded-full bg-[#F2E9DB] flex items-center justify-center text-[11px] font-bold text-[#1A1815] uppercase">
                                    {review.customer?.name?.[0] || "C"}
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#1A1815]">
                                        {review.customer?.name || "Anonymous"}
                                    </p>

                                    <p className="mt-1 text-[10px] text-[#8B847B]">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            </LazySection>
        </section>
    );
};

export default ProductReviewsSection;