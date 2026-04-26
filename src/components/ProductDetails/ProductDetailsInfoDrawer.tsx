import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "@phosphor-icons/react";
import ComingSoonPlaceholder from "./ComingSoonPlaceholder";
import { DrawerType } from "../../types/ProductDetails";

interface ProductDetailsInfoDrawerProps {
    product: any;
    activeDrawer: DrawerType;
    onClose: () => void;
}

const ProductDetailsInfoDrawer: React.FC<ProductDetailsInfoDrawerProps> = ({
    product,
    activeDrawer,
    onClose
}) => (
    <AnimatePresence>
        {activeDrawer && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-brand-brown/20 backdrop-blur-sm z-[60]"
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl overflow-y-auto"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-headline text-brand-brown capitalize tracking-tight">
                                {activeDrawer === "nutrition" ? "Nutritional Profile" : activeDrawer}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-brand-brown">
                                <X size={24} weight="bold" />
                            </button>
                        </div>

                        <div className="prose prose-slate prose-sm max-w-none">
                            {(activeDrawer === "description" && product?.description) && (
                                <div className="text-slate-600 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: product.description }} />
                            )}

                            {activeDrawer === "benefits" && (
                                product.benefits && product.benefits.length > 0 ? (
                                    <ul className="space-y-4 list-none p-0">
                                        {product.benefits.map((b: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4 text-slate-600">
                                                <Check className="mt-1 text-emerald-500" weight="bold" size={14} />
                                                <span className="text-sm">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <ComingSoonPlaceholder label="Key Benefits" />
                            )}

                            {activeDrawer === "nutrition" && (
                                product.nutritionFacts && product.nutritionFacts.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {product.nutritionFacts.map((fact: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{fact.label}</p>
                                                <p className="text-xl font-headline font-bold text-brand-brown">{fact.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : <ComingSoonPlaceholder label="Nutritional Profile" />
                            )}
                        </div>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

export default ProductDetailsInfoDrawer;