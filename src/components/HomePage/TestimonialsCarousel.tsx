import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quotes } from "@phosphor-icons/react";
import { LazyErrorBoundary, LazySection } from "../common";
import { ReviewSkeleton } from "../Skeletons";
import { TestimonialCarouselProps } from "../../types/HomePage";

const TestimonialsCarousel: React.FC<TestimonialCarouselProps> = ({
    testimonials,
    isLoading,
}) => {
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const handleNavigation = (index: number) => {
        setTestimonialIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );
        }, 4000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const formattedTestimonials = testimonials.map((t) => ({
        ...t,
        author: t.customer?.name || "Anonymous",
    }));

    if (!formattedTestimonials || formattedTestimonials.length === 0) return null;

    const currentTestimonial = formattedTestimonials[testimonialIndex];
    const visible = formattedTestimonials.slice(0, 5);

    return (
        <LazyErrorBoundary>
            <LazySection
                fallback={
                    <div className="py-8 px-4">
                        <ReviewSkeleton count={1} />
                    </div>
                }
                rootMargin="250px 0px"
            >
                <section className="py-10 px-4 sm:px-6 bg-brand-cocoa overflow-hidden">
                    <div className="max-w-5xl mx-auto w-full">

                        {/* Top Label Bar */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="inline-block py-0.5 px-2.5 rounded-full border border-brand-cream/20 font-label text-[9px] uppercase tracking-[0.3em] text-brand-cream/60 whitespace-nowrap">
                                Reviews
                            </span>
                            <div className="h-px flex-1 bg-brand-cream/10" />
                            <span className="font-label text-[9px] uppercase tracking-widest text-brand-cream/30 whitespace-nowrap">
                                {visible.length} stories
                            </span>
                        </div>

                        {/* Layout: stacked on mobile/tablet, side-by-side on lg+ */}
                        <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr] gap-5 lg:gap-8 items-start">

                            {/* LEFT: Heading + Author List — desktop only */}
                            <div className="hidden lg:flex flex-col gap-1">
                                <h2 className="font-headline text-base xl:text-lg text-brand-cream leading-snug mb-3">
                                    What Our<br />Community Says
                                </h2>
                                {visible.map((t, i) => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleNavigation(i)}
                                        className={`flex items-center gap-2.5 group transition-all text-left w-full rounded-xl px-2.5 py-2 ${
                                            i === testimonialIndex
                                                ? "bg-white/[0.07]"
                                                : "hover:bg-white/[0.03]"
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-label text-[9px] border transition-all ${
                                                i === testimonialIndex
                                                    ? "bg-brand-brown/60 border-brand-cream/30 text-brand-cream"
                                                    : "bg-white/5 border-brand-cream/10 text-brand-cream/40"
                                            }`}
                                        >
                                            {t.author?.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`font-label text-[9px] uppercase tracking-wider truncate transition-colors ${
                                                    i === testimonialIndex
                                                        ? "text-brand-cream"
                                                        : "text-brand-cream/40 group-hover:text-brand-cream/60"
                                                }`}
                                            >
                                                {t.author}
                                            </p>
                                            <div className="flex gap-px mt-0.5">
                                                {[...Array(5)].map((_, si) => (
                                                    <Star
                                                        key={si}
                                                        size={7}
                                                        weight={si < t.rating ? "fill" : "regular"}
                                                        className={
                                                            i === testimonialIndex
                                                                ? "text-amber-400"
                                                                : "text-amber-400/25"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* RIGHT: Review Card */}
                            <div className="w-full relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={testimonialIndex}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden"
                                    >
                                        {/* Decorative glow */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-brown/10 rounded-full blur-2xl pointer-events-none" />

                                        {/* Mobile-only heading */}
                                        <p className="lg:hidden font-headline text-sm text-brand-cream/50 mb-3">
                                            What Our Community Says
                                        </p>

                                        <Quotes
                                            size={20}
                                            weight="fill"
                                            className="text-brand-cream/10 mb-3"
                                        />

                                        {/* Comment — min-h prevents card height jumping */}
                                        <p className="font-sans text-sm sm:text-[15px] text-brand-cream/85 leading-relaxed line-clamp-4 min-h-[4.5rem]">
                                            &ldquo;&nbsp;{currentTestimonial.comment}&rdquo;
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-7 h-7 flex-shrink-0 rounded-full bg-brand-brown/40 border border-brand-cream/20 flex items-center justify-center font-label text-[10px] text-brand-cream">
                                                    {currentTestimonial.author?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold text-brand-cream uppercase tracking-wider leading-tight truncate max-w-[120px] sm:max-w-none">
                                                        {currentTestimonial.author}
                                                    </p>
                                                    <p className="text-[9px] text-brand-cream/35 uppercase tracking-tighter">
                                                        Verified Buyer
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-0.5 flex-shrink-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        weight={i < currentTestimonial.rating ? "fill" : "regular"}
                                                        className="text-amber-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Dot navigation — mobile & tablet (below lg) */}
                                <div className="flex lg:hidden justify-center gap-2 mt-4">
                                    {visible.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleNavigation(i)}
                                            aria-label={`Go to review ${i + 1}`}
                                            className={`rounded-full transition-all duration-300 ${
                                                i === testimonialIndex
                                                    ? "w-5 h-1.5 bg-brand-cream"
                                                    : "w-1.5 h-1.5 bg-brand-cream/25 hover:bg-brand-cream/50"
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Segment progress bar — desktop only */}
                                {/* <div className="hidden lg:flex gap-1.5 mt-3 px-0.5">
                                    {visible.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleNavigation(i)}
                                            aria-label={`Go to review ${i + 1}`}
                                            className={`h-0.5 rounded-full transition-all duration-300 ${
                                                i === testimonialIndex
                                                    ? "flex-[2] bg-brand-cream"
                                                    : "flex-1 bg-brand-cream/20 hover:bg-brand-cream/40"
                                            }`}
                                        />
                                    ))}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>
            </LazySection>
        </LazyErrorBoundary>
    );
};

export default TestimonialsCarousel;