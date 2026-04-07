import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "@phosphor-icons/react";
import { Product, ProductVariant } from "../types";
import { useWishlist, WishlistItem } from "../context/WishlistContext";
import Modal from "./Modal";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [showVariantModal, setShowVariantModal] = useState(false);

    const variantOptions = React.useMemo(() => {
        if (!Array.isArray(product?.variants) || (product?.variants?.length ?? 0) === 0) return [];

        const options = (product?.variants ?? []).map((variant: string | ProductVariant) => {
            console.log("Processing variant:", variant);
            if (typeof variant === 'string') {
                return {
                    id: variant,
                    label: variant,
                    price: Number(product?.basePrice ?? product?.price ?? 0),
                };
            }
            return {
                id: variant?.id ?? variant?.sku,
                label: `${Math.floor(Number(variant?.weight ?? 0))} ${variant?.weightUnit ?? 'g'}`, // Display as "500g" without decimals
                weight: Number(variant?.weight ?? 0),
                price: Number(variant?.price ?? 0),
                sku: variant?.sku,
                fullVariant: variant as ProductVariant,
            };
        });

        // Sort by weight ascending (lowest g first)
        return options.sort((a: Record<string, unknown>, b: Record<string, unknown>) => (Number(a?.weight ?? 0)) - (Number(b?.weight ?? 0)));
    }, [product]);

    const priceRange = React.useMemo(() => {
        if ((variantOptions?.length ?? 0) === 0) {
            const basePrice = Number(product?.basePrice ?? product?.price ?? 0);
            return { min: basePrice, max: basePrice };
        }
        const prices = (variantOptions ?? []).map((v: Record<string, unknown>) => Number(v?.price ?? 0));
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [product, variantOptions]);

    const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // If product has multiple variants, show modal to select variant
        if (variantOptions.length > 1) {
            setShowVariantModal(true);
        } else if (variantOptions.length === 1) {
            // Single variant - add with that variant
            const variant = variantOptions[0];
            const wishlistItem: WishlistItem = {
                productId: product.id,
                variantId: variant.id,
                variantLabel: variant.label,
                weight: variant.label,
                price: variant.price,
            };
            toggleWishlist(wishlistItem);
        } else {
            // No variants - add just product
            const wishlistItem: WishlistItem = {
                productId: product.id,
                variantLabel: product.name,
                price: Number(product?.discountedPrice ?? product?.basePrice ?? product?.price ?? 0),
            };
            toggleWishlist(wishlistItem);
        }
    };

    const handleVariantSelect = (variant: Record<string, any>) => {
        const wishlistItem: WishlistItem = {
            productId: product.id,
            variantId: variant.id,
            variantLabel: variant.label,
            weight: variant.label,
            price: variant.price,
        };
        toggleWishlist(wishlistItem);
        setShowVariantModal(false);
    };

    const isAnyVariantInWishlist = React.useMemo(() => {
        if (variantOptions.length === 0) {
            return isInWishlist(product.id);
        }
        return variantOptions.some(v => isInWishlist(product.id, v.id));
    }, [variantOptions, isInWishlist, product.id]);

    return (
        <>
            <Link to={`/products/${product.id}`} className="w-full h-full" onClick={(e) => {
                if (showVariantModal) {
                    e.preventDefault();
                }
            }}>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="group bg-white rounded-[24px] border border-brand-brown/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 flex flex-col h-full"
                >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                            src={product?.images?.[0] ?? "https://via.placeholder.com/300?text=No+Image"}
                            alt={product?.name ?? 'Product'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product?.badge && (
                                <span className={`${(product?.isNew ?? false) ? "bg-brand-plum" : "bg-brand-brown"} text-brand-cream text-[10px] font-label uppercase tracking-widest px-2 py-1 rounded-md`}>
                                    {product?.badge}
                                </span>
                            )}
                        </div>

                        <button
                            className={`absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer ${
                                isAnyVariantInWishlist
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white/80 backdrop-blur-sm text-brand-brown hover:bg-brand-brown hover:text-brand-cream'
                            }`}
                            onClick={handleWishlistToggle}
                            title={isAnyVariantInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={18} weight={isAnyVariantInWishlist ? "fill" : "regular"} />
                        </button>

                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                        {/* <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        weight={i < Math.floor(product.rating) ? "fill" : "regular"}
                                        className="text-yellow-400"
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 font-sans">
                                ({product.reviewCount})
                            </span>
                        </div> */}

                        <h3 className="font-headline text-brand-brown text-lg mb-1 line-clamp-1 group-hover:text-brand-cocoa transition-colors">
                            {product?.name ?? 'Product'}
                        </h3>

                        {/* <p className="text-xs text-gray-500 font-sans mb-2">
                            {product?.weight ? `${product.weight}g` : `${(variantOptions?.length ?? 0)} weight options`}
                        </p> */}

                        {(product?.discountedPercent ?? 0) > 0 && (
                            <div className="mb-2">
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-label uppercase tracking-wider">
                                    {(product?.discountedPercent ?? 0).toFixed(0)}% OFF
                                </span>
                            </div>
                        )}

                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-col">
                                {product?.discountedPrice ? (
                                    <>
                                        <span className="text-lg font-bold text-brand-brown">
                                            ₹{Number(product?.discountedPrice ?? 0).toFixed(0)}
                                        </span>
                                        <span className="text-xs text-gray-400 line-through">
                                            ₹{Number(product?.basePrice ?? product?.price ?? 0).toFixed(0)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-bold text-brand-brown">
                                        {(priceRange?.min ?? 0) === (priceRange?.max ?? 0)
                                            ? `₹${(priceRange?.min ?? 0).toFixed(0)}`
                                            : `₹${(priceRange?.min ?? 0).toFixed(0)} - ₹${(priceRange?.max ?? 0).toFixed(0)}`}
                                    </span>
                                )}
                                <span className="text-xs text-gray-400 mt-1">
                                    {(variantOptions?.length ?? 0)} weight options
                                </span>
                            </div>

                            <span className="text-[10px] font-label uppercase tracking-wider text-gray-400 group-hover:text-brand-brown transition-colors">
                                View Details →
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Variant Selection Modal - Using Consistent Modal Component */}
            <Modal
                isOpen={showVariantModal}
                onClose={() => setShowVariantModal(false)}
                title="Select Weight"
                maxWidth="max-w-md"
            >
                <p className="text-sm text-slate-600 mb-4">{product.name}</p>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {variantOptions.map((variant) => {
                        const isSelected = isInWishlist(product.id, variant.id);
                        return (
                            <button
                                key={variant.id}
                                onClick={() => handleVariantSelect(variant)}
                                className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                                    isSelected
                                        ? 'border-brand-brown bg-amber-50'
                                        : 'border-slate-200 hover:border-brand-brown bg-white hover:bg-slate-50'
                                }`}
                            >
                                <div>
                                    <div className="font-semibold text-brand-brown">{variant.label}</div>
                                    <div className="text-sm text-slate-600">₹{Number(variant.price).toFixed(0)}</div>
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-brand-brown flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => setShowVariantModal(false)}
                        className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default memo(ProductCard);