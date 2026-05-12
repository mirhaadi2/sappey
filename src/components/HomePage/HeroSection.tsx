import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Package, Truck, ShieldCheck } from "@phosphor-icons/react";
import { formatHeroTitle } from "../../utils/homePageUtils";
import { HeroSectionProps } from "../../types/HomePage";

const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
    const heroRef = React.useRef<HTMLDivElement>(null);
    const [imgError, setImgError] = useState(false);
    
    // Define your local fallback path
    const fallbackImage = "/images/new_hero_image.webp"; 

    // Determine the primary source
    const primaryImage = hero?.backgroundImageUrl || hero?.imageUrl;

    return (
        <>
            <section
                ref={heroRef}
                className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black"
                aria-label="Hero section"
            >
                <div className="absolute inset-0">
                    {/* 1. Try Video First */}
                    {hero?.videoUrl ? (
                        <motion.video
                            src={hero.videoUrl}
                            poster={hero.videoPosterUrl || "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1-poster.png"}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    ) : (
                        /* 2. Try Image or Fallback if Image fails/is missing */
                        <motion.img
                            // If primaryImage is null OR imgError is true, use fallback
                            src={(!primaryImage || imgError) ? fallbackImage : primaryImage}
                            alt={hero?.title || "Premium Dry Fruits Hero"}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            // This catches "Not Found" or "Invalid Link" errors
                            onError={() => setImgError(true)}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90" />
                </div>

                <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1
                            className="font-serif text-[clamp(2rem,6vw,3rem)] text-brand-cream mb-[clamp(1rem,2vw,1.5rem)] max-w-2xl mx-auto"
                            style={{ letterSpacing: "-0.025em", lineHeight: 1.2 }}
                        >
                            {formatHeroTitle(hero?.title) || "Shop Premium Dry Fruits & Nuts."}
                        </h1>
                        <p className="font-sans text-[clamp(0.875rem,2vw,1.125rem)] text-brand-cream opacity-90 mb-[clamp(1.5rem,3vw,2rem)] max-w-2xl mx-auto leading-relaxed">
                            {hero?.subtitle || "Carefully sourced, perfectly packed, and delivered fresh to your doorstep."}
                        </p>

                        <button
                            onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}
                            className="bg-transparent text-white border border-white/80 font-label text-[clamp(0.65rem,1.5vw,0.75rem)] px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,1.5vw,1rem)] rounded-lg transition-all duration-300 ease-out cursor-pointer uppercase tracking-widest inline-flex items-center gap-3 min-h-11 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(255,255,255,0.18)] hover:border-white active:scale-[0.98]"
                        >
                            {hero?.buttonText || "Explore Collections"}
                            <ArrowRight size={16} weight="regular" className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                </div>

                {/* Hero Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-6 left-0 right-0 z-10"
                >
                    <div className="flex flex-wrap items-center justify-center gap-[clamp(1rem,2vw,2rem)] px-[clamp(1rem,3vw,2rem)]">
                        {[
                            { icon: <Leaf size={18} weight="fill" />, label: "100% Natural" },
                            { icon: <Package size={18} weight="fill" />, label: "Fresh Packed" },
                            { icon: <Truck size={18} weight="fill" />, label: "Fast Delivery" },
                            { icon: <ShieldCheck size={18} weight="fill" />, label: "Quality Assured" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 text-brand-cream opacity-80">
                                <span className="text-brand-cream">{item.icon}</span>
                                <span className="font-label text-[clamp(0.625rem,1.5vw,0.75rem)] uppercase tracking-wider text-brand-cream">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default HeroSection;