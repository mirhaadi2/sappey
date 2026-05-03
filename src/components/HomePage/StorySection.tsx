import React from "react";
import { motion } from "framer-motion";
import { formatSectionTitle } from "../../utils/homePageUtils";
import { fadeUpVariants } from "../../utils/homePageUtils";
import { StorySectionProps } from "../../types/HomePage";

const StorySection: React.FC<StorySectionProps> = ({ storySection }) => {
    if (!storySection) return null;

    return (
        <section id="story" className="py-16 px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="font-sans text-xs uppercase tracking-widest text-brand-brown/80 block mb-2">
                        Our {formatSectionTitle(storySection?.sectionType) || "Story"}
                    </span>
                    <h2
                        className="font-headline text-[clamp(1.75rem,4vw,2.2rem)] text-brand-brown mb-4"
                        style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                    >
                        {storySection?.title || "From Our Farms to Your Table"}
                    </h2>

                    <p className="font-sans text-brand-brown/80 max-w-xl mx-auto">
                        {storySection?.subtitle ||
                            "Founded in 2026, our mission has been to provide the highest quality dry fruits and nuts while supporting sustainable farming practices. We work directly with farmers to ensure fair wages and ethical sourcing, so you can feel good about every bite."}
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative rounded-2xl overflow-hidden max-w-4xl mx-auto"
                    style={{ aspectRatio: "16/9" }}
                >
                    <motion.video
                        alt="dry fruit brand introduction video"
                        src={
                            storySection?.videoUrl ||
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1.mp4"
                        }
                        poster={
                            (storySection as any)?.videoPosterUrl ||
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1-poster.png"
                        }
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40" />
                </motion.div>
            </div>
        </section>
    );
};

export default StorySection;