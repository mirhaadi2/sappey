import React, { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ShoppingCartSimple } from "@phosphor-icons/react";
import { Product, ProductVariant } from "../../types";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CardContext";
import Modal from "../common/Modal";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { dispatch } = useCart();

    const [showVariantModal, setShowVariantModal] = useState(false);
    const [modalMode, setModalMode] = useState<"wishlist" | "cart">("wishlist");

    const variantOptions = useMemo(() => {
        if (!Array.isArray(product?.variants) || product?.variants?.length === 0) return [];

        return product.variants.map((variant: any) => {
            const basePrice = Number(variant?.price ?? 0);
            const discountedPrice = variant?.discountedPrice ? Number(variant.discountedPrice) : null;
            
            return {
                id: variant?.id ?? variant?.sku,
                label: `${Math.floor(Number(variant?.weight ?? 0))} ${variant?.weightUnit ?? 'g'}`,
                weight: Number(variant?.weight ?? 0),
                price: basePrice,
                discountedPrice: discountedPrice,
                effectivePrice: discountedPrice !== null ? discountedPrice : basePrice,
                sku: variant?.sku,
                fullVariant: variant as ProductVariant,
            };
        }).sort((a, b) => a.weight - b.weight);
    }, [product]);

    const priceRange = useMemo(() => {
        if (variantOptions.length === 0) {
            const basePrice = Number(product?.minPrice ?? product?.price ?? 0);
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

    return (
        <>
            {isSoldOut ? (
                <div className="block h-full cursor-not-allowed">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="group relative flex flex-col h-full bg-white rounded-[32px] border border-brand-brown/10 overflow-hidden shadow-sm opacity-60"
                    >
                        <div className="relative aspect-square m-2 overflow-hidden rounded-[26px] bg-[#FAF9F6]">
                            <img
                                src={product?.images?.[0] ?? "https://via.placeholder.com/400"}
                                alt={product?.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg uppercase tracking-wider">Sold Out</span>
                            </div>
                            
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {(product?.isNew || product?.isBestseller) && (
                                    <span className={`${product?.isNew ? "bg-brand-plum" : "bg-brand-brown"} text-white text-[8px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-lg shadow-sm`}>
                                        {product?.isNew ? "New Arrival" : "Bestseller"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6 pt-2 flex flex-col flex-1">
                            <div className="mb-4">
                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <h3 className="font-headline text-gray-500 text-xl line-clamp-1">
                                        {product?.name}
                                    </h3>
                                    {variantOptions.length === 1 && (
                                        <span className="text-[12px] font-bold text-brand-brown/40 whitespace-nowrap">
                                            {variantOptions[0].label}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {variantOptions.length > 1 ? `${variantOptions.length} Pack Sizes` : "Single Pack"}
                                    </span>
                                    <div className="h-1 w-1 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Premium Selection</span>
                                </div>
                            </div>

                            <div className="mt-auto flex items-end justify-between border-t border-brand-brown/5 pt-5">
                                <div className="flex flex-col">
                                    {variantOptions.length === 1 && variantOptions[0].discountedPrice ? (
                                        <>
                                            <span className="text-xl font-bold text-gray-500 tracking-tighter">
                                                ₹{variantOptions[0].discountedPrice.toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-[11px] text-slate-400 line-through">
                                                ₹{variantOptions[0].price.toLocaleString('en-IN')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {variantOptions.length > 1 && (
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Price starting</span>
                                            )}
                                            <span className="text-xl font-bold text-gray-500 tracking-tighter">
                                                {priceRange.min === priceRange.max
                                                    ? `₹${priceRange.min.toLocaleString('en-IN')}`
                                                    : `₹${priceRange.min.toLocaleString('en-IN')} - ₹${priceRange.max.toLocaleString('en-IN')}`}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Sold Out</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <Link
                    to={`/products/${product.id}`}
                    className="block h-full"
                    onClick={(e) => showVariantModal && e.preventDefault()}
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="group relative flex flex-col h-full bg-white rounded-[32px] border border-brand-brown/10 overflow-hidden transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(62,44,28,0.12)]"
                    >
                        <div className="relative aspect-square m-2 overflow-hidden rounded-[26px] bg-[#FAF9F6]">
                            <img
                                src={product?.images?.[0] ?? "https://via.placeholder.com/400"}
                                alt={product?.name}
                                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {(product?.isNew || product?.isBestseller) && (
                                    <span className={`${product?.isNew ? "bg-brand-plum" : "bg-brand-brown"} text-white text-[8px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-lg shadow-sm`}>
                                        {product?.isNew ? "New Arrival" : "Bestseller"}
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                <button
                                    className={`p-2.5 rounded-full transition-all duration-300 transform shadow-md ${
                                        isAnyVariantInWishlist
                                        ? 'bg-red-500 text-white scale-110'
                                        : 'bg-white/95 backdrop-blur-md text-brand-brown opacity-0 translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0 hover:bg-brand-brown hover:text-white'
                                    }`}
                                    onClick={handleWishlistToggle}
                                >
                                    <Heart size={18} weight={isAnyVariantInWishlist ? "fill" : "regular"} />
                                </button>

                                <button
                                    className="p-2.5 rounded-full bg-white/95 backdrop-blur-md text-brand-brown opacity-0 translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0 hover:bg-brand-brown hover:text-white transition-all duration-300 delay-75 shadow-md"
                                    onClick={handleCartClick}
                                >
                                    <ShoppingCartSimple size={18} weight="bold" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 pt-2 flex flex-col flex-1">
                            <div className="mb-4">
                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <h3 className="font-headline text-brand-brown text-xl line-clamp-1 group-hover:text-brand-cocoa transition-colors">
                                        {product?.name}
                                    </h3>
                                    {variantOptions.length === 1 && (
                                        <span className="text-[12px] font-bold text-brand-brown/40 whitespace-nowrap">
                                            {variantOptions[0].label}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {variantOptions.length > 1 ? `${variantOptions.length} Pack Sizes` : "Single Pack"}
                                    </span>
                                    <div className="h-1 w-1 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Premium Selection</span>
                                </div>
                            </div>

                            <div className="mt-auto flex items-end justify-between border-t border-brand-brown/5 pt-5">
                                <div className="flex flex-col">
                                    {variantOptions.length === 1 && variantOptions[0].discountedPrice ? (
                                        <>
                                            <span className="text-xl font-bold text-brand-brown tracking-tighter">
                                                ₹{variantOptions[0].discountedPrice.toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-[11px] text-slate-400 line-through">
                                                ₹{variantOptions[0].price.toLocaleString('en-IN')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {variantOptions.length > 1 && (
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Price starting</span>
                                            )}
                                            <span className="text-xl font-bold text-brand-brown tracking-tighter">
                                                {priceRange.min === priceRange.max
                                                    ? `₹${priceRange.min.toLocaleString('en-IN')}`
                                                    : `₹${priceRange.min.toLocaleString('en-IN')} - ₹${priceRange.max.toLocaleString('en-IN')}`}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-brand-brown/40 group-hover:text-brand-brown transition-colors">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Details</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            )}

            <Modal
                isOpen={showVariantModal}
                onClose={() => setShowVariantModal(false)}
                title={modalMode === "cart" ? "Add to Cart" : "Select Packaging"}
                maxWidth="max-w-sm"
            >
                <div className="flex flex-col py-2">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-[0.2em] mb-1">Authentic Sappey</p>
                        <h4 className="text-xl font-headline text-brand-brown leading-none">{product.name}</h4>
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
                                    <div className="flex items-center gap-4">
                                        <div className="text-left">
                                            <p className="text-[11px] font-bold text-brand-brown uppercase tracking-widest">{variant.label}</p>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Vacuum Sealed Pack</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-brand-brown">₹{variant.effectivePrice.toLocaleString('en-IN')}</span>
                                            {variant.discountedPrice && (
                                                <span className="text-[10px] text-slate-400 line-through">₹{variant.price.toLocaleString('en-IN')}</span>
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