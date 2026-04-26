import React from "react";
import SectionBanner from "./SectionBanner";
import { DynamicSectionProps } from "../../types/HomePage";

const DynamicSection: React.FC<DynamicSectionProps> = ({
    section,
    navigate,
}) => {
    if (!section) return null;

    return (
        <SectionBanner
            section={section}
            onNavigate={(link) => navigate(link)}
        />
    );
};

export default DynamicSection;
