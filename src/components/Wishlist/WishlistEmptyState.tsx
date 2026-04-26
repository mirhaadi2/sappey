import React from "react";
import { motion } from "framer-motion";
import { Heart } from "@phosphor-icons/react";
import { WishlistEmptyStateProps } from "../../types/WishlistPage";

const fadeInVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WishlistEmptyState: React.FC<WishlistEmptyStateProps> = ({ onExplore }) => {
    return (
        <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-[clamp(3rem,8vw,6rem)] bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
            <Heart size={48} className="mx-auto mb-[clamp(1rem,2vw,1.5rem)] text-slate-200" weight="thin" />
            <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-slate-900 mb-2">Nothing saved yet</h2>
            <p className="text-slate-400 mb-[clamp(1rem,2vw,1.5rem)] max-w-xs mx-auto text-[clamp(0.75rem,1.5vw,0.875rem)] leading-relaxed">
                Discover our exclusive range of dry fruits and artisan nuts to fill your collection.
            </p>
            <button
                onClick={onExplore}
                className="inline-flex items-center gap-3 bg-brand-brown text-white px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)] rounded-full hover:shadow-xl hover:shadow-brand-brown/20 transition-all font-bold text-[clamp(0.65rem,1.2vw,0.75rem)] uppercase tracking-widest min-h-11"
            >
                Start Exploring
            </button>
        </motion.div>
    );
};

export default WishlistEmptyState;