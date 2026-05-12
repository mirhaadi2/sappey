import React from "react";
import { motion } from "framer-motion";
import { formatSectionTitle, fadeUpVariants } from "../../utils/homePageUtils";
import { StorySectionProps } from "../../types/HomePage";
import { Sparkle } from "@phosphor-icons/react";

const StorySection: React.FC<StorySectionProps> = ({ storySection }) => {
    if (!storySection) return null;

    return (
        <section
            id="story"
            className="relative overflow-hidden bg-[#F8F4EE] py-16 lg:py-16 px-6 lg:px-16"
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-[#B08A37]/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#D8C29D]/20 blur-[100px] rounded-full" />

            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.025] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

            <div className="relative max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

                    {/* LEFT */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="w-full lg:w-[46%]"
                    >
                        {/* Label */}
                        <div className="inline-flex items-center gap-3 mb-5">
                            <div className="w-8 h-[1px] bg-[#B08A37]" />

                            <span className="uppercase tracking-[0.35em] text-[#B08A37] text-[10px] font-semibold">
                                Our {formatSectionTitle(storySection?.sectionType) || "Legacy"}
                            </span>
                        </div>

                        {/* Heading */}
                        <h2
                            className="font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-[#1A1815] mb-5"
                            style={{
                                fontWeight: 500,
                                letterSpacing: "-0.04em",
                            }}
                        >
                            From Nature’s
                            <span className="block text-[#B08A37] italic">
                                Finest Sources
                            </span>
                        </h2>

                        {/* Card */}
                        <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

                            {/* Floating Icon */}
                            <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-[#B08A37] flex items-center justify-center text-white shadow-md">
                                <Sparkle size={15} weight="fill" />
                            </div>

                            <p className="text-[#5E5A55] text-[15px] leading-[1.8] font-light">
                                {storySection?.subtitle ||
                                    "Premium dry fruits sourced directly from trusted farmers with freshness, purity, and honest quality in every pack."}
                            </p>

                            {/* Compact Stats */}
                            <div className="flex items-center gap-8 mt-6 pt-5 border-t border-[#B08A37]/10">

                                <div>
                                    <h4 className="font-serif text-2xl text-[#B08A37]">
                                        100%
                                    </h4>

                                    <p className="uppercase tracking-[0.2em] text-[9px] text-[#1D1B18]/50 font-bold mt-1">
                                        Natural & Pure
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-serif text-2xl text-[#B08A37]">
                                        2026
                                    </h4>

                                    <p className="uppercase tracking-[0.2em] text-[9px] text-[#1D1B18]/50 font-bold mt-1">
                                        Est. Year
                                    </p>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="w-full lg:w-[54%]"
                    >
                        <div className="relative group">

                            {/* Glow */}
                            <div className="absolute -inset-3 bg-[#B08A37]/10 blur-2xl rounded-[2rem]" />

                            {/* Video */}
                            <div className="relative rounded-[24px] overflow-hidden border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.12)] aspect-[16/10] max-h-[480px]">

                                <motion.video
                                    src={
                                        storySection?.videoUrl ||
                                        "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1.mp4"
                                    }
                                    poster={
                                        (storySection as any)?.videoPosterUrl ||
                                        "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1-poster.png"
                                    }
                                    className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-all duration-[3500ms]"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1815]/50 via-transparent to-transparent" />

                                {/* Badge */}
                                <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full">
                                    <span className="text-[9px] uppercase tracking-[0.22em] text-white font-medium">
                                        Premium Selection
                                    </span>
                                </div>

                                {/* Bottom Text */}
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-white/90 font-serif text-xl">
                                        Freshness in every bite
                                    </p>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default StorySection;