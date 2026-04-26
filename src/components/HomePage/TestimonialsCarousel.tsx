import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quotes, CaretRight } from "@phosphor-icons/react";
import LazySection from "../LazySection";
import LazyErrorBoundary from "../LazyErrorBoundary";
import { ReviewSkeleton } from "../Skeletons";
import { TestimonialCarouselProps  } from "../../types/HomePage";

const TestimonialsCarousel: React.FC<TestimonialCarouselProps> = ({
    testimonials,
    isLoading,
}) => {
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    // Helper to handle index change and reset expansion
    const handleNavigation = (index: number) => {
        setIsExpanded(false);
        setTestimonialIndex(index);
    };

    // Auto-rotate testimonials every 4 seconds
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

    return (
        <LazyErrorBoundary>
            <LazySection
                fallback={<div className="py-16 px-8"><ReviewSkeleton count={1} /></div>}
                rootMargin="250px 0px"
            >
                <section className="py-20 px-6 bg-brand-cocoa overflow-hidden">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

                        {/* LEFT SIDE: Heading & Navigation */}
                        <div className="w-full lg:w-2/5 text-center lg:text-left lg:sticky lg:top-24">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-block py-1 px-3 rounded-full border border-brand-cream/20 font-label text-[9px] uppercase tracking-[0.3em] text-brand-cream mb-4"
                            >
                                Reviews
                            </motion.span>

                            <h2 className="font-headline text-3xl md:text-4xl text-brand-cream leading-tight mb-8">
                                What Our Community Says
                            </h2>

                            {/* Minimalist Tab-style Navigation */}
                            <div className="hidden lg:flex flex-col gap-4">
                                {formattedTestimonials.slice(0, 5).map((t, i) => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleNavigation(i)}
                                        className="flex items-center gap-4 group transition-all text-left"
                                    >
                                        <div
                                            className={`h-[1px] transition-all duration-500 ${i === testimonialIndex
                                                    ? "w-10 bg-brand-cream"
                                                    : "w-4 bg-brand-cream/20 group-hover:bg-brand-cream/40"
                                                }`}
                                        />
                                        <span
                                            className={`font-label text-[10px] uppercase tracking-widest transition-opacity ${i === testimonialIndex
                                                    ? "text-brand-cream opacity-100"
                                                    : "text-brand-cream opacity-40 group-hover:opacity-70"
                                                }`}
                                        >
                                            {t.author}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE: The Spotlight Card */}
                        <div className="w-full lg:w-3/5 relative">
                            {/* Decorative background glow */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-brown/20 to-transparent blur-3xl rounded-full opacity-50 pointer-events-none" />

                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={testimonialIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden"
                                    >
                                        <Quotes size={32} weight="fill" className="text-brand-cream/10 mb-6" />

                                        <div className="relative">
                                            <p
                                                className={`font-sans text-base md:text-lg text-brand-cream/90 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-4" : ""
                                                    }`}
                                            >
                                                "{currentTestimonial.comment}"
                                            </p>

                                            {/* Smart Read More Toggle */}
                                            {currentTestimonial.comment && currentTestimonial.comment.length > 180 && (
                                                <button
                                                    onClick={() => setIsExpanded(!isExpanded)}
                                                    className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-cream/60 hover:text-brand-cream transition-colors group"
                                                >
                                                    <span className="border-b border-brand-cream/20 group-hover:border-brand-cream">
                                                        {isExpanded ? "Show Less" : "Read Full Story"}
                                                    </span>
                                                    <CaretRight
                                                        size={10}
                                                        className={`transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-brown/40 border border-brand-cream/20 flex items-center justify-center font-label text-xs text-brand-cream">
                                                    {currentTestimonial.author?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-brand-cream uppercase tracking-wider">
                                                        {currentTestimonial.author}
                                                    </p>
                                                    <p className="text-[10px] text-brand-cream/40 uppercase tracking-tighter">Verified Buyer</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        weight={i < currentTestimonial.rating ? "fill" : "regular"}
                                                        className="text-amber-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </section>
            </LazySection>
        </LazyErrorBoundary>
    );
};

export default TestimonialsCarousel;