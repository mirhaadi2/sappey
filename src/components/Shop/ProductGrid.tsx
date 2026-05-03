import React, { useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { ProductGridProps } from '../../types';
import { ProductCard } from './index';

// Professional Stagger: Subtle and fast for a "snappy" feel
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // Faster stagger for better UX
            delayChildren: 0.1
        }
    },
};

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    viewMode,
    isLoading,
    isFetchingNextPage,
    onLoadMore,
    hasNextPage,
}) => {
    console.log(viewMode,'v')
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const gridClass = {
        "grid-4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        "grid-3": "grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
        "grid-2": "grid-cols-1 md:grid-cols-2",
    }[viewMode];

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage || !loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) onLoadMore();
            },
            {
                rootMargin: "400px", // Increased margin so users never see the "loading" state
                threshold: 0.1
            }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <div className="w-full">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className={`grid gap-y-6 gap-x-4 md:gap-x-6 ${gridClass}`}
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </motion.div>

            {/* Load More Area */}
            {hasNextPage && (
                <div
                    ref={loadMoreRef}
                    className="mt-16 md:mt-24 pb-12 flex justify-center"
                >
                    <button
                        onClick={() => onLoadMore()}
                        disabled={isFetchingNextPage}
                        className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 bg-white border border-brand-latte text-brand-brown rounded-full font-bold transition-all duration-500 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                    >
                        {isFetchingNextPage ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-brand-brown/20 border-t-brand-brown animate-spin rounded-full" />
                                <span className="text-sm uppercase tracking-widest">Loading...</span>
                            </div>
                        ) : (
                            <span className="text-sm uppercase tracking-widest">Discover More</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(ProductGrid);