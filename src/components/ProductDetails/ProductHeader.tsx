import React from "react";
import { Star } from "@phosphor-icons/react";
import { ProductHeaderProps } from "../../types/ProductDetails";
import { getDisplayPrice, getOriginalDisplayPrice } from "../../utils/priceUtils";

const ProductHeader: React.FC<ProductHeaderProps> = ({
    rating,
    reviewCount,
    name,
    selectedVariantData,
    product,
}) => {
    const currentPrice = getDisplayPrice({ product, variant: selectedVariantData });
    const originalPrice = getOriginalDisplayPrice({ product, variant: selectedVariantData });

    return (
        <header>
            <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} weight={i < Math.floor(rating || 0) ? "fill" : "regular"} />
                    ))}
                </div>
                <span className="text-xs font-bold text-slate-400">
                    ({reviewCount || 0} VERIFIED REVIEWS)
                </span>
            </div>
            <h1 className="text-3xl font-headline text-brand-brown leading-tight mb-4">
                {name}
            </h1>
            <div className="flex items-baseline gap-4">
                {selectedVariantData?.discountedPrice ? (
                    <>
                        <span className="text-3xl font-medium text-brand-brown">
                            ₹{Math.round(currentPrice).toLocaleString('en-IN')}
                        </span>
                        <span className="text-lg text-slate-300 line-through">
                            ₹{Math.round(originalPrice).toLocaleString('en-IN')}
                        </span>
                        {selectedVariantData.discountedPercent && (
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                {selectedVariantData.discountedPercent}% OFF
                            </span>
                        )}
                        <span className="text-xs text-slate-400 uppercase tracking-[0.18em] ml-2">
                            Incl. GST
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-3xl font-medium text-brand-brown">
                            ₹{Math.round(currentPrice).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-[0.18em] ml-2">
                            Incl. GST
                        </span>
                    </>
                )}
            </div>
        </header>
    );
};

export default ProductHeader;