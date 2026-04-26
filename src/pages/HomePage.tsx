import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useHomepageData } from "../api/homepage";
import { useProducts, useCategories } from "../api/products";
import { useGetReviews } from "../api/reviews";
import { HomeSkeleton } from "../components/Skeletons";
import {
    HeroSection,
    ProductGridSection,
    TestimonialsCarousel,
    StorySection,
} from "../components/HomePage";
import { formatSectionTitle, fadeUpVariants } from "../utils/homePageUtils";
import LazySection from "../components/LazySection";
import LazyErrorBoundary from "../components/LazyErrorBoundary";
import { CategoryGridSkeleton } from "../components/Skeletons";
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

    // Helper to render dynamic sections
    const renderDynamicSection = (s: any) => (
        <section key={s.id} className="relative overflow-hidden" aria-label={`${s.sectionType} banner`}>
            <div className="relative h-80 md:h-96">
                <img
                    src={s.backgroundImageUrl || "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png"}
                    alt={`${s.sectionType} banner`}
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
                            <span className="font-label text-xs uppercase tracking-widest text-brand-cream opacity-80 block mb-3">
                                {formatSectionTitle(s.sectionType)}
                            </span>
                            <h2
                                className="font-headline text-4xl text-brand-cream mb-4"
                                style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                            >
                                {s.title}
                            </h2>
                            <p className="font-sans text-brand-cream opacity-90 mb-6 leading-relaxed">
                                {s.subtitle || s.content || "Discover more about our premium products."}
                            </p>
                            {s.buttonLink && s.buttonText && (
                                <button
                                    onClick={() => navigate(s.buttonLink)}
                                    className="bg-brand-cream text-brand-brown font-label text-sm px-6 py-3 rounded-lg hover:bg-brand-latte transition-colors duration-200 cursor-pointer uppercase tracking-widest"
                                >
                                    {s.buttonText}
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
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
                <section className="relative overflow-hidden" aria-label="Almond lifestyle banner">
                    <div className="relative h-80 md:h-96">
                        <img
                            src={healthWellnessSection?.backgroundImageUrl || "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png"}
                            alt="almond lifestyle banner"
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
                                    <span className="font-label text-xs uppercase tracking-widest text-brand-cream opacity-80 block mb-3">
                                        {formatSectionTitle(healthWellnessSection?.sectionType) || "Health & Wellness"}
                                    </span>
                                    <h2
                                        className="font-headline text-4xl text-brand-cream mb-4"
                                        style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                    >
                                        {healthWellnessSection?.title || "Nourish Your Body with Almonds"}
                                    </h2>
                                    <p className="font-sans text-brand-cream opacity-90 mb-6 leading-relaxed">
                                        {healthWellnessSection?.subtitle || "Packed with nutrients, our almonds are the perfect snack for a healthy lifestyle."}
                                    </p>
                                    <button
                                        onClick={() => navigate(healthWellnessSection?.buttonLink || "/shop")}
                                        className="bg-brand-cream text-brand-brown font-label text-sm px-6 py-3 rounded-lg hover:bg-brand-latte transition-colors duration-200 cursor-pointer uppercase tracking-widest"
                                    >
                                        {healthWellnessSection?.buttonText || "Shop Almonds"}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
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
            {instagramSection && instagramPosts?.length > 0 && (
                <LazyErrorBoundary>
                    <LazySection
                        fallback={<div className="py-16 px-8"><CategoryGridSkeleton count={6} /></div>}
                        rootMargin="250px 0px"
                    >
                        <section id="recipes" className="py-16 px-8 bg-brand-latte">
                            <motion.div
                                variants={fadeUpVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <span className="font-label text-xs tracking-widest text-brand-cocoa block mb-2">
                                    {instagramSection?.title || "Follow Us"}
                                </span>
                                <h2
                                    className="font-headline text-4xl text-brand-brown mb-4"
                                    style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                >
                                    {instagramSection?.subtitle || "See Our Latest Posts on Instagram"}
                                </h2>
                                <p className="font-sans text-brand-brown/80">
                                    Join our community of health enthusiasts on Instagram
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
                                {instagramPosts?.map((post: any, i: number) => (
                                    <motion.a
                                        key={post.id}
                                        href={post.postUrl || "https://instagram.com"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variants={fadeUpVariants}
                                        className="relative aspect-square rounded-[24px] overflow-hidden group block border border-brand-brown/10 shadow-md hover:shadow-lg transition-all duration-300"
                                        aria-label={`Instagram post ${i + 1}`}
                                    >
                                        <img
                                            src={post.imageUrl}
                                            alt={post.caption || `Instagram post ${i + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-brand-brown opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                                    </motion.a>
                                ))}
                            </div>
                        </section>
                    </LazySection>
                </LazyErrorBoundary>
            )}

            {/* Dynamic Sections */}
            {dynamicSections.map((section) => renderDynamicSection(section))}
        </div>
    );
};

export default HomePage;