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
        <footer id="contact" className="relative bg-brand-brown text-brand-cream py-8 px-6 overflow-hidden">
            {/* Top Gradient Divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-latte/30 to-transparent" />

            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8">

                    {/* Brand Section (Left side) */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link to="/" className="inline-block group">
                            <p className="font-serif text-3xl tracking-tighter text-white">
                                SAPPEY
                            </p>
                        </Link>

                        <p className="font-sans text-base text-slate-300/90 leading-relaxed">
                            Premium dry fruits sourced directly from trusted farmers and packed with freshness, purity, and uncompromising quality.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* FSSAI Integration */}
                            <div className="flex items-center gap-4 py-4 px-5 bg-white/5 rounded-2xl border border-white/10 w-fit">
                                <img
                                    src="/images/fssai-logo.png"
                                    alt="FSSAI Licensed"
                                    className="h-8 w-auto brightness-0 invert opacity-80"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">Lic. No.</span>
                                    <span className="text-xs font-mono text-slate-300 tracking-wider">21026251000320</span>
                                </div>
                            </div>

                            
                            {/* Social Media */}
                            <div className="flex items-center gap-3 pt-1">
                                {[
                                    { icon: <InstagramLogo size={20} />, href: "https://www.instagram.com/sappeyofficial" },
                                    { icon: <TwitterLogo size={20} />, href: "https://twitter.com/sappey" },
                                    { icon: <LinkedinLogo size={20} />, href: "https://www.linkedin.com/company/sappey/" }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side Links & Contact Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
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
                                            <Link to={link.path} className="text-slate-300 hover:text-white transition-colors">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Office & Contact - Expanded to handle larger content */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-8">
                                        Contact Us
                                    </h4>
                                    <div className="space-y-6">
                                        {/* Address Block */}
                                        {/* Phone & Email */}
                                        <div className="space-y-3 ">
                                            <div className="flex items-center gap-4 group">
                                                <div className="shrink-0 p-2 h-fit bg-white/5 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                                    <Phone size={18} className="text-orange-500" />
                                                </div>
                                                <span className="text-sm text-slate-300">+91 8492943652</span>
                                            </div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="shrink-0 p-2 h-fit bg-white/5 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                                    <EnvelopeSimple size={18} className="text-orange-500" />
                                                </div>
                                                <a
                                                    href="mailto:support@sappey.com"
                                                    className="text-sm text-slate-300 hover:text-orange-500 transition-colors"
                                                >
                                                    support@sappey.com
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group ">
                                            <div className="shrink-0 p-2 h-fit bg-white/5 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                                                <MapPin size={18} className="text-orange-500" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h5 className="text-white font-bold text-xs uppercase tracking-wider">Registered Office</h5>
                                                <address className="not-italic text-slate-300 leading-relaxed text-sm">
                                                    Malik Market, GTB Nagar, <br />
                                                    Channi Rama, Jammu, <br />
                                                    Jammu & Kashmir — 180015
                                                </address>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-1 text-center md:text-left">
                        <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-slate-300 font-bold">
                            © 2026 Sappey Foods Private Limited.
                        </p>
                        <p className="text-[10px] text-slate-400 italic">Crafting health, one harvest at a time.</p>
                    </div>

                    <div className="flex items-center gap-6 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/5 shadow-inner">
                        {["Privacy", "Terms", "Sitemap"].map((name) => (
                            <Link
                                key={name}
                                to={`/${name.toLowerCase()}-policy`}
                                className="text-[10px] uppercase tracking-widest font-bold text-slate-300 hover:text-orange-500 transition-colors"
                            >
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;