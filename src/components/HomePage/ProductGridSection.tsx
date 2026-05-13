import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "../Shop";
import { LazyErrorBoundary, LazySection } from "../common";
import { ProductGridSkeleton, CategoryGridSkeleton } from "../Skeletons";
import { fadeUpVariants, staggerContainer } from "../../utils/homePageUtils";
import { Product } from "../../types";
import { ProductGridSectionProps } from "../../types/HomePage";

const ProductGridSection: React.FC<ProductGridSectionProps> = ({
    sectionId,
    title,
    subtitle,
    label,
    products,
    isLoading,
    total,
    backgroundColor = "bg-white",
    onViewAll,
    showViewAllButton = true,
    isCategoriesGrid = false,
}) => {
    if (!title && !subtitle) return null;

    return (
        <LazyErrorBoundary>
            <LazySection
                fallback={
                    <div className="py-16 px-8">
                        {isCategoriesGrid ? (
                            <CategoryGridSkeleton count={4} />
                        ) : (
                            <ProductGridSkeleton count={4} />
                        )}
                    </div>
                }
                rootMargin="300px 0px"
            >
                <section id={sectionId} className={`py-[clamp(2rem,4vw,3rem)] px-[clamp(1rem,3vw,1.5rem)] ${backgroundColor}`}>
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-[clamp(1.5rem,3vw,2rem)]"
                        >
                            {/* 1. Left Spacer (Empty on desktop to balance the button on the right) */}
                            <div className="hidden md:block" />

                            {/* 2. Centered Content */}
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-[1px] bg-[#B08A37]" />
                                    <span className="uppercase tracking-[0.35em] text-[#B08A37] text-[10px] font-semibold">
                                        Premium Collection
                                    </span>
                                    <div className="w-10 h-[1px] bg-[#B08A37]" />
                                </div>

                                <h2
                                    className="font-serif text-[clamp(1.75rem,4vw,2rem)] leading-[1.05] text-brand-brown"
                                    style={{
                                        fontWeight: 500,
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    {title}
                                </h2>
                            </div>

                            {/* 3. Right Aligned Button */}
                            <div className="flex justify-center md:justify-end shrink-0">
                                {showViewAllButton && total > 4 && onViewAll && (
                                    <button
                                        onClick={onViewAll}
                                        className="inline-flex items-center gap-2 font-label text-[clamp(0.8rem,2vw,0.9rem)] text-brand-brown hover:text-brand-cocoa transition-colors duration-200 group"
                                    >
                                        View All
                                        <ArrowRight
                                            size={16}
                                            weight="regular"
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-2 md:gap-x-4"
                        >
                            {(products.length > 0 ? products : []).map((product: Product) => (
                                <motion.div key={product.id} variants={fadeUpVariants}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}

                            {products.length === 0 && !isLoading && (
                                <div className="col-span-full text-center text-brand-brown/60" role="status">
                                    No products available yet.
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            </LazySection>
        </LazyErrorBoundary>
    );
};

export default ProductGridSection;