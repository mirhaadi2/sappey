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
import { useHomepageData } from "../api/homepage";
import { useProducts, useCategories } from "../api/products";

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

const formatHeroTitle = (title: any) => {
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

    // Fetch products and categories
    const { products: productsData, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();

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

    if (homepageLoading || productsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-brown"></div>
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
                <div className="text-center bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-sm">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        Unable to load products
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        There was an issue loading the product data. Please try again.
                    </p>
                    <button
                        onClick={() => refetchProducts()}
                        className="bg-brand-brown text-brand-cream px-6 py-2 rounded-lg hover:bg-brand-cocoa transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const hero = homepageData?.hero?.find((hero: any) => hero?.isActive) || [];
    const sections = homepageData?.sections || [];
    const testimonials = homepageData?.testimonials || [];
    const instagramPosts = homepageData?.instagramPosts || [];

    const bestsellers = Array.isArray(productsData) ? productsData.filter((p: any) => p.isBestseller) || [] : [];
    const newArrivals = Array.isArray(productsData) ? productsData.filter((p: any) => p.isNew) || [] : [];

    // Get specific sections
    const collectionsSection = sections.find(
        (s) => s.sectionType === "collections",
    );
    const bestsellersSection = sections.find(
        (s) => s.sectionType === "bestsellers",
    );
    const healthWellnessSection = sections.find(
        (s) => s.sectionType === "health_wellness",
    );
    const newArrivalsSection = sections.find(
        (s) => s.sectionType === "new_arrivals",
    );
    const storySection = sections.find((s) => s.sectionType === "story");
    const testimonialsSection = sections.find(
        (s) => s.sectionType === "testimonials",
    );
    const instagramSection = sections.find((s) => s.sectionType === "instagram");
    const contactSection = sections.find((s) => s.sectionType === "contact");

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

            <section id="collections" className="py-16 px-8 bg-brand-latte">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2
                            className="font-headline text-4xl text-brand-brown mb-4"
                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                        >
                            {collectionsSection?.title || "Shop by Category"}
                        </h2>

                        <p className="font-sans text-gray-600 max-w-xl mx-auto">
                            {collectionsSection?.subtitle ||
                                "Discover our wide range of dry fruits and nuts, carefully categorized for your convenience."}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {productsData?.map((product: any) => (
                            <motion.div
                                key={product.id}
                                variants={fadeUpVariants}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate(`/products/${product?.slug}`)}
                                className="relative rounded-lg overflow-hidden aspect-square cursor-pointer group w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)]"
                                role="button"
                                aria-label={`Browse ${product?.name}`}
                                tabIndex={0}
                                onKeyDown={(e: any) =>
                                    e.key === "Enter" && navigate(`/products/${product?.id}`)
                                }
                            >
                                <img
                                    src={product?.images?.[0] || "https://c.animaapp.com/mmlqdzfpT0CVfh/img/placeholder-category.png"}
                                    alt={product?.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-headline text-xl text-brand-cream" style={{ fontWeight: 500 }}>
                                        {product?.name}
                                    </h3>
                                    <span className="font-label text-xs text-brand-cream opacity-80 uppercase tracking-wider">
                                        Shop Now
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

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

                        <button
                            onClick={() => navigate("/shop")}
                            className="hidden md:flex items-center gap-2 font-label text-sm text-brand-brown hover:text-brand-cocoa transition-colors duration-200 cursor-pointer"
                        >
                            View All <ArrowRight size={16} weight="regular" />
                        </button>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {bestsellers?.map((product: any) => (
                            <motion.div key={product?.id} variants={fadeUpVariants}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

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
                        <button
                            onClick={() => navigate("/shop")}
                            className="hidden md:flex items-center gap-2 font-label text-sm text-brand-brown hover:text-brand-cocoa transition-colors duration-200 cursor-pointer"
                        >
                            View All <ArrowRight size={16} weight="regular" />
                        </button>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {newArrivals?.map((product: any) => (
                            <motion.div key={product?.id} variant={fadeUpVariants}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

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

                        <p className="font-sans text-gray-600 max-w-xl mx-auto">
                            {storySection?.subtitle ||
                                "Founded in 2026, our mission has been to provide the highest quality dry fruits and nuts while supporting sustainable farming practices. We work directly with farmers to ensure fair wages and ethical sourcing, so you can feel good about every bite."}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative rounded-lg overflow-hidden max-w-4xl mx-auto"
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
                        {testimonials?.map((t: any, i: any) => (
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
                                    "{t.comment}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-cocoa flex items-center justify-center">
                                        <span
                                            className="font-label text-sm text-brand-cream font-500"
                                            style={{ fontWeight: 500 }}
                                        >
                                            {t?.author?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    </div>

                                    <div className="text-left">
                                        <p
                                            className="font-label text-sm  text-brand-cream"
                                            style={{ fontWeight: 500 }}
                                        >
                                            {t?.author}
                                        </p>
                                        <p className="font-sans text-xs text-brand-cream opacity-70">
                                            {t?.location}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 ml-2">
                                        {Array.from({ length: t?.rating })?.map((_, i) => (
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
                        {testimonials?.map((_: any, i: any) => (
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
                        <p className="font-sans text-gray-600">
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
                        {instagramPosts?.map((post: any, i: number) => (
                            <motion.a
                                key={post.id}
                                href={post.postUrl || "https://instagram.com"}
                                target="_blank"
                                rel="noopener  noreferrer"
                                variants={fadeUpVariants}
                                className="relative aspect-square rounded-lg overflow-hidden group block"
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
                        <p className="font-sans text-gray-600 mb-8">
                            {contactSection?.subtitle ||
                                "Have questions or feedback? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible."}
                        </p>
                        <form className="flex flex-col gap-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="bg-brand-latte text-brand-brown font-sans text-sm px-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brown transition-colors duration-200"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="bg-brand-latte text-brand-brown font-sans text-sm px-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brown transition-colors duration-200"
                                />
                            </div>
                            <textarea
                                placeholder="Your Message"
                                rows={4}
                                className="bg-brand-latte text-brand-brown font-sans text-sm px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brown transition-colors duration-200"
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
        </div>
    );
};

export default HomePage;
