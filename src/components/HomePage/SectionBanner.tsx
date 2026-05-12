import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeUpVariants } from "../../utils/homePageUtils";
import { formatSectionTitle } from "../../utils/homePageUtils";
import { SectionBannerProps } from "../../types/HomePage";

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
    // State to track if the image fails to load
    const [imageError, setImageError] = useState(false);

    const title = section.title || fallbackTitle;
    const description = section.subtitle || section.content || fallbackDescription;
    const buttonText = section.buttonText || fallbackButtonText;
    const buttonLink = section.buttonLink || fallbackButtonLink;
    const sectionLabel = label || formatSectionTitle(section.sectionType);
    
    // Local fallback path
    const localFallback = "/images/stay_strong_section_bg_image.webp";

    // If section has no URL or the image failed to load, use the fallback
    const imageUrl = (!section.backgroundImageUrl || imageError) 
        ? localFallback 
        : section.backgroundImageUrl;

    return (
        <section
            className={`relative overflow-hidden ${className}`}
            aria-label={`${sectionLabel || section.sectionType} banner`}
        >
            <div className="relative h-80 md:h-96 bg-brand-brown"> {/* Added bg color as a secondary fallback */}
                <img
                    src={imageUrl}
                    alt={section.title || section.sectionType}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    // If the URL is broken, trigger the local fallback
                    onError={() => setImageError(true)}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-brown via-brand-brown/80 to-transparent opacity-90" />
                
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
                                    className="font-serif text-3xl md:text-4xl text-brand-cream mb-4"
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
                                    className="bg-brand-cream text-brand-brown font-label text-sm px-6 py-3 rounded-lg hover:bg-brand-latte transition-all duration-200 cursor-pointer uppercase tracking-widest shadow-md hover:-translate-y-0.5 active:translate-y-0"
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