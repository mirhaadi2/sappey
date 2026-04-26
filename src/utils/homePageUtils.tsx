/**
 * Converts snake_case strings to Title Case.
 * Example: "health_wellness" -> "Health & Wellness"
 * Example: "new_arrivals" -> "New Arrivals"
 */
export const formatSectionTitle = (slug: string | undefined): string => {
    if (!slug) return "";

    return slug
        .split("_")
        .map((word) => {
            const capitalized =
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

            if (capitalized === "Wellness") return "& Wellness";
            return capitalized;
        })
        .join(" ")
        .replace(/\s&\s/g, " & ")
        .trim();
};

/**
 * Breaks long hero titles into multiple lines
 * Example: "Shop Premium Dry Fruits & Nuts" -> ["Shop Premium", "Dry Fruits & Nuts"]
 */
export const formatHeroTitle = (title: string | undefined): React.ReactNode => {
    if (!title) return null;

    const words = title.split(" ");

    // If title is short (less than 3 words), just return it
    if (words.length <= 2) return title;

    const firstLine = words.slice(0, 2).join(" ");
    const secondLine = words.slice(2).join(" ");

    return (
        <>
            <span className="block">{firstLine}</span>
            <span className="block">{secondLine}</span>
        </>
    );
};

// Framer Motion animation variants
export const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};
