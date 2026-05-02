import React from "react";
import { motion } from "framer-motion";
import { Trash, ShoppingBag } from "@phosphor-icons/react";
import { WishlistProductCardProps } from "../../types/WishlistPage";

const fadeInVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({
    product,
    onAddToCart,
    onRemove,
    onNavigate,
}) => {
    return (
        <motion.div
            layout
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[24px] border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col group"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7]">
                <img
                    src={product?.images?.[0] ?? 'https://via.placeholder.com/300?text=No+Image'}
                    alt={product?.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onClick={() => onNavigate(product.slug)}
                />
                {/* Luxury Floating Controls */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={() => onRemove(product.id, product.wishlistItem?.variantId)}
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
            <div className="p-[clamp(1rem,2vw,1.5rem)] flex flex-col flex-1">
                <div className="mb-auto">
                    <h3
                        className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-brand-brown transition-colors cursor-pointer"
                        onClick={() => onNavigate(product.slug)}
                    >
                        {product?.name}
                    </h3>
                    {product.selectedVariant && (
                        <p className="text-[clamp(0.625rem,1.2vw,0.75rem)] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            {product.selectedVariant.label || `${product.selectedVariant.weight}${product.selectedVariant.weightUnit}`}
                        </p>
                    )}
                </div>

                <div className="mt-[clamp(0.75rem,1.5vw,1rem)] flex items-end justify-between border-t border-slate-50 pt-[clamp(0.75rem,1.5vw,1rem)]">
                    <div>
                        <p className="text-[clamp(1rem,2vw,1.25rem)] font-black text-slate-900 tracking-tight">
                            ₹{Number(product.selectedVariant?.discountedPrice ?? product?.discountedPrice ?? product?.price ?? 0).toFixed(0)}
                        </p>
                        {(product.selectedVariant?.discountedPrice ?? product?.discountedPrice) && (
                            <p className="text-[clamp(0.625rem,1.2vw,0.75rem)] text-slate-400 line-through font-medium">
                                ₹{Number(product.selectedVariant?.price ?? product?.basePrice ?? product?.price ?? 0).toFixed(0)}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="p-2 bg-brand-brown text-white rounded-full hover:bg-brand-plum transition-all shadow-md active:scale-90 min-h-10 min-w-10 flex items-center justify-center"
                    >
                        <ShoppingBag size={18} weight="bold" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default WishlistProductCard;