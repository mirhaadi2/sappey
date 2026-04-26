import React from "react";
import SectionBanner from "./SectionBanner";
import { formatSectionTitle } from "../../utils/homePageUtils";
import { HealthWellnessBannerProps } from "../../types/HomePage";

const HealthWellnessSection: React.FC<HealthWellnessBannerProps> = ({
    section,
    navigate,
}) => {
    if (!section) return null;

    return (
        <SectionBanner
            section={section}
            label={formatSectionTitle(section.sectionType) || "Health & Wellness"}
            fallbackTitle="Nourish Your Body with Almonds"
            fallbackSubtitle="Packed with nutrients, our almonds are the perfect snack for a healthy lifestyle."
            fallbackButtonText="Shop Almonds"
            fallbackButtonLink="/shop"
            onNavigate={(link) => navigate(link)}
        />
    );
};

export default HealthWellnessSection;
