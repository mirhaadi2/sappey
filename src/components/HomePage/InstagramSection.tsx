import React from "react";
import { motion } from "framer-motion";
import { LazyErrorBoundary, LazySection } from "../common";
import { CategoryGridSkeleton } from "../Skeletons";
import { fadeUpVariants } from "../../utils/homePageUtils";
import { InstagramSectionProps } from "../../types/HomePage";

const InstagramSection: React.FC<InstagramSectionProps> = ({
    section,
    posts,
}) => {
    if (!section || posts.length === 0) return null;

    return (
        <LazyErrorBoundary>
            <LazySection
                fallback={
                    <div className="py-16 px-8">
                        <CategoryGridSkeleton count={6} />
                    </div>
                }
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
                            {section.title || "Follow Us"}
                        </span>
                        <h2
                            className="font-headline text-4xl text-brand-brown mb-4"
                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                        >
                            {section.subtitle || "See Our Latest Posts on Instagram"}
                        </h2>
                        <p className="font-sans text-brand-brown/80">
                            Join our community of health enthusiasts on Instagram.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
                        {posts.map((post, i) => (
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
    );
};

export default InstagramSection;
