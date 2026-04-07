import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowRight,
    Star,
    Leaf,
    Package,
    Truck,
    ShieldCheck,
    Quotes,
} from "@phosphor-icons/react";
import ProductCard from "../components/ProductCard";
import { useHomepageData, Hero, Section, Testimonial, InstagramPost } from "../api/homepage";
import { useProducts, useCategories } from "../api/products";
import { Product } from "../types";
import { HomeSkeleton, ProductGridSkeleton, ReviewSkeleton, CategoryGridSkeleton } from "../components/Skeletons";
import LazySection from "../components/LazySection";
import LazyErrorBoundary from "../components/LazyErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

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
            // Capitalize first letter
            const capitalized =
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

            // Replace "and" with "&" if desired for specific UI polish
            if (capitalized === "Wellness") return "& Wellness";
            // Alternative: if (capitalized === 'And') return '&';

            return capitalized;
        })
        .join(" ")
        .replace(/\s&\s/g, " & ") // Ensure spacing is clean around ampersands
        .trim();
};

const formatHeroTitle = (title: string | undefined) => {
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

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    // Fetch homepage data from API
    const { data: homepageData, isLoading: homepageLoading } = useHomepageData();

    // Fetch category-based UI for collections
    const {
        categories,
        isLoading: categoriesLoading,
        error: categoriesError,
    } = useCategories();

    const [activeCollectionCategory, setActiveCollectionCategory] = useState<string>('');

    useEffect(() => {
        if (!activeCollectionCategory && categories?.length) {
            setActiveCollectionCategory(categories[0].id);
        }
    }, [categories, activeCollectionCategory]);

    const collectionFilters = React.useMemo(() => {
        return activeCollectionCategory
            ? { categoryId: activeCollectionCategory, limit: 4, page: 1 }
            : { limit: 4, page: 1 };
    }, [activeCollectionCategory]);

    const bestsellersFilters = React.useMemo(() => ({ isBestseller: true, limit: 4, page: 1 }), []);
    const newArrivalsFilters = React.useMemo(() => ({ isNew: true, limit: 4, page: 1 }), []);

    const {
        products: collectionProducts,
        total: collectionTotal,
        isLoading: collectionLoading,
        error: collectionError,
    } = useProducts(collectionFilters);

    const {
        products: bestsellersProducts,
        total: bestsellersTotal,
        isLoading: bestsellersLoading,
        error: bestsellersError,
    } = useProducts(bestsellersFilters);

    const {
        products: newArrivalsProducts,
        total: newArrivalsTotal,
        isLoading: newArrivalsLoading,
        error: newArrivalsError,
    } = useProducts(newArrivalsFilters);

    const homepageTestimonials = homepageData?.testimonials || [];

    useEffect(() => {
        if (!homepageTestimonials.length) return;

        const interval = setInterval(() => {
            setTestimonialIndex(
                (prev) => (prev + 1) % homepageTestimonials.length,
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [homepageTestimonials.length]);

    const isAnyLoading =
        homepageLoading ||
        categoriesLoading ||
        collectionLoading ||
        bestsellersLoading ||
        newArrivalsLoading;

    if (isAnyLoading) {
        return <HomeSkeleton />;
    }

    const errorToShow =
        categoriesError || collectionError || bestsellersError || newArrivalsError;

    if (errorToShow) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
                <div className="text-center bg-white border border-brand-brown/10 rounded-[24px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 max-w-sm">
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

    const hero = homepageData?.hero?.find((hero: Hero) => hero?.isActive) || null;
    const sections: Section[] = Array.isArray(homepageData?.sections) ? (homepageData.sections as Section[])?.filter((section: Section) => section?.isActive) : [];
    const testimonials: Testimonial[] = Array.isArray(homepageData?.testimonials) ? (homepageData.testimonials as Testimonial[])?.filter((testimony: Testimonial) => testimony?.isActive) : [];
    const instagramPosts: InstagramPost[] = Array.isArray(homepageData?.instagramPosts) ? (homepageData.instagramPosts as InstagramPost[])?.filter((post: InstagramPost) => post?.isActive) : [];

    const collections = Array.isArray(collectionProducts) ? collectionProducts : [];
    const bestsellers = Array.isArray(bestsellersProducts) ? bestsellersProducts : [];
    const newArrivals = Array.isArray(newArrivalsProducts) ? newArrivalsProducts : [];

    // Get specific sections with proper typing
    const collectionsSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "collections" && s.isActive,
    );
    const bestsellersSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "bestsellers" && s.isActive,
    );
    const healthWellnessSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "health_wellness" && s.isActive,
    );
    const newArrivalsSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "new_arrivals" && s.isActive,
    );
    const storySection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "story" && s.isActive
    );
    const testimonialsSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "testimonials" && s.isActive,
    );
    const instagramSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "instagram" && s.isActive
    );
    const contactSection: Section | undefined = sections.find(
        (s: Section) => s.sectionType === "contact" && s.isActive
    );

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

    const dynamicSections: Section[] = sections
        .filter((s: Section) => !knownSectionTypes.includes(s.sectionType) && s.isActive)
        .sort((a: Section, b: Section) => (a.order || 0) - (b.order || 0));

    const renderDynamicSection = (s: Section): React.ReactNode => {
        return (
            <section key={s.id} className="relative overflow-hidden" aria-label={`${s.sectionType} banner`}>
                <div className="relative h-80 md:h-96">
                    <img
                        src={
                            s.backgroundImageUrl ||
                            s.imageUrl ||
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png"
                        }
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
                                    className="font-headline text-4xl text-brand mb-4 text-brand-cream"
                                    style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                >
                                    {s.title}
                                </h2>
                                <p className="font-sans text-brand-cream opacity-90 mb-6 leading-relaxed">
                                    {s.subtitle || s.content || "Discover more about our premium products."}
                                </p>
                                {s.buttonLink && s.buttonText && (
                                    <button
                                        onClick={() => navigate(s.buttonLink!)}
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
    };

    return (
        <div className="text-foreground">
            <section
                ref={heroRef}
                className={`relative ${hero?.videoUrl ? 'min-h-[80vh]' : 'min-h-screen'} flex items-center justify-center overflow-hidden`}
                aria-label="Hero section"
            >
                <div className="absolute inset-0">
                    <motion.video
                        alt={hero?.title || "Premium Dry Fruits Hero Video"}
                        src={
                            hero?.videoUrl ||
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1.mp4"
                        }
                        poster={"https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1-poster.png"}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80" />
                </div>

                <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1
                            className="font-headline text-5xl md:text-7xl text-brand-cream mb-6 leading-tight"
                            style={{
                                fontWeight: 500,
                                letterSpacing: "-0.025em",
                                lineHeight: 1.2,
                            }}
                        >
                            {formatHeroTitle(hero?.title) ||
                                "Shop Premium Dry Fruits & Nuts."}
                        </h1>
                        <p className="font-sans text-lg text-brand-cream opacity-90 mb-10 max-w-2xl mx-auto leading relaxed">
                            {hero?.subtitle ||
                                "Carefully sourced, perfectly packed, and delivered fresh to your doorstep."}
                        </p>

                        <button
                            onClick={() => {
                                document
                                    .getElementById("collections")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-brand-cream text-brand-brown font-label text-sm px-10 py-4 rounded-lg hover:bg-brand-latte transition-all duration-300 cursor-pointer uppercase tracking-widest inline-flex items-center gap-3"
                        >
                            {hero?.buttonText || "Explore Collections"}
                            <ArrowRight size={16} weight="regular" />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-12 left-0 right-0 z-10"
                >
                    <div className="flex flex-wrap items-center justify-center gap-8 px-8">
                        {[
                            { icon: <Leaf size={18} weight="fill" />, label: "100% Natural" },
                            {
                                icon: <Package size={18} weight="fill" />,
                                label: "Fresh Packed",
                            },
                            {
                                icon: <Truck size={18} weight="fill" />,
                                label: "Fast Delivery",
                            },
                            {
                                icon: <ShieldCheck size={18} weight="fill" />,
                                label: "Quality Assured",
                            },
                        ]?.map((item: any) => (
                            <div
                                key={item?.label}
                                className="flex items-center gap-2 text-brand-cream opacity-80"
                            >
                                <span className="text-brand-cream">{item?.icon}</span>
                                <span className="font-label text-xs uppercase tracking-wider text-brand-cream">
                                    {item?.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {collectionsSection && (
                <LazyErrorBoundary>
                    <LazySection
                        fallback={<div className="py-16 px-8"><CategoryGridSkeleton count={4} /></div>}
                        rootMargin="300px 0px"
                    >
                        <section id="collections" className="py-16 px-8 bg-brand-latte">
                            <div className="max-w-7xl mx-auto">
                                <motion.div
                                    variants={fadeUpVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                                >
                                    <div className="max-w-2xl">
                                        <h2
                                            className="font-headline text-4xl text-brand-brown mb-4"
                                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                        >
                                            {collectionsSection?.title || "Shop by Category"}
                                        </h2>

                                        <p className="font-sans text-slate-600">
                                            {collectionsSection?.subtitle ||
                                                "Discover our wide range of dry fruits and nuts, carefully categorized for your convenience."}
                                        </p>
                                    </div>

                                    {collectionTotal > 4 && (
                                        <div className="shrink-0">
                                            <button
                                                onClick={() => navigate(`/shop${activeCollectionCategory ? `?category=${activeCollectionCategory}` : ''}`)}
                                                className="inline-flex items-center gap-2 font-label text-sm text-brand-brown hover:text-brand-cocoa transition-colors duration-200"
                                            >
                                                View All <ArrowRight size={16} weight="regular" />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {(collections.length > 0 ? collections : []).map((product: Product) => (
                                        <motion.div key={product.id} variants={fadeUpVariants}>
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}

                                    {collections.length === 0 && (
                                        <div className="col-span-full text-center text-slate-500" role="status">
                                            No collection products available yet.
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </section>
                    </LazySection>
                </LazyErrorBoundary>
            )}

            {bestsellersSection && bestsellers?.length > 0 && (
                <LazyErrorBoundary>
                    <LazySection
                        fallback={<div className="py-16 px-8"><ProductGridSkeleton count={4} /></div>}
                        rootMargin="300px 0px"
                    >
                        <section className="py-16 px-8 bg-white">
                            <div className="max-w-7xl mx-auto">
                                <motion.div
                                    variants={fadeUpVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="flex items-end justify-between mb-12"
                                >
                                    <div>
                                        <span className="font-label text-xs uppercase tracking-widest text-brand-cocoa block mb-2">
                                            {bestsellersSection?.title || "Our Bestsellers"}
                                        </span>
                                        <h2
                                            className="font-headline text-4xl text-brand-brown"
                                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                        >
                                            {bestsellersSection?.subtitle || "Customer Favorites"}
                                        </h2>
                                    </div>

                                    {bestsellersTotal > 4 && (
                                        <button
                                            onClick={() => navigate("/shop?isBestseller=true")}
                                            className="hidden md:flex items-center gap-2 font-label text-sm text-brand-brown hover:text-brand-cocoa transition-colors duration-200 cursor-pointer"
                                        >
                                            View All <ArrowRight size={16} weight="regular" />
                                        </button>
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {bestsellers?.map((product: Product) => (
                                        <motion.div key={product?.id} variants={fadeUpVariants}>
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </section>
                    </LazySection>
                </LazyErrorBoundary>
            )}

            {healthWellnessSection && (
                <section
                    className="relative overflow-hidden"
                    aria-label="Almond lifestyle banner"
                >
                    <div className="relative h-80 md:h-96">
                        <img
                            src={
                                healthWellnessSection?.backgroundImageUrl ??
                                "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png"
                            }
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
                                        {formatSectionTitle(healthWellnessSection?.sectionType) ??
                                            "Health & Wellness"}
                                    </span>
                                    <h2
                                        className="font-headline text-4xl text-brand mb-4 text-brand-cream"
                                        style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                    >
                                        {healthWellnessSection?.title ||
                                            "Nourish Your Body with Almonds"}
                                    </h2>
                                    <p className="font-sans text-brand-cream opacity-90 mb-6 leading-relaxed">
                                        {healthWellnessSection?.subtitle ||
                                            "Packed with nutrients, our almonds are the perfect snack for a healthy lifestyle."}
                                    </p>
                                    <button
                                        onClick={() =>
                                            navigate(healthWellnessSection?.buttonLink || "/shop")
                                        }
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

            {newArrivalsSection && newArrivals?.length > 0 && (
                <LazyErrorBoundary>
                    <LazySection
                        fallback={<div className="py-16 px-8"><ProductGridSkeleton count={4} /></div>}
                        rootMargin="300px 0px"
                    >
                        <section className="py-16 px-8 bg-brand-latte">
                            <div className="max-w-7xl mx-auto">
                                <motion.div
                                    variants={fadeUpVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="flex items-end justify-between mb-12"
                                >
                                    <div>
                                        <span className="font-label text-xs uppercase tracking-widest text-brand-plum block mb-2">
                                            {newArrivalsSection?.title || "Just Landed"}
                                        </span>
                                        <h2
                                            className="font-headline text-4xl text-brand-brown"
                                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                        >
                                            {newArrivalsSection?.subtitle ||
                                                "Discover Our Newest Additions"}
                                        </h2>
                                    </div>
                                    {newArrivalsTotal > 4 && (
                                        <button
                                            onClick={() => navigate("/shop?isNew=true")}
                                            className="hidden md:flex items-center gap-2 font-label text-sm text-brand-brown hover:text-brand-cocoa transition-colors duration-200 cursor-pointer"
                                        >
                                            View All <ArrowRight size={16} weight="regular" />
                                        </button>
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {newArrivals?.map((product: Product) => (
                                        <motion.div key={product?.id} variant={fadeUpVariants}>
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </section>
                    </LazySection>
                </LazyErrorBoundary>
            )}

            {storySection && (
                <section id="story" className="py-16 px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <span className="font-label text-xs uppercase tracking-widest text-brand-cocoa block mb-2">
                                Our {formatSectionTitle(storySection?.sectionType) || "Story"}
                            </span>
                            <h2
                                className="font-headline text-4xl text-brand-brown mb-4"
                                style={{ fontWeight: 500, letterSpacing: "-0.0.25em" }}
                            >
                                {storySection?.title || "From Our Farms to Your Table"}
                            </h2>

                            <p className="font-sans text-slate-600 max-w-xl mx-auto">
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
                                    storySection?.videoPosterUrl ||
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
            )}

            {testimonialsSection && testimonials?.length > 0 && (
                <LazyErrorBoundary>
                    <LazySection
                        fallback={<div className="py-16 px-8"><ReviewSkeleton count={1} /></div>}
                        rootMargin="250px 0px"
                    >
                        <section className="py-16 px-8 bg-gradient-1">
                            <div className="max-w-4xl mx-auto text-center">
                                <motion.div
                                    variants={fadeUpVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    <span className="font-label text-xs uppercase tracking-widest text-brand-cream opacity-80 block mb-2">
                                        {testimonialsSection?.title || "Testimonials"}
                                    </span>
                                    <h2
                                        className="font-headline text-4xl text-brand-cream mb-12"
                                        style={{ fontWeight: 500, letterSpacing: "-0.0.25em" }}
                                    >
                                        {testimonialsSection?.subtitle || "What Our Customers Are Saying"}
                                    </h2>
                                </motion.div>

                                <div className="relative min-h-48">
                                    {testimonials?.map((t: Testimonial, i: number) => (
                                        <motion.div
                                            key={t.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: i === testimonialIndex ? 1 : 0 }}
                                            transition={{ duration: 0.5 }}
                                            className={`absolute inset-0 flex flex-col items-center ${i === testimonialIndex
                                                ? "pointer-events-auto"
                                                : "pointer-events-none"
                                                }`}
                                        >
                                            <Quotes
                                                size={32}
                                                weight="fill"
                                                className="text-brand-cream opacity-40 mb-4"
                                            />
                                            <p className="font-sans text-lg text-brand-cream opacity-95 leading-relaxed mb-6 max-w-2xl">
                                                "{t.content}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-cocoa flex items-center justify-center">
                                                    <span
                                                        className="font-label text-sm text-brand-cream font-500"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        {t.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </span>
                                                </div>

                                                <div className="text-left">
                                                    <p
                                                        className="font-label text-sm  text-brand-cream"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        {t.name}
                                                    </p>
                                                    <p className="font-sans text-xs text-brand-cream opacity-70">
                                                        {t.role || "Customer"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 ml-2">
                                                    {Array.from({ length: t.rating })?.map((_, i: number) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            weight="fill"
                                                            className="text-warning"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-center gap-2 mt-16">
                                    {testimonials?.map((_: Testimonial, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setTestimonialIndex(i)}
                                            className={`rounded-full transition-all duration-300 cursor-pointer ${i === testimonialIndex
                                                ? "w-6 h-2 bg-brand-cream"
                                                : "w-2 h-2 bg-brand-cream opacity-40 hover:opacity-70"
                                                }`}
                                            aria-label={`Go to testimonial ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </LazySection>
                </LazyErrorBoundary>
            )}

            {instagramSection && instagramPosts?.length > 0 && (
                <LazyErrorBoundary>
                    <LazySection
                        fallback={<div className="py-16 px-8"><CategoryGridSkeleton count={6} /></div>}
                        rootMargin="250px 0px"
                    >
                        <section id="recipes" className="py-16 px-8 bg-brand-latte">
                            <div>
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
                                        {instagramSection?.subtitle ||
                                            "See Our Latest Posts on Instagram"}
                                    </h2>
                                    <p className="font-sans text-slate-600">
                                        Join our community of health enthusiasts on Instagram
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
                                >
                                    {instagramPosts?.map((post: InstagramPost, i: number) => (
                                        <motion.a
                                            key={post.id}
                                            href={post.postUrl || "https://instagram.com"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variants={fadeUpVariants}
                                            className="relative aspect-square rounded-[24px] overflow-hidden group block border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1"
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
                                </motion.div>
                            </div>
                        </section>
                    </LazySection>
                </LazyErrorBoundary>
            )}

            {dynamicSections.map((section) => renderDynamicSection(section))}

            {contactSection && (
                <section id="contact" className="py-16 px-8 bg-white">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h2
                                className="font-headline text-4xl text-brand-brown mb-4"
                                style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                            >
                                {contactSection?.title || "Get in Touch"}
                            </h2>
                            <p className="font-sans text-slate-600 mb-8">
                                {contactSection?.subtitle ||
                                    "Have questions or feedback? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible."}
                            </p>
                            <form className="flex flex-col gap-4 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="bg-brand-latte text-brand-brown font-sans text-sm px-4 py-4 rounded-lg border border-slate-200 focus:outline-none focus:border-brown transition-colors duration-200"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="bg-brand-latte text-brand-brown font-sans text-sm px-4 py-4 rounded-lg border border-slate-200 focus:outline-none focus:border-brown transition-colors duration-200"
                                    />
                                </div>
                                <textarea
                                    placeholder="Your Message"
                                    rows={4}
                                    className="bg-brand-latte text-brand-brown font-sans text-sm px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brown transition-colors duration-200"
                                />
                                <button
                                    type="submit"
                                    className="bg-brand-brown text-brand-cream font-label text-sm py-4 rounded-lg hover:bg-brand-cocoa transition-colors duration-200 cursor-pointer uppercase tracking-widest"
                                >
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;