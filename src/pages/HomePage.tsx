import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHomepageData } from "../api/homepage";
import { useProducts, useCategories } from "../api/products";
import { useGetReviews } from "../api/reviews";
import { HomeSkeleton } from "../components/Skeletons";
import {
    HeroSection,
    ProductGridSection,
    TestimonialsCarousel,
    StorySection,
    HealthWellnessSection,
    InstagramSection,
    DynamicSection,
} from "../components/HomePage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [activeCollectionCategory, setActiveCollectionCategory] = useState<string>("");

    // Data Fetching
    const { data: homepageData, isLoading: homepageLoading } = useHomepageData();
    const { reviews: backendReviews, isLoading: reviewsLoading } = useGetReviews(5, 0);
    const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

    const collectionFilters = React.useMemo(() => ({
        categoryId: activeCollectionCategory,
        limit: 4,
        page: 1,
    }), [activeCollectionCategory]);

    const bestsellersFilters = React.useMemo(() => ({
        isBestseller: true,
        limit: 4,
        page: 1,
    }), []);

    const newArrivalsFilters = React.useMemo(() => ({
        isNew: true,
        limit: 4,
        page: 1,
    }), []);

    const {
        products: collectionProducts = [],
        total: collectionTotal = 0,
        isLoading: collectionLoading,
        error: collectionError,
    } = useProducts(collectionFilters);

    const {
        products: bestsellersProducts = [],
        total: bestsellersTotal = 0,
        isLoading: bestsellersLoading,
        error: bestsellersError,
    } = useProducts(bestsellersFilters);

    const {
        products: newArrivalsProducts = [],
        total: newArrivalsTotal = 0,
        isLoading: newArrivalsLoading,
        error: newArrivalsError,
    } = useProducts(newArrivalsFilters);

    // Initialize active collection
    React.useEffect(() => {
        if (categories && categories.length > 0 && !activeCollectionCategory) {
            setActiveCollectionCategory(categories[0].id);
        }
    }, [categories, activeCollectionCategory]);

    const isAnyLoading =
        homepageLoading ||
        categoriesLoading ||
        collectionLoading ||
        bestsellersLoading ||
        newArrivalsLoading ||
        reviewsLoading;

    if (isAnyLoading) {
        return <HomeSkeleton />;
    }

    const errorToShow =
        categoriesError || collectionError || bestsellersError || newArrivalsError;

    if (errorToShow) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
                <div className="text-center bg-white border border-brand-brown/10 rounded-[24px] p-8 shadow-lg max-w-sm">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        Unable to load products
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        There was an issue loading the product data. Please try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-brand-brown text-brand-cream px-6 py-2 rounded-lg hover:bg-brand-cocoa transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Parse data
    const sections = Array.isArray(homepageData?.sections)
        ? homepageData.sections.filter((s: any) => s?.isActive)
        : [];

    const instagramPosts = Array.isArray(homepageData?.instagramPosts)
        ? homepageData.instagramPosts.filter((p: any) => p?.isActive)
        : [];

    const collectionsSection = sections.find((s: any) => s.sectionType === "collections");
    const bestsellersSection = sections.find((s: any) => s.sectionType === "bestsellers");
    const healthWellnessSection = sections.find((s: any) => s.sectionType === "health_wellness");
    const newArrivalsSection = sections.find((s: any) => s.sectionType === "new_arrivals");
    const storySection = sections.find((s: any) => s.sectionType === "story");
    const instagramSection = sections.find((s: any) => s.sectionType === "instagram");

    const knownSectionTypes = [
        "collections",
        "bestsellers",
        "health_wellness",
        "new_arrivals",
        "story",
        "testimonials",
        "instagram",
        "contact",
    ];

    const dynamicSections = sections.filter(
        (s: any) => !knownSectionTypes.includes(s.sectionType) && s.isActive
    );

    return (
        <div className="text-foreground">
            {/* Hero Section */}
            <HeroSection hero={homepageData?.hero?.[0]} />

            {/* Collections Section */}
            <ProductGridSection
                sectionId="collections"
                title={collectionsSection?.title || "Shop by Category"}
                subtitle={collectionsSection?.subtitle}
                products={collectionProducts}
                isLoading={collectionLoading}
                total={collectionTotal}
                backgroundColor="bg-brand-latte"
                onViewAll={() => navigate(`/shop${activeCollectionCategory ? `?category=${activeCollectionCategory}` : ""}`)}
                showViewAllButton={true}
            />

            {/* Bestsellers Section */}
            {bestsellersSection && bestsellersProducts?.length > 0 && (
                <ProductGridSection
                    label={bestsellersSection?.title || "Our Bestsellers"}
                    title={bestsellersSection?.subtitle || "Customer Favorites"}
                    products={bestsellersProducts}
                    isLoading={bestsellersLoading}
                    total={bestsellersTotal}
                    backgroundColor="bg-white"
                    onViewAll={() => navigate("/shop?isBestseller=true")}
                    showViewAllButton={true}
                />
            )}

            {/* Health & Wellness Banner */}
            {healthWellnessSection && (
                <HealthWellnessSection
                    section={healthWellnessSection}
                    navigate={(path) => navigate(path)}
                />
            )}

            {/* New Arrivals Section */}
            {newArrivalsSection && newArrivalsProducts?.length > 0 && (
                <ProductGridSection
                    label={newArrivalsSection?.title || "Just Landed"}
                    title={newArrivalsSection?.subtitle || "Discover Our Newest Additions"}
                    products={newArrivalsProducts}
                    isLoading={newArrivalsLoading}
                    total={newArrivalsTotal}
                    backgroundColor="bg-brand-latte"
                    onViewAll={() => navigate("/shop?isNew=true")}
                    showViewAllButton={true}
                />
            )}

            {/* Story Section */}
            <StorySection storySection={storySection} />

            {/* Testimonials Section */}
            <TestimonialsCarousel
                testimonials={backendReviews}
                isLoading={reviewsLoading}
            />

            {/* Instagram Feed Section */}
            <InstagramSection section={instagramSection} posts={instagramPosts} />

            {/* Dynamic Sections */}
            {dynamicSections.map((section) => (
                <DynamicSection
                    key={section.id}
                    section={section}
                    navigate={(path) => navigate(path)}
                />
            ))}
        </div>
    );
};

export default HomePage;