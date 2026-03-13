import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Star, Leaf, Package, Truck, ShieldCheck, Quotes } from "@phosphor-icons/react";
import { products, categories, testimonials } from "../data/products";
import ProductCard from "../components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }},
}

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 }},
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const [testimonialIndex, setTestimonialIndex] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const bestsellers = products.filter((p) => p.isBestseller);
    const newArrivals = products.filter((p) => p.isNew);

    return (
        <div className='text-foreground'>
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                aria-label="Hero section"
            >
                <div className="absolute inset-0">
                    <motion.video 
                        alt="dry fruit brand introduction video"
                        src="https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1.mp4"
                        poster="https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1-poster.png"
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ opacity:0, scale: 1.1 }}
                        animate={{ opacity:1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80" />
                </div>

                <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity:0, y: 40 }}
                        animate={{ opacity:1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <span className="font-label text-xs uppercase tracking-widest text-brand-cream opacity-80 mb-4 block">
                            Premium Quality Since 2018
                        </span>
                        <h1
                            className="font-headline text-5xl md:text-7xl text-brand-cream mb-6 leading-tight"
                            style={{ fontWeight:500, letterSpacing: "-0.025em", lineHeight: 1.2 }}
                        >
                            Shop Premium
                            <br />
                            Dry Fruits & Nuts.
                        </h1>
                        <p className="font-sans text-lg text-brand-cream opacity-90 mb-10 max-w-2xl mx-auto leading relaxed">
                            Carefully sourced, perfectly packed, and delivered fresh to your doorstep.
                        </p>
                        
                        <button
                            onClick={() => {
                                document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-brand-cream text-brand-brown font-label text-sm px-10 py-4 rounded-lg hover:bg-brand-latte transition-all duration-300 cursor-pointer uppercase tracking-widest inline-flex items-center gap-3"
                        >
                            Explore Collections
                            <ArrowRight size={16} weight="regular" />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity:0, y: 20 }}
                    animate={{ opacity:1, y: 0 }}
                    transition={{ duration:0.8, delay: 0.8 }}
                    className="absolute bottom-12 left-0 right-0 z-10"
                >
                    <div className="flex flex-wrap items-center justify-center gap-8 px-8">
                        {[
                            { icon: <Leaf size={18} weight="fill" />, label: "100% Natural" },
                            { icon: <Package size={18} weight="fill" />, label: "Fresh Packed" },
                            { icon: <Truck size={18} weight="fill" />, label: "Fast Delivery" },
                            { icon: <ShieldCheck size={18} weight="fill" />, label: "Quality Assured" },
                        ]?.map((item: any) => (
                            <div key={item?.label} className="flex items-center gap-2 text-brand-cream opacity-80">
                                <span className="text-brand-cream">{item?.icon}</span>
                                <span className="font-label text-xs uppercase tracking-wider text-brand-cream">{item?.label}</span>
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
                            Explore All Collections
                        </h2>

                        <p className="font-sans text-gray-600 max-w-xl mx-auto">
                            From creamy cashews to crunchy almonds - discover our full range of premium dry fruits.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {categories?.map((cat:any) => (
                            <motion.div
                                key={cat.id}
                                variants={fadeUpVariants}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate(`/shop?category=${cat?.slug}`)}
                                className="relative rounded-lg overflow-hidden aspect-square cursor-pointer group"
                                role="button"
                                aria-label={`Browse ${cat?.name}`}
                                tabIndex={0}
                                onKeyDown={(e: any) => e.key === "Enter" && navigate(`/shop?category=${cat?.slug}`)}
                            >
                                <img
                                    src={cat?.image}
                                    alt={cat?.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inse-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3
                                        className="font-headline text-xl text-brand-cream"
                                        style={{ fontWeight: 500 }}
                                    >
                                        {cat?.name}
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
                                Customer Favorites
                            </span>
                            <h2
                                className="font-headline text-4xl text-brand-brown"
                                style={{ fontWeight:500, letterSpacing: "-0.025em" }}
                            >
                                Bestsellers
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
                        {bestsellers?.map((product) => (
                            <motion.div key={product?.id} variants={fadeUpVariants}>
                                <ProductCard product={product} />
                            </motion.div>  
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative overflow-hidden" aria-label="Almond lifestyle banner">
                <div className="relative h-80 md:h-96">
                    <img
                        src="https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_3.png"
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
                                    Health & Wellness
                                </span>
                                <h2
                                    className="font-headline text-4xl text-brand mb-4 text-brand-cream"
                                    style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                                >
                                    Stay Strong with Almonds
                                </h2>
                                <p className="font-sans text-brand-cream opacity-90 mb-6 leading-relaxed">
                                    Rich in Vitamin E, magnesium, and healthy fats. Make almonds your daily ritual for a stronger, healthier you.
                                </p>
                                <button
                                    onClick={() => navigate("/shop?category=almonds")}
                                    className="bg-brand-cream text-brand-brown font-label text-sm px-6 py-3 rounded-lg hover:bg-brand-latte transition-colors duration-200 cursor-pointer uppercase tracking-widest"                              
                                >
                                    Shop Almond Range
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
                            <span 
                                className="font-label text-xs uppercase tracking-widest text-brand-plum block mb-2"
                            >
                                Just Landed
                            </span>
                            <h2
                                className="font-headline text-4xl text-brand-brown"
                                style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                            >
                                New Arrivals
                            </h2>
                        </div>
                        <button
                            onClick={()=> navigate("/shop")}
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
                            Our Story
                        </span>
                        <h2
                            className="font-headline text-4xl text-brand-brown mb-4"
                            style={{ fontWeight: 500, letterSpacing: "-0.0.25em"}}
                        >
                            From Farm to Your Table
                        </h2>

                        <p className="font-sans text-gray-600 max-w-xl mx-auto">
                            Watch how we carefully source, process, and pack every batch of our premium dry fruits.
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
                            src="https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1.mp4"
                            poster="https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_1-poster.png"
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            initial={{ opacity:0, scale: 1.1 }}
                            animate={{ opacity:1, scale: 1 }}
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
                            What Our Customers Say
                        </span>
                        <h2
                            className="font-headline text-4xl text-brand-cream mb-12"
                            style={{ fontWeight:500, letterSpacing: "-0.0.25em" }}
                        >
                            Loved by Thousands
                        </h2>
                    </motion.div>

                    <div className="relative min-h-48">
                        {testimonials?.map((t: any, i:any) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: i === testimonialIndex ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                className={
                                    `absolute inset-0 flex flex-col items-center ${
                                    i === testimonialIndex ? "pointer-events-auto" : "pointer-events-none"}`
                                } 
                            >
                                <Quotes size={32} weight="fill" className="text-brand-cream opacity-40 mb-4" />
                                <p className="font-sans text-lg text-brand-cream opacity-95 leading-relaxed mb-6 max-w-2xl">
                                    "{t.comment}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div  className="w-10 h-10 rounded-full bg-brand-cocoa flex items-center justify-center">
                                        <span className="font-label text-sm text-brand-cream font-500" style={{ fontWeight: 500 }}>
                                            {t?.initials}
                                        </span>
                                    </div>


                                    <div className="text-left">
                                        <p className="font-label text-sm  text-brand-cream" style={{ fontWeight: 500 }}>
                                            {t?.author}
                                        </p>
                                        <p className="font-sans text-xs text-brand-cream opacity-70">{t?.location}</p>
                                    </div>

                                    <div className="flex items-center gap-1 ml-2">
                                        {Array.from({ length: t?.rating })?.map((_, i) => (
                                            <Star key={i} size={14} weight="fill" className="text-warning" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-16">
                        {testimonials?.map((_:any, i: any) => (
                            <button
                                key={i}
                                onClick={() => setTestimonialIndex(i)}
                                className={`rounded-full transition-all duration-300 cursor-pointer ${
                                        i === testimonialIndex
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
                        <span className="font-label text-xs uppercase tracking-widest text-brand-cocoa block mb-2">
                            @kruncho.official
                        </span>
                        <h2
                            className="font-headline text-4xl text-brand-brown mb-4"
                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                        >   
                            Follow Our Journey
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
                        {[
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_3.png",
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
                            "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
                        ].map((img, i) => (
                            <motion.a
                                key={i}
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener  noreferrer"
                                variants={fadeUpVariants}
                                className="relative aspect-square rounded-lg overflow-hidden group block"
                                aria-label={`Instagram post ${i + 1}`}
                            >
                                <img
                                    src={img}
                                    alt={`Kruncho Instagram post ${i + 1}`}
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
                            Get in Touch
                        </h2>
                        <p className="font-sans text-gray-600 mb-8">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
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