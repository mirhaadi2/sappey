import { motion } from "framer-motion";
import {
    ShieldCheck,
    Leaf,
    HandCoins,
    Package,
    Truck,
    Sparkle,
    Flask,
} from "@phosphor-icons/react";

const reasons = [
    {
        id: "01",
        icon: <ShieldCheck size={22} weight="fill" />,
        title: "FSSAI Certified Quality",
        description:
            "Every product is packed with safety, hygiene, and quality standards that meet certified food regulations for trusted everyday consumption.",
    },
    {
        id: "02",
        icon: <Leaf size={22} weight="fill" />,
        title: "Direct From Farmers",
        description:
            "We source directly from trusted farmers and growers to ensure naturally fresh products without unnecessary storage or market dilution.",
    },
    {
        id: "03",
        icon: <HandCoins size={22} weight="fill" />,
        title: "No Middleman Pricing",
        description:
            "By cutting unnecessary middlemen and traditional distribution layers, we make premium dry fruits accessible at honest prices.",
    },
    {
        id: "04",
        icon: <Package size={22} weight="fill" />,
        title: "Premium Packaging",
        description:
            "Carefully sealed and elegantly packed to preserve freshness, aroma, texture, and premium presentation in every order.",
    },
    {
        id: "05",
        icon: <Truck size={24} weight="fill" />,
        title: "Freshly Packed Delivery",
        description:
            "Products are packed with freshness priority so customers receive cleaner, better-tasting dry fruits delivered quickly.",
    },
    {
        id: "06",
        icon: <Sparkle size={24} weight="fill" />,
        title: "Luxury Experience, Fair Pricing",
        description:
            "Sappey was started with a simple mission — making premium-quality dry fruits affordable for more families without compromising freshness or quality.",
    },
];

export default function WhyChooseSappey() {
    return (
        <section className="bg-[#F8F6F2] py-16 px-4 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-10 h-[1px] bg-[#B08A37]" />
                        <p className="uppercase tracking-[0.35em] text-[#B08A37] text-[11px] font-semibold">
                            The Sappey Difference
                        </p>
                        <div className="w-10 h-[1px] bg-[#B08A37]" />
                    </div>

                    <h2 className="text-[clamp(2rem,6vw,3rem)] leading-tight font-serif text-[#1A1815] max-w-3xl mx-auto mb-6">
                        Why Customers <span className="text-[#B08A37]">Choose Sappey</span>
                    </h2>

                    <p className="text-[#6B665E] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Premium quality dry fruits sourced directly from farmers,
                        delivered with freshness, honesty, and luxury-level care.
                    </p>
                </motion.div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="group bg-white border border-[#E8E2D9] rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-[#B08A37]/40 hover:-translate-y-1"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6"> {/* Margin moved here */}
                                    <div className="flex gap-4 items-center"> {/* Removed mb-6 from here */}
                                        <div className="p-2 bg-[#F3EEE5] rounded-xl text-[#B08A37] group-hover:bg-[#B08A37] group-hover:text-white transition-colors duration-500 flex-shrink-0">
                                            {item.icon}
                                        </div>

                                        <h3 className="text-base font-[500] font-serif text-[#1D1B18] leading-none">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <span className="text-[10px] font-serif  text-[#B08A37]/80 tracking-widest leading-none">
                                        {item.id}
                                    </span>
                                </div>

                                <p className="text-[#6B665E] leading-relaxed text-[13px] opacity-90">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Features - Color Corrected for Light Background */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-10 py-6 border-t  border-[#E8E2D9]"
                >
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {[
                            { icon: <Leaf size={20} weight="fill" />, label: "100% Natural" },
                            { icon: <Package size={20} weight="fill" />, label: "Fresh Packed" },
                            { icon: <Flask size={20} weight="fill" />, label: "Fssai Licensed" },
                            { icon: <ShieldCheck size={20} weight="fill" />, label: "Quality Assured" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 text-[#1D1B18]/70"
                            >
                                <span className="text-[#B08A37]">{item.icon}</span>
                                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}