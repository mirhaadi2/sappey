import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariants } from "../../utils/homePageUtils";
import { formatSectionTitle } from "../../utils/homePageUtils";
import type { Section } from "../../api/homepage";

interface SectionBannerProps {
    section: Section;
    label?: string;
    fallbackTitle?: string;
    fallbackSubtitle?: string;
    fallbackDescription?: string;
    fallbackButtonText?: string;
    fallbackButtonLink?: string;
    onNavigate?: (path: string) => void;
    className?: string;
}

const SectionBanner: React.FC<SectionBannerProps> = ({
    section,
    label,
    fallbackTitle,
    fallbackSubtitle,
    fallbackDescription,
    fallbackButtonText,
    fallbackButtonLink,
    onNavigate,
    className = "",
}) => {
    const title = section.title || fallbackTitle;
    const description = section.subtitle || section.content || fallbackDescription;
    const buttonText = section.buttonText || fallbackButtonText;
    const buttonLink = section.buttonLink || fallbackButtonLink;
    const sectionLabel = label || formatSectionTitle(section.sectionType);
    const imageUrl =
        section.backgroundImageUrl ||
        "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png";

    return (
        <section
            className={`relative overflow-hidden ${className}`}
            aria-label={`${sectionLabel || section.sectionType} banner`}
        >
            <div className="relative h-80 md:h-96">
                <img
                    src={imageUrl}
                    alt={section.title || section.sectionType}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-brown via-brand-brown to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16">
                    <div className="max-w-lg">
                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {sectionLabel && (
                                <span className="font-label text-xs uppercase tracking-widest text-brand-cream opacity-80 block mb-3">
                                    {sectionLabel}
                                </span>
                            )}

                            {title && (
                                <h2
                                    className="font-headline text-4xl text-brand-cream mb-4"
                                    style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                >
                                    {title}
                                </h2>
                            )}

                            {description && (
                                <p className="font-sans text-brand-cream opacity-90 mb-6 leading-relaxed">
                                    {description}
                                </p>
                            )}

                            {buttonLink && buttonText && (
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.(buttonLink)}
                                    className="bg-brand-cream text-brand-brown font-label text-sm px-6 py-3 rounded-lg hover:bg-brand-latte transition-colors duration-200 cursor-pointer uppercase tracking-widest"
                                >
                                    {buttonText}
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionBanner;
