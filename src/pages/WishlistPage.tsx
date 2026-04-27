import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CardContext';
import { ProductVariant } from '../types';
import { productsClient } from '../api/products/client';
import { WishlistPageSkeleton } from '../components/Skeletons';
import { ConfirmDialog } from "../components/common";
import {
    WishlistHeader,
    WishlistEmptyState,
    WishlistProductGrid,
    WishlistSummarySidebar,
} from '../components/Wishlist';
import { WishlistProductWithVariant } from '../types/WishlistPage';

const fadeInVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WishlistPage: React.FC = () => {
    const navigate = useNavigate();
    const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
    const { dispatch } = useCart();
    const [wishlistProducts, setWishlistProducts] = useState<WishlistProductWithVariant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showRemoveAllConfirm, setShowRemoveAllConfirm] = useState(false);
    const [isRemovingAll, setIsRemovingAll] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (wishlistItems.length === 0) {
                setWishlistProducts([]);
                setIsLoading(false);
                return;
            }
            if (wishlistProducts?.length === 0) {
                setIsLoading(true);
            }
            try {
                const productPromises = wishlistItems.map((item) =>
                    productsClient.getProduct(item.productId)
                        .then((product) => {
                            if (!product) return null;
                            let selectedVariant: ProductVariant | undefined;
                            if (item.variantId && Array.isArray(product.variants)) {
                                const variant = product.variants.find(v => {
                                    if (typeof v === 'object' && 'id' in v) {
                                        return (v as ProductVariant).id === item.variantId;
                                    }
                                    return false;
                                });
                                if (typeof variant === 'object' && 'id' in variant) {
                                    selectedVariant = variant as ProductVariant;
                                }
                            }
                            return { ...product, selectedVariant, wishlistItem: item };
                        })
                        .catch(() => null)
                );
                const products = await Promise.all(productPromises);
                setWishlistProducts(products.filter((p) => p !== null));
            } catch (error) {
                console.error('Error fetching wishlist products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [wishlistItems]);

    const handleAddToCart = (product: WishlistProductWithVariant) => {
        const variantToAdd = product.selectedVariant ||
            (Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : null);
        dispatch({
            type: 'ADD_ITEM',
            payload: { product, quantity: 1, variant: variantToAdd },
        });
        if (product.wishlistItem) {
            removeFromWishlist(product.id, product.wishlistItem.variantId);
        }
    };

    const handleRemoveFromWishlist = (productId: string, variantId?: string) => {
        setWishlistProducts(prev =>
            prev.filter(p => !(p.id === productId && p.wishlistItem?.variantId === variantId))
        );
        removeFromWishlist(productId, variantId);
    };

    const handleRemoveAll = async () => {
        setIsRemovingAll(true);
        try {
            wishlistItems.forEach((item) => {
                removeFromWishlist(item.productId, item.variantId);
            });
            setWishlistProducts([]);
        } finally {
            setIsRemovingAll(false);
            setShowRemoveAllConfirm(false);
        }
    };

    const handleNavigateToProduct = (productId: string) => {
        navigate(`/products/${productId}`);
    };

    const totalValue = useMemo(() => {
        return wishlistProducts.reduce((sum, product) => {
            const price = product.selectedVariant?.discountedPrice ??
                product.selectedVariant?.price ??
                product?.discountedPrice ??
                product?.basePrice ??
                product?.price ?? 0;
            return sum + Number(price);
        }, 0);
    }, [wishlistProducts]);

    if (isLoading) {
        return <WishlistPageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Minimal Sticky Header */}
            <WishlistHeader
                wishlistCount={wishlistCount}
                onBack={() => navigate(-1)}
            />

            <div className="max-w-7xl mx-auto px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-24">
                {/* Header Section */}
                <motion.div variants={fadeInVariants} initial="hidden" animate="visible" className="mb-[clamp(1.5rem,3vw,2rem)]">
                    <h1 className="font-headline text-[clamp(1.75rem,4vw,2.5rem)] text-brand-brown mb-[clamp(0.75rem,1.5vw,1rem)] tracking-tighter" style={{ fontWeight: 600 }}>
                        My Collection
                    </h1>
                    <div className="h-1 w-20 bg-brand-brown/20 rounded-full mb-[clamp(0.75rem,1.5vw,1rem)]" />
                    <p className="text-slate-500 text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium">
                        {wishlistCount === 0 ? 'Your vault is empty' : `Curating ${wishlistCount} premium selection${wishlistCount !== 1 ? 's' : ''}`}
                    </p>
                </motion.div>

                {wishlistCount === 0 ? (
                    <WishlistEmptyState onExplore={() => navigate('/shop')} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-[clamp(1.5rem,3vw,2.5rem)]">
                        {/* Products Grid - Increased Density to 4 columns on larger screens */}
                        <div className="lg:col-span-3">
                            <WishlistProductGrid
                                products={wishlistProducts}
                                onAddToCart={handleAddToCart}
                                onRemove={handleRemoveFromWishlist}
                                onNavigate={handleNavigateToProduct}
                            />
                        </div>

                        {/* Summary Sidebar - Luxury Card */}
                        <div className="lg:col-span-1">
                            <WishlistSummarySidebar
                                wishlistCount={wishlistCount}
                                totalValue={totalValue}
                                onMoveAllToCart={() => wishlistProducts.forEach(p => handleAddToCart(p))}
                                onContinueBrowsing={() => navigate('/shop')}
                                onClearAll={() => setShowRemoveAllConfirm(true)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog for Remove All */}
            <ConfirmDialog
                isOpen={showRemoveAllConfirm}
                title="Clear Entire Wishlist"
                description="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
                confirmText="Clear All"
                cancelText="Cancel"
                onConfirm={handleRemoveAll}
                onCancel={() => setShowRemoveAllConfirm(false)}
                isLoading={isRemovingAll}
            />
        </div>
    );
};

export default WishlistPage;