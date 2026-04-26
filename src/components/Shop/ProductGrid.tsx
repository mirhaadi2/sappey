import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, ViewMode } from '../../types';
import ProductCard from '../ProductCard';

interface ProductGridProps {
    products: Product[];
    viewMode: ViewMode;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    hasNextPage: boolean;
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
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
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const gridClass = {
        "grid-4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        "grid-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "grid-2": "grid-cols-1 sm:grid-cols-2",
    }[viewMode];

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage || !loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) onLoadMore();
            },
            { rootMargin: "300px" }
        );
        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={`grid gap-8 items-stretch ${gridClass}`}
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </motion.div>

            {/* Load More Area */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="mt-20 flex justify-center">
                    <button
                        onClick={() => onLoadMore()}
                        disabled={isFetchingNextPage}
                        className="group flex items-center gap-3 px-12 py-5 bg-white border border-brand-latte text-brand-brown rounded-[24px] font-bold hover:bg-brand-brown hover:text-white transition-all duration-500 disabled:opacity-50"
                    >
                        {isFetchingNextPage ? (
                            <div className="w-5 h-5 border-2 border-brand-brown/30 border-t-brand-brown animate-spin rounded-full" />
                        ) : (
                            "Show More Products"
                        )}
                    </button>
                </div>
            )}
        </>
    );
};

export default ProductGrid;
