import React, { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ShoppingCartSimple } from "@phosphor-icons/react";
import { ProductCardProps, ProductVariant } from "../../types";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CardContext";
import { getDisplayPrice, getOriginalDisplayPrice } from "../../utils/priceUtils";
import { Modal } from "../common";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { dispatch } = useCart();

    const [showVariantModal, setShowVariantModal] = useState(false);
    const [modalMode, setModalMode] = useState<"wishlist" | "cart">("wishlist");

    const variantOptions = useMemo(() => {
        if (!Array.isArray(product?.variants) || product?.variants?.length === 0) return [];

        return product.variants.map((variant: any) => {
            const basePrice = Number(variant?.price ?? variant?.basePrice ?? 0);
            const discountedPrice = variant?.discountedPrice ? Number(variant.discountedPrice) : null;
            const displayPrice = getDisplayPrice({ product, variant });
            const originalDisplayPrice = getOriginalDisplayPrice({ product, variant });

            return {
                id: variant?.id ?? variant?.sku,
                label: `${Math.floor(Number(variant?.weight ?? 0))} ${variant?.weightUnit ?? 'g'}`,
                weight: Number(variant?.weight ?? 0),
                price: basePrice,
                discountedPrice: discountedPrice,
                effectivePrice: displayPrice,
                displayOriginalPrice: originalDisplayPrice,
                sku: variant?.sku,
                fullVariant: variant as ProductVariant,
            };
        }).sort((a, b) => a.weight - b.weight);
    }, [product]);

    const priceRange = useMemo(() => {
        if (variantOptions.length === 0) {
            const basePrice = Number(product?.minPrice ?? product?.price ?? product?.basePrice ?? product?.displayPrice ?? 0);
            return { min: basePrice, max: basePrice };
        }
        const prices = variantOptions.map(v => v.effectivePrice);
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [product, variantOptions]);

    const handleAction = (variant: any, mode: "wishlist" | "cart") => {
        if (mode === "cart") {
            dispatch({
                type: "ADD_ITEM",
                payload: {
                    product,
                    variant: variant.fullVariant,
                    quantity: 1
                }
            });
        } else {
            toggleWishlist({
                productId: product.id,
                variantId: variant.id,
                variantLabel: variant.label,
                price: variant.price,
                discountedPrice: variant?.effectivePrice
            });
        }
        setShowVariantModal(false);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (variantOptions.length > 1) {
            setModalMode("wishlist");
            setShowVariantModal(true);
        } else {
            handleAction(variantOptions[0], "wishlist");
        }
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (variantOptions.length > 1) {
            setModalMode("cart");
            setShowVariantModal(true);
        } else {
            handleAction(variantOptions[0], "cart");
        }
    };

    const isAnyVariantInWishlist = useMemo(() => {
        if (variantOptions.length === 0) return isInWishlist(product.id);
        return variantOptions.some(v => isInWishlist(product.id, v.id));
    }, [variantOptions, isInWishlist, product.id]);

    const isSoldOut = !product?.isAvailable;

    // Shared Card Wrapper Logic for cleaner JSX
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const cardClassName = `group relative flex flex-col w-full h-full bg-white rounded-md md:rounded-lg border border-brand-brown/10 overflow-hidden shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(62,44,28,0.12)] ${isSoldOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`;

    return (
        <>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="w-full h-full"
            >
                <Link
                    to={isSoldOut ? "#" : `/products/${product.slug}`}
                    className={`block h-full w-full ${isSoldOut ? "pointer-events-none" : ""}`}
                    onClick={(e) => {
                        if (isSoldOut || (showVariantModal)) e.preventDefault();
                    }}
                >
                    <div className={cardClassName}>
                        {/* Image Container - Responsive aspect ratio */}
                        <div className="relative aspect-square m-1.5 md:m-2.5 overflow-hidden bg-[#FAF9F6]">
                            <img
                                src={product?.images?.[0] || "https://via.placeholder.com/400"}
                                alt={product?.name}
                                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Overlays */}
                            {!isSoldOut && <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

                            {isSoldOut && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-bold text-sm md:text-lg uppercase tracking-wider">Sold Out</span>
                                </div>
                            )}

                            {/* Badges - Top Left */}
                            <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5">
                                {(product?.isNew || product?.isBestseller) && (
                                    <span className={`${product?.isNew ? "bg-brand-plum" : "bg-brand-brown"} text-white text-[7px] md:text-[8px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg shadow-sm`}>
                                        {product?.isNew ? "New Arrival" : "Bestseller"}
                                    </span>
                                )}
                            </div>

                            {/* Actions - Top Right (Hidden on mobile by default, shown on hover/touch) */}
                            {!isSoldOut && (
                                <div className="absolute top-2 right-2 md:top-3 md:right-3 flex flex-col gap-2 z-10">
                                    {/* <button
                                        className={`p-2 md:p-2.5 rounded-full transition-all duration-300 transform shadow-md ${isAnyVariantInWishlist
                                            ? 'bg-red-500 text-white scale-110'
                                            : 'bg-white/95 backdrop-blur-md text-brand-brown md:opacity-0 md:translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0 hover:bg-brand-brown hover:text-white'
                                            }`}
                                        onClick={handleWishlistToggle}
                                    >
                                        <Heart size={16} weight={isAnyVariantInWishlist ? "fill" : "regular"} className="md:w-[18px] md:h-[18px]" />
                                    </button> */}

                                    <button
                                        className="p-2 md:p-2.5 rounded-full bg-white/95 backdrop-blur-md text-brand-brown md:opacity-0 md:translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0 hover:bg-brand-brown hover:text-white transition-all duration-300 delay-75 shadow-md"
                                        onClick={handleCartClick}
                                    >
                                        <ShoppingCartSimple size={16} weight="bold" className="md:w-[18px] md:h-[18px]" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-3 md:p-6 pt-1 md:pt-2 flex flex-col flex-1 min-w-0 !px-3">
                            <div className="mb-2 md:mb-3">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3
                                        className={`font-headline text-base line-clamp-2 leading-snug transition-colors ${isSoldOut
                                            ? 'text-gray-500'
                                            : 'text-brand-brown group-hover:text-brand-cocoa'
                                            }`}
                                    >
                                        {product?.name?.split('|')[0]}&nbsp;
                                    </h3>

                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                    {variantOptions.length > 1 ? (
                                        <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                            {variantOptions?.length} Weight Options
                                        </span>
                                    ) : (
                                        <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                            {variantOptions?.[0]?.label}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Price Section */}
                            <div className="mt-auto flex items-end justify-between ">
                                <div className="flex flex-col min-w-0">
                                    {variantOptions.length === 1 && variantOptions[0].discountedPrice ? (
                                        <>
                                            <span className={`text-lg md:text-xl tracking-tighter ${isSoldOut ? 'text-gray-400' : 'text-brand-brown'}`}>
                                                Rs. {Math.round(variantOptions[0].effectivePrice).toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-[10px] md:text-[11px] text-slate-400 line-through">
                                                Rs. {Math.round(variantOptions[0].displayOriginalPrice || 0).toLocaleString('en-IN')}
                                            </span>
                                            {/* <span className="text-[10px] text-slate-400 uppercase tracking-[0.15em] mt-1 block">
                                                Incl. GST
                                            </span> */}
                                        </>
                                    ) : (
                                        <>
                                            {/* {variantOptions.length > 1 && (
                                                <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Starting From</span>
                                            )} */}
                                            <span className={`text-base  tracking-tighter truncate ${isSoldOut ? 'text-gray-400' : 'text-brand-brown'}`}>
                                                {priceRange.min === priceRange.max
                                                    ? `Rs. ${Math.round(priceRange.min).toLocaleString('en-IN')}`
                                                    : `Rs. ${Math.round(priceRange.min).toLocaleString('en-IN')}`}
                                            </span>
                                            {/* <span className="text-[10px] text-slate-400 uppercase tracking-[0.15em] mt-1 block">
                                                Incl. GST
                                            </span> */}
                                        </>
                                    )}
                                </div>

                                {/* <div className={`flex items-center gap-1 md:gap-2 transition-colors ${isSoldOut ? 'text-gray-400' : 'text-brand-brown/40 group-hover:text-brand-brown'}`}>
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                        {isSoldOut ? 'Out of Stock' : 'Details'}
                                    </span>
                                    {!isSoldOut && <ArrowRight size={12} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" />}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* Selection Modal */}
            <Modal
                isOpen={showVariantModal}
                onClose={() => setShowVariantModal(false)}
                title={modalMode === "cart" ? "Add to Cart" : "Select Packaging"}
                maxWidth="max-w-sm"
            >
                <div className="flex flex-col py-2">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-[0.2em] mb-1">Authentic Sappey</p>
                        <h4 className="text-xl font-headline text-brand-brown leading-tight">{product.name}</h4>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {variantOptions.map((variant) => {
                            const isWishlisted = isInWishlist(product.id, variant.id);
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => handleAction(variant, modalMode)}
                                    className="w-full group flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-brand-brown/20 hover:bg-white transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div>
                                            <p className="text-[11px] font-bold text-brand-brown uppercase tracking-widest">{variant.label}</p>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Vacuum Sealed Pack</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-brand-brown">₹{Math.round(variant.effectivePrice).toLocaleString('en-IN')}</span>
                                            {variant.discountedPrice && (
                                                <span className="text-[10px] text-slate-400 line-through">₹{Math.round(variant.displayOriginalPrice || 0).toLocaleString('en-IN')}</span>
                                            )}
                                        </div>
                                        {modalMode === "wishlist" && isWishlisted && <Heart size={14} weight="fill" className="text-red-500" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default memo(ProductCard);