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
                            className="flex flex-col md:flex-row md:items-end justify-between gap-[clamp(1rem,2vw,1.5rem)] mb-[clamp(1.5rem,3vw,2rem)]"
                        >
                            <div className="max-w-2xl">
                                {label && (
                                    <span className="font-label text-[clamp(0.7rem,2vw,0.85rem)] uppercase tracking-widest text-brand-cocoa block mb-2">
                                        {label}
                                    </span>
                                )}
                                <h2
                                    className="font-headline text-[clamp(1.75rem,4vw,2.2rem)] text-brand-brown mb-[clamp(0.75rem,1.5vw,1rem)]"
                                    style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                >
                                    {title}
                                </h2>

                                {subtitle && (
                                    <p className="font-sans text-[clamp(0.9rem,2.5vw,1rem)] text-brand-brown/80 leading-relaxed">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            {showViewAllButton && total > 4 && onViewAll && (
                                <div className="shrink-0">
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
                                </div>
                            )}
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