import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash, ArrowLeft, ShoppingCart, Heart, ShoppingBag } from '@phosphor-icons/react';
import { useWishlist, WishlistItem } from '../context/WishlistContext';
import { useCart } from '../context/CardContext';
import LazySection from '../components/LazySection';
import LazyErrorBoundary from '../components/LazyErrorBoundary';
import { ProductGridSkeleton } from '../components/Skeletons';
import { Product, ProductVariant } from '../types';
import { productsClient } from '../api/products/client';
import { WishlistPageSkeleton } from '../components/Skeletons';
import ConfirmDialog from '../components/ConfirmDialog';

interface WishlistProductWithVariant extends Product {
    selectedVariant?: ProductVariant;
    wishlistItem?: WishlistItem;
}

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
            <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 hover:text-brand-brown transition-all">
                        <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> BACK
                    </button>
                    <div className="hidden md:block text-xs font-black tracking-[0.2em] text-brand-brown uppercase">
                        Secure Wishlist
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart size={18} weight="fill" className="text-brand-brown" />
                        <span className="text-sm font-bold text-slate-800">{wishlistCount}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-24">
                {/* Header Section */}
                <motion.div variants={fadeInVariants} initial="hidden" animate="visible" className="mb-12">
                    <h1 className="font-headline text-3xl md:text-4xl text-brand-brown mb-3 tracking-tighter" style={{ fontWeight: 600 }}>
                        My Collection
                    </h1>
                    <div className="h-1 w-20 bg-brand-brown/20 rounded-full mb-4" />
                    <p className="text-slate-500 text-sm md:text-base font-medium">
                        {wishlistCount === 0 ? 'Your vault is empty' : `Curating ${wishlistCount} premium selection${wishlistCount !== 1 ? 's' : ''}`}
                    </p>
                </motion.div>

                {wishlistCount === 0 ? (
                    <motion.div variants={fadeInVariants} initial="hidden" animate="visible" className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <Heart size={48} className="mx-auto mb-6 text-slate-200" weight="thin" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Nothing saved yet</h2>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                            Discover our exclusive range of dry fruits and artisan nuts to fill your collection.
                        </p>
                        <button onClick={() => navigate('/shop')} className="inline-flex items-center gap-3 bg-brand-brown text-white px-8 py-4 rounded-full hover:shadow-xl hover:shadow-brand-brown/20 transition-all font-bold text-xs uppercase tracking-widest">
                            Start Exploring
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        {/* Products Grid - Increased Density to 4 columns on larger screens */}
                        <div className="lg:col-span-3">
                            <LazyErrorBoundary>
                                <LazySection fallback={<ProductGridSkeleton count={6} />} rootMargin="200px 0px">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-5 md:gap-8">
                                        <AnimatePresence mode="popLayout">
                                            {wishlistProducts.map((product, index) => (
                                                <motion.div
                                                    layout
                                                    key={`${product.id}-${product.wishlistItem?.variantId}`}
                                                    variants={fadeInVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-white rounded-[24px] border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col"
                                                >
                                                    {/* Image Container */}
                                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7]">
                                                        <img
                                                            src={product?.images?.[0] ?? 'https://via.placeholder.com/300?text=No+Image'}
                                                            alt={product?.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            onClick={() => handleNavigateToProduct(product.id)}
                                                        />
                                                        {/* Luxury Floating Controls */}
                                                        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                            <button
                                                                onClick={() => handleRemoveFromWishlist(product.id, product.wishlistItem?.variantId)}
                                                                className="p-2.5 bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-full shadow-lg transition-colors"
                                                            >
                                                                <Trash size={16} weight="bold" />
                                                            </button>
                                                        </div>

                                                        {(product?.discountedPercent ?? 0) > 0 && (
                                                            <div className="absolute top-4 left-0">
                                                                <span className="bg-brand-brown text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-widest rounded-r-lg shadow-lg">
                                                                    {(product?.discountedPercent ?? 0).toFixed(0)}% Off
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-4 md:p-6 flex flex-col flex-1">
                                                        <div className="mb-auto">
                                                            <h3 className="text-sm md:text-base font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-brand-brown transition-colors cursor-pointer"
                                                                onClick={() => handleNavigateToProduct(product.id)}>
                                                                {product?.name}
                                                            </h3>
                                                            {product.selectedVariant && (
                                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                    {product.selectedVariant.label || `${product.selectedVariant.weight}${product.selectedVariant.weightUnit}`}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="mt-4 flex items-end justify-between border-t border-slate-50 pt-4">
                                                            <div>
                                                                <p className="text-lg font-black text-slate-900 tracking-tight">
                                                                    ₹{Number(product.selectedVariant?.discountedPrice ?? product?.discountedPrice ?? product?.price ?? 0).toFixed(0)}
                                                                </p>
                                                                {(product.selectedVariant?.discountedPrice ?? product?.discountedPrice) && (
                                                                    <p className="text-xs text-slate-400 line-through font-medium">
                                                                        ₹{Number(product.selectedVariant?.price ?? product?.basePrice ?? product?.price ?? 0).toFixed(0)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => handleAddToCart(product)}
                                                                className="p-2 bg-brand-brown text-white rounded-full hover:bg-brand-plum transition-all shadow-md active:scale-90"
                                                            >
                                                                <ShoppingBag size={18} weight="bold"  />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </LazySection>
                            </LazyErrorBoundary>
                        </div>

                        {/* Summary Sidebar - Luxury Card */}
                        <div className="lg:col-span-1">
                            <motion.div variants={fadeInVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="sticky top-32">
                                <div                                 className="bg-white rounded-[24px] border border-brand-brown/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-brown/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Order Summary</h3>

                                    <div className="space-y-5 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-500">Selections</span>
                                            <span className="text-sm font-bold text-slate-900">{wishlistCount}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-medium text-slate-500">Estimated Total</span>
                                            <div className="text-right">
                                                <span className="block text-2xl font-black text-brand-brown">₹{totalValue.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button onClick={() => wishlistProducts.forEach(p => handleAddToCart(p))} className="w-full bg-brand-brown text-white py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-brown/20 transition-all font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <ShoppingCart size={16} weight="bold" /> Move All to Cart
                                        </button>
                                        <button onClick={() => navigate('/shop')} className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl hover:bg-slate-50 transition-all font-bold text-[11px] uppercase tracking-widest">
                                            Continue Browsing
                                        </button>
                                        <button onClick={() => setShowRemoveAllConfirm(true)} className="w-full text-red-400 py-3 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors">
                                            Clear Entire Wishlist
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showRemoveAllConfirm}
                type="danger"
                title="Empty Collection?"
                description="This will remove all items currently saved in your vault. This action cannot be reversed."
                confirmText="Yes, Clear All"
                cancelText="Keep My Items"
                isLoading={isRemovingAll}
                onConfirm={handleRemoveAll}
                onCancel={() => setShowRemoveAllConfirm(false)}
            />
        </div>
    );
};

export default WishlistPage;