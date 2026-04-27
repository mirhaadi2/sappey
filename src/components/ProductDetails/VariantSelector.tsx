import React from "react";
import { motion, LayoutGroup } from "framer-motion";
import { VariantSelectorProps } from "../../types/ProductDetails";

const VariantSelector: React.FC<VariantSelectorProps> = ({
    allVariants,
    selectedVariantId,
    onVariantSelect
}) => (
    <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Choose Size</label>
        <div className="flex flex-wrap gap-3">
            <LayoutGroup>
                {allVariants.map((variant) => {
                    const isAvailable = variant.isAvailable !== false;
                    const isSelected = selectedVariantId === String(variant.id);
                    return (
                        <button
                            key={variant.id}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && onVariantSelect(String(variant.id))}
                            className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-colors border ${!isAvailable
                                    ? "text-red-400 border-red-200 bg-red-50 cursor-not-allowed"
                                    : isSelected
                                        ? "text-white border-transparent"
                                        : "text-brand-brown border-slate-200 hover:border-brand-brown"
                                }`}
                        >
                            <span className="relative z-10">
                                {variant.label || `${variant.weight}${variant.weightUnit}`}
                                {!isAvailable && " (Sold Out)"}
                            </span>
                            {isSelected && isAvailable && (
                                <motion.div layoutId="activeVariant" className="absolute inset-0 bg-brand-brown rounded-xl z-0" transition={{ type: "spring", duration: 0.5 }} />
                            )}
                        </button>
                    );
                })}
            </LayoutGroup>
        </div>
    </div>
);

export default VariantSelector;