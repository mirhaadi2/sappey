import React from "react";
import ProductCard from "../../components/ProductCard";
import LazySection from "../../components/LazySection";
import { ReviewSkeleton } from "../../components/Skeletons";
import ComingSoonPlaceholder from "./ComingSoonPlaceholder";

interface RelatedProductsSectionProps {
    products: any[] | undefined;
    currentProductCategory: string;
    currentProductId: string;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
    products,
    currentProductCategory,
    currentProductId
}) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="mt-16">
            <LazySection fallback={<ReviewSkeleton />}>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-headline text-brand-brown mb-4">You Might Also Like</h2>
                    <p className="text-slate-400 text-sm">Similar products from our curated collection</p>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {products
                            .filter((p: any) => p.category === currentProductCategory && p.id !== currentProductId)
                            .slice(0, 4)
                            .map((product: any) => (
                                <ProductCard key={product?.id} product={product} />
                            ))}
                    </div>
                ) : (
                    <ComingSoonPlaceholder label="related products" />
                )}
            </LazySection>
        </div>
    );
};

export default RelatedProductsSection;