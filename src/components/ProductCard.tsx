import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "@phosphor-icons/react";
import { Product, ProductVariant } from "../types";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    const variantOptions = React.useMemo(() => {
        if (!Array.isArray(product?.variants) || (product?.variants?.length ?? 0) === 0) return [];

        const options = (product?.variants ?? []).map((variant: string | ProductVariant) => {
            if (typeof variant === 'string') {
                return {
                    id: variant,
                    label: variant,
                    price: Number(product?.basePrice ?? product?.price ?? 0),
                };
            }
            return {
                id: variant?.id ?? variant?.sku,
                label: `${Math.floor(Number(variant?.weight ?? 0))}g`, // Display as "500g" without decimals
                weight: Number(variant?.weight ?? 0),
                price: Number(variant?.price ?? 0),
                sku: variant?.sku,
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

    return (
        <Link to={`/products/${product.id}`} className="w-full h-full">
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
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
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-brown hover:text-brand-cream cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            // Wishlist logic here
                        }}
                    >
                        <Heart size={18} />
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
    );
};

export default memo(ProductCard);