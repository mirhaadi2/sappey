import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "@phosphor-icons/react";
import { WishlistSummarySidebarProps } from "../../types/WishlistPage";

const fadeInVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WishlistSummarySidebar: React.FC<WishlistSummarySidebarProps> = ({
    wishlistCount,
    totalValue,
    onMoveAllToCart,
    onContinueBrowsing,
    onClearAll,
}) => {
    return (
        <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="sticky top-32"
        >
            <div className="relative bg-white rounded-[24px] border border-brand-brown/10 p-[clamp(1.5rem,3vw,2rem)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col">
                <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-brand-brown/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                <h3 className="text-[clamp(0.625rem,1.2vw,0.75rem)] font-black uppercase tracking-[0.2em] text-slate-400 mb-[clamp(1rem,2vw,1.5rem)]">Order Summary</h3>

                <div className="space-y-[clamp(1rem,1.8vw,1.25rem)] mb-[clamp(1rem,2vw,1.5rem)]">
                    <div className="flex justify-between items-center">
                        <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-slate-500">Selections</span>
                        <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-bold text-slate-900">{wishlistCount}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium text-slate-500">Estimated Total</span>
                        <div className="text-right">
                            <span className="block text-[clamp(1.25rem,3vw,1.75rem)] font-black text-brand-brown">₹{Math.round(totalValue).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-[clamp(0.75rem,1.5vw,1rem)]">
                    <button
                        onClick={onMoveAllToCart}
                        className="w-full bg-brand-brown text-white py-[clamp(0.75rem,1.5vw,1rem)] rounded-2xl hover:shadow-xl hover:shadow-brand-brown/20 transition-all font-bold text-[clamp(0.625rem,1.2vw,0.75rem)] uppercase tracking-widest flex items-center justify-center gap-2 min-h-11"
                    >
                        <ShoppingCart size={16} weight="bold" /> Move All to Cart
                    </button>
                    <button
                        onClick={onContinueBrowsing}
                        className="w-full bg-white border border-slate-200 text-slate-600 py-[clamp(0.75rem,1.5vw,1rem)] rounded-2xl hover:bg-slate-50 transition-all font-bold text-[clamp(0.625rem,1.2vw,0.75rem)] uppercase tracking-widest min-h-11"
                    >
                        Continue Browsing
                    </button>
                    <button
                        onClick={onClearAll}
                        className="w-full text-red-400 py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.625rem,1.2vw,0.75rem)] font-black uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                        Clear Entire Wishlist
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default WishlistSummarySidebar;