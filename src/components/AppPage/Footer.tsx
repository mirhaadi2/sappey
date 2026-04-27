import React from "react";
import { Link } from "react-router-dom";
import {
    InstagramLogo,
    TwitterLogo,
    EnvelopeSimple,
    Phone,
    MapPin,
    LinkedinLogo
} from "@phosphor-icons/react";

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-brand-brown text-brand-cream pt-20 pb-10 px-6 overflow-hidden">
            {/* Subtle Decorative Gradient for Depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-latte/30 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

                    {/* Brand Section - Takes 5 columns for prominence */}
                    <div className="lg:col-span-5 space-y-8">
                        <Link to="/" className="inline-block group">
                            <h2 className="font-headline text-4xl font-black tracking-tighter text-white">
                                SAPPEY<span className="text-orange-500 group-hover:text-orange-400 transition-all duration-300">.COM</span>
                            </h2>
                        </Link>

                        <p className="font-sans text-base text-slate-300/90 leading-relaxed max-w-md">
                            Bridging the gap between Himalayan orchards and your home. We deliver
                            <span className="text-white"> peak-season dry fruits</span>, vacuum-sealed
                            at the source to preserve absolute freshness and nutritional integrity.
                        </p>

                        <div className="flex items-center gap-3">
                            {[
                                { icon: <InstagramLogo size={22} />, href: "https://www.instagram.com/sappeyofficial?igsh=MTZqMm96anpkM3o2cQ==" },
                                // { icon: <FacebookLogo size={22} />, href: "https://www.facebook.com/sappey" },
                                { icon: <TwitterLogo size={22} />, href: "https://twitter.com/sappey" },
                                { icon: <LinkedinLogo size={22} />, href: "https://www.linkedin.com/company/sappey/" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 shadow-xl"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid - Takes 7 columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Quick Shop */}
                        <div>
                            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-8">
                                Collections
                            </h4>
                            <ul className="space-y-4 font-sans text-sm">
                                {["Premium Nuts", "Dried Fruits", "Organic Seeds", "Healthy Mixes"].map((item) => (
                                    <li key={item}>
                                        <Link to="/" className="text-slate-300 hover:text-white flex items-center group transition-colors">
                                            <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-orange-500">—</span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-8">
                                Assistance
                            </h4>
                            <ul className="space-y-4 font-sans text-sm">
                                {[
                                    { name: "About Us", path: "/about-us" },
                                    { name: "Shipping Policy", path: "/shipping-policy" },
                                    { name: "Returns & Refunds", path: "/returns-refunds" },
                                    { name: "FAQs", path: "/faqs" }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-slate-300 hover:text-white transition-colors italic-hover">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-8">
                                Office
                            </h4>
                            <ul className="space-y-5 font-sans text-sm">
                                <li className="flex items-start gap-4 group">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                        <MapPin size={18} className="text-orange-500" />
                                    </div>
                                    <span className="text-slate-300 leading-snug">Jammu & Kashmir,<br />India</span>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                        <Phone size={18} className="text-orange-500" />
                                    </div>
                                    <span className="text-slate-300">+91 8492943652</span>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                        <EnvelopeSimple size={18} className="text-orange-500" />
                                    </div>
                                    <a
                                        href="mailto:support@sappey.com?subject=Inquiry regarding Sappey Products"
                                        className="text-slate-300 hover:text-orange-500 transition-colors"
                                    >
                                        support@sappey.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Enhanced with Glassmorphism effect */}
                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-1 text-center md:text-left">
                        <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
                            © 2026 Sappey Foods Private Limited.
                        </p>
                        <p className="text-[10px] text-slate-500 italic">Crafting health, one harvest at a time.</p>
                    </div>

                    <div className="flex items-center gap-6 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/5 shadow-inner">
                        {[
                            { name: "Privacy", path: "/privacy-policy" },
                            { name: "Terms", path: "/terms-and-conditions" },
                            { name: "Sitemap", path: "/sitemap" }
                        ].map((legal) => (
                            <Link
                                key={legal.name}
                                to={legal.path}
                                className="text-[10px] uppercase tracking-widest font-bold text-slate-300 hover:text-orange-500 transition-colors"
                            >
                                {legal.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;