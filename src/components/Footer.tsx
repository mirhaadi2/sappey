import React from "react";
import { Link } from "react-router-dom";
import {
    InstagramLogo,
    FacebookLogo,
    TwitterLogo,
    EnvelopeSimple,
    Phone,
    MapPin
} from "@phosphor-icons/react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-brown text-brand-cream pt-12 pb-6 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block group">
                            <h2 className="font-headline text-3xl font-black tracking-tighter text-white">
                            SAPPEY<span className="text-orange-500 group-hover:text-orange-400 transition-colors">.COM</span>
                            </h2>
                        </Link>

                        {/* Brand Description */}
                        <p className="font-sans text-sm text-slate-200 leading-relaxed max-w-xs">
                            Connecting you directly with local farmers to deliver peak-season dry fruits, 
                            professionally vacuum-sealed and delivered from the harvest source to 
                            your doorstep.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-brand-cream/10 rounded-full hover:bg-brand-cream hover:text-brand-brown transition-all">
                                <InstagramLogo size={20} />
                            </a>
                            <a href="#" className="p-2 bg-brand-cream/10 rounded-full hover:bg-brand-cream hover:text-brand-brown transition-all">
                                <FacebookLogo size={20} />
                            </a>
                            <a href="#" className="p-2 bg-brand-cream/10 rounded-full hover:bg-brand-cream hover:text-brand-brown transition-all">
                                <TwitterLogo size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    {/* <div>
                        <h4 className="font-label text-sm uppercase tracking-widest mb-6 opacity-60">Shop Categories</h4>
                        <ul className="space-y-4 font-sans text-sm">
                            <li><Link to="/shop?category=nuts" className="hover:text-brand-latte transition-colors">Premium Nuts</Link></li>
                            <li><Link to="/shop?category=dried-fruits" className="hover:text-brand-latte transition-colors">Dried Fruits</Link></li>
                            <li><Link to="/shop?category=seeds" className="hover:text-brand-latte transition-colors">Organic Seeds</Link></li>
                            <li><Link to="/shop?category=mixes" className="hover:text-brand-latte transition-colors">Healthy Mixes</Link></li>
                        </ul>
                    </div> */}

                    {/* Support */}
                    <div>
                        <h4 className="font-label text-sm uppercase tracking-widest mb-6 opacity-60">Customer Support</h4>
                        <ul className="space-y-4 font-sans text-sm">
                            <li><Link to="/about-us" className="hover:text-brand-latte transition-colors">About Us</Link></li>
                            <li><Link to="/shipping-policy" className="hover:text-brand-latte transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns-refunds" className="hover:text-brand-latte transition-colors">Returns & Refunds</Link></li>
                            <li><Link to="/faqs" className="hover:text-brand-latte transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-label text-sm uppercase tracking-widest mb-6 opacity-60">Get In Touch</h4>
                        <ul className="space-y-4 font-sans text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-brand-latte opacity-70 shrink-0" />
                                <span className="opacity-80">Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-brand-latte opacity-70 shrink-0" />
                                <span className="opacity-80">+91 0000000000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <EnvelopeSimple size={20} className="text-brand-latte opacity-70 shrink-0" />
                                <span className="opacity-80">sappay4@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright Information */}
                    <p className="font-sans text-xs text-slate-200 font-medium tracking-wide">
                        © 2026 <span className="text-slate-300">Sappey Premium Harvest.</span> All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-200">
                        <Link 
                            to="/privacy-policy" 
                            className="hover:text-orange-500 transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <Link 
                            to="/terms-and-conditions" 
                            className="hover:text-orange-500 transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                        <Link 
                            to="/sitemap" 
                            className="hover:text-orange-500 transition-colors duration-200"
                        >
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;