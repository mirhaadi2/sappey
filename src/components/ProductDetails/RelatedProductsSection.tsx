import React from "react";
import { ProductCard } from "../Shop";
import { LazySection } from "../common";
import { ReviewSkeleton } from "../../components/Skeletons";
import { ComingSoonPlaceholder } from "./index";
import { RelatedProductsSectionProps } from "../../types/ProductDetails";

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
    products,
    currentProductCategory,
    currentProductId,
}) => {

    const relatedProducts = products
        ?.filter(
            (p: any) =>
                p.category === currentProductCategory &&
                p.id !== currentProductId
        )
        .slice(0, 4);

    if (!relatedProducts || relatedProducts.length === 0) return null;

    return (
        <section className="relative mt-24 overflow-hidden">

            {/* Luxury Background Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#B08A37]/10 blur-[100px] rounded-full" />

            <LazySection fallback={<ReviewSkeleton />}>

                {/* HEADER */}
                <div className="relative max-w-7xl mx-auto mb-8 px-4">

                    {/* Label */}
                    <div className="flex items-center gap-3 mb-5">

                        <div className="w-10 h-[1px] bg-[#B08A37]" />

                        <span className="uppercase tracking-[0.35em] text-[#B08A37] text-[10px] font-semibold">
                            Curated Recommendations
                        </span>
                    </div>

                    {/* Heading */}
                    <h2
                        className="font-serif text-[clamp(1.75rem,4vw,3rem)] leading-none text-[#1A1815] max-w-3xl"
                        style={{
                            fontWeight: 500,
                            letterSpacing: "-0.04em",
                        }}
                    >
                        Discover More{" "}

                        <span className="italic text-[#B08A37]">
                            Premium Selections
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-3 text-[#6B665E] text-[15px] leading-[1.9] max-w-xl">
                        Handpicked products chosen for freshness,
                        purity, and exceptional quality.
                    </p>

                </div>

                {/* PRODUCTS GRID */}
                <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">

                    {relatedProducts.map((product: any) => (
                        <div
                            key={product?.id}
                            className="group transition-transform duration-500 hover:-translate-y-1"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}

                </div>

            </LazySection>
        </section>
    );
};

export default RelatedProductsSection;