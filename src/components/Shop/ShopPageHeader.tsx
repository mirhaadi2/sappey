import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Trophy, Sparkle } from '@phosphor-icons/react';

interface ShopPageHeaderProps {
    onScroll?: () => void;
}

const ShopPageHeader: React.FC<ShopPageHeaderProps> = ({ onScroll }) => {
    return (
        <div className="relative min-h-[500px] flex items-center bg-brand-brown overflow-hidden">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-latte/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <div className="h-px w-8 bg-orange-500" />
                            <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                                Direct from Source
                            </span>
                        </motion.div>

                        <h1 className="font-headline text-6xl md:text-7xl text-white mb-8 leading-[1.1] tracking-tight">
                            The <span className="italic font-light text-brand-cream">Elite</span> <br />
                            Selection
                        </h1>

                        <p className="font-sans text-lg md:text-xl text-brand-cream/70 max-w-xl leading-relaxed mb-10 border-l-2 border-brand-latte/30 pl-6">
                            Nature's best, curated by <span className="text-white font-semibold">Sappey</span>. From sun-drenched orchards to fertile groves, we bring you the
                            <span className="text-white font-medium"> ultimate dry fruit experience</span>—pure, nutrient-rich, and vacuum-packed at the peak of freshness for a superior taste in every bite.
                        </p>

                        {/* Quick Stats Badges */}
                        <div className="flex flex-wrap gap-4">
                            {[
                                { icon: <Leaf size={16} />, text: "100% Organic" },
                                { icon: <Trophy size={16} />, text: "Premium Grade" },
                                { icon: <Sparkle size={16} />, text: "No Additives" }
                            ].map((badge, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-brand-cream tracking-wide uppercase"
                                >
                                    <span className="text-orange-500">{badge.icon}</span>
                                    {badge.text}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content - Decorative Abstract */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        className="hidden lg:flex justify-end relative"
                    >
                        <div className="relative group">
                            {/* Glass Card Effect */}
                            <div className="w-80 h-96 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/20 rounded-2xl rotate-3 flex flex-col justify-center items-center p-8 shadow-2xl transition-transform group-hover:rotate-0 duration-700">
                                <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                                    <Sparkle size={40} className="text-orange-500 animate-pulse" />
                                </div>
                                <h3 className="font-headline text-2xl text-white text-center">Quality Assured</h3>
                                <p className="text-center text-brand-cream/60 text-sm mt-4 italic">
                                    "Every nut is manually inspected for size, color, and texture."
                                </p>
                                <div className="mt-8 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    ))}
                                </div>
                            </div>

                            {/* Offset Decorative Border */}
                            <div className="absolute inset-0 border-2 border-brand-latte/20 rounded-2xl -rotate-6 -z-10 transition-transform group-hover:-rotate-3 duration-700" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Elegant Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-cream">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-orange-500 to-transparent" />
            </motion.div>
        </div>
    );
};

export default ShopPageHeader;
