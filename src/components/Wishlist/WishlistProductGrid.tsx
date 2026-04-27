import React from "react";
import { AnimatePresence } from "framer-motion";
import { LazyErrorBoundary, LazySection } from "../common";
import { ProductGridSkeleton } from "../Skeletons";
import { WishlistProductGridProps } from "../../types/WishlistPage";
import { WishlistProductCard } from "./index";

const WishlistProductGrid: React.FC<WishlistProductGridProps> = ({
    products,
    onAddToCart,
    onRemove,
    onNavigate,
}) => {
    return (
        <LazyErrorBoundary>
            <LazySection fallback={<ProductGridSkeleton count={6} />} rootMargin="200px 0px">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-[clamp(1rem,2vw,1.25rem)]">
                    <AnimatePresence mode="popLayout">
                        {products.map((product) => (
                            <WishlistProductCard
                                key={`${product?.id}-${product.wishlistItem?.variantId}`}
                                product={product}
                                onAddToCart={onAddToCart}
                                onRemove={onRemove}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </LazySection>
        </LazyErrorBoundary>
    );
};

export default WishlistProductGrid;