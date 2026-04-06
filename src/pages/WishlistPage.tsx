import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash, ArrowLeft, ShoppingCart, Heart } from '@phosphor-icons/react';
import { useWishlist, WishlistItem } from '../context/WishlistContext';
import { useCart } from '../context/CardContext';
import { Product, ProductVariant } from '../types';
import { productsClient } from '../api/products/client';
import { WishlistPageSkeleton } from '../components/Skeletons';
import ConfirmDialog from '../components/ConfirmDialog';

interface WishlistProductWithVariant extends Product {
    selectedVariant?: ProductVariant;
    wishlistItem?: WishlistItem;
}

const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const WishlistPage: React.FC = () => {
    const navigate = useNavigate();
    const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
    const { dispatch } = useCart();
    const [wishlistProducts, setWishlistProducts] = useState<WishlistProductWithVariant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showRemoveAllConfirm, setShowRemoveAllConfirm] = useState(false);
    const [isRemovingAll, setIsRemovingAll] = useState(false);

    // Fetch wishlist products from API with their variants
    useEffect(() => {
        const fetchProducts = async () => {
            if (wishlistItems.length === 0) {
                setWishlistProducts([]);
                setIsLoading(false);
                return;
            }

            // Only show loading if we don't have products yet
            if (wishlistProducts?.length === 0) {
                setIsLoading(true);
            }

            try {
                // Fetch products in parallel using products API
                const productPromises = wishlistItems.map((item) =>
                    productsClient.getProduct(item.productId)
                        .then((product) => {
                            if (!product) return null;
                            
                            // Find the variant if variantId is specified
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
        // Use the selected variant if available, otherwise use first variant or null
        const variantToAdd = product.selectedVariant || 
            (Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : null);
        
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                product,
                quantity: 1,
                variant: variantToAdd,
            },
        });

        // Remove from wishlist after adding to cart
        if (product.wishlistItem) {
            removeFromWishlist(product.id, product.wishlistItem.variantId);
        }
    };

    const handleRemoveFromWishlist = (productId: string, variantId?: string) => {
        // Optimistically remove from local state first
        setWishlistProducts(prev => 
            prev.filter(p => !(p.id === productId && p.wishlistItem?.variantId === variantId))
        );
        // Then update the context
        removeFromWishlist(productId, variantId);
    };

    const handleRemoveAll = async () => {
        setIsRemovingAll(true);
        try {
            // Remove all items from context and local state
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
            // Use variant price if available, otherwise use product price
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-20">
                {/* Header */}
                <motion.div
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-brand-brown hover:text-brand-cocoa transition-colors font-medium mb-6"
                    >
                        <ArrowLeft size={20} weight="bold" />
                        Back
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-headline text-5xl text-brand-brown mb-2" style={{ fontWeight: 500, letterSpacing: '-0.025em' }}>
                                My Wishlist
                            </h1>
                            <p className="text-slate-600">
                                {wishlistCount === 0
                                    ? 'Your wishlist is empty'
                                    : `${wishlistCount} item${wishlistCount !== 1 ? 's' : ''} in your wishlist`}
                            </p>
                        </div>
                        <Heart size={48} weight="fill" className="text-red-500 opacity-20 hidden md:block" />
                    </div>
                </motion.div>

                {/* Empty State */}
                {wishlistCount === 0 ? (
                    <motion.div
                        variants={fadeInVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm"
                    >
                        <Heart size={64} className="mx-auto mb-4 text-slate-300" weight="light" />
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Start adding your favorite dry fruits and nuts to your wishlist. You can save them for later!
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="inline-flex items-center gap-2 bg-brand-brown text-white px-6 py-3 rounded-lg hover:bg-brand-cocoa transition-colors font-semibold"
                        >
                            Continue Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Products Grid */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {wishlistProducts.map((product: WishlistProductWithVariant, index: number) => (
                                    <motion.div
                                        key={`${product.id}-${product.wishlistItem?.variantId}`}
                                        variants={fadeInVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer group">
                                            <img
                                                src={product?.images?.[0] ?? 'https://via.placeholder.com/300?text=No+Image'}
                                                alt={product?.name ?? 'Product'}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                onClick={() => handleNavigateToProduct(product.id)}
                                            />

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveFromWishlist(product.id, product.wishlistItem?.variantId)}
                                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                title="Remove from wishlist"
                                            >
                                                <Trash size={18} weight="bold" />
                                            </button>

                                            {/* Badge */}
                                            {(product?.discountedPercent ?? 0) > 0 && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        {(product?.discountedPercent ?? 0).toFixed(0)}% OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3
                                                className="font-headline text-lg text-brand-brown mb-2 line-clamp-2 cursor-pointer hover:text-brand-cocoa transition-colors"
                                                onClick={() => handleNavigateToProduct(product.id)}
                                            >
                                                {product?.name ?? 'Product'}
                                            </h3>

                                            {/* Variant Info */}
                                            {product.selectedVariant && (
                                                <div className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                                                    {product.selectedVariant.label && (
                                                        <span className="bg-slate-100 px-2 py-1 rounded">
                                                            {product.selectedVariant.label}
                                                        </span>
                                                    )}
                                                    {product.selectedVariant.weight && (
                                                        <span className="text-slate-600">
                                                            {product.selectedVariant.weight}
                                                            {product.selectedVariant.weightUnit}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Pricing */}
                                            <div className="mb-4 flex-1">
                                                {(product.selectedVariant?.discountedPrice ?? product?.discountedPrice) ? (
                                                    <div className="space-y-1">
                                                        <span className="block text-xl font-bold text-brand-brown">
                                                            ₹{Number(product.selectedVariant?.discountedPrice ?? product?.discountedPrice ?? 0).toFixed(0)}
                                                        </span>
                                                        <span className="block text-sm text-slate-400 line-through">
                                                            ₹{Number(product.selectedVariant?.price ?? product?.basePrice ?? product?.price ?? 0).toFixed(0)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="block text-xl font-bold text-brand-brown">
                                                        ₹{Number(product.selectedVariant?.price ?? product?.price ?? 0).toFixed(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-brand-brown text-white py-3 rounded-lg hover:bg-brand-cocoa transition-colors font-semibold flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart size={16} weight="bold" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <motion.div
                            variants={fadeInVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="h-fit bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-32"
                        >
                            <h3 className="font-headline text-xl text-brand-brown mb-6">Wishlist Summary</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Total Items</span>
                                    <span className="font-semibold text-brand-brown">{wishlistCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Total Value</span>
                                    <span className="font-semibold text-brand-brown">₹{totalValue.toFixed(0)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/shop')}
                                className="w-full bg-brand-brown text-white py-3 rounded-lg hover:bg-brand-cocoa transition-colors font-semibold mb-3"
                            >
                                Continue Shopping
                            </button>

                            <button
                                onClick={() => {
                                    // Add all items to cart
                                    wishlistProducts.forEach((product) => {
                                        handleAddToCart(product);
                                    });
                                }}
                                className="w-full border-2 border-brand-brown text-brand-brown py-3 rounded-lg hover:bg-brand-brown/5 transition-colors font-semibold mb-3"
                            >
                                Add All to Cart
                            </button>

                            <button
                                onClick={() => setShowRemoveAllConfirm(true)}
                                className="w-full border-2 border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                                <Trash size={16} weight="bold" />
                                Remove All
                            </button>
                        </motion.div>

                        {/* Remove All Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={showRemoveAllConfirm}
                            type="danger"
                            title="Remove All from Wishlist?"
                            description="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
                            confirmText="Remove All"
                            cancelText="Cancel"
                            isLoading={isRemovingAll}
                            onConfirm={handleRemoveAll}
                            onCancel={() => setShowRemoveAllConfirm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
