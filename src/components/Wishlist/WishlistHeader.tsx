import React from "react";
import { ArrowLeft, Heart } from "@phosphor-icons/react";
import { WishlistHeaderProps } from "../../types/WishlistPage";

const WishlistHeader: React.FC<WishlistHeaderProps> = ({ wishlistCount, onBack }) => {
    return (
        <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-[clamp(o.8rem,2vw,1.2rem)] h-16 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-[clamp(0.625rem,1.2vw,0.75rem)] font-bold tracking-widest text-slate-500 hover:text-brand-brown transition-all"
                >
                    <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> BACK
                </button>
                <div className="hidden md:block text-[clamp(0.625rem,1.2vw,0.75rem)] font-black tracking-[0.2em] text-brand-brown uppercase">
                    Secure Wishlist
                </div>
                <div className="flex items-center gap-2">
                    <Heart size={18} weight="fill" className="text-brand-brown" />
                    <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-bold text-slate-800">{wishlistCount}</span>
                </div>
            </div>
        </div>
    );
};

export default WishlistHeader;