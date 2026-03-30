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
        <footer className="bg-brand-brown text-brand-cream pt-20 pb-10 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <h2 className="font-headline text-3xl font-bold tracking-tight">NUTRI<span className="text-brand-latte opacity-80">HAVEN</span></h2>
                        </Link>
                        <p className="font-sans text-sm opacity-70 leading-relaxed max-w-xs">
                            Sourcing the finest dry fruits, nuts, and seeds from around the globe to bring premium nutrition directly to your doorstep.
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
                    <div>
                        <h4 className="font-label text-sm uppercase tracking-widest mb-6 opacity-60">Shop Categories</h4>
                        <ul className="space-y-4 font-sans text-sm">
                            <li><Link to="/shop?category=nuts" className="hover:text-brand-latte transition-colors">Premium Nuts</Link></li>
                            <li><Link to="/shop?category=dried-fruits" className="hover:text-brand-latte transition-colors">Dried Fruits</Link></li>
                            <li><Link to="/shop?category=seeds" className="hover:text-brand-latte transition-colors">Organic Seeds</Link></li>
                            <li><Link to="/shop?category=mixes" className="hover:text-brand-latte transition-colors">Healthy Mixes</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-label text-sm uppercase tracking-widest mb-6 opacity-60">Customer Support</h4>
                        <ul className="space-y-4 font-sans text-sm">
                            <li><Link to="/about" className="hover:text-brand-latte transition-colors">About Us</Link></li>
                            <li><Link to="/shipping" className="hover:text-brand-latte transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="hover:text-brand-latte transition-colors">Returns & Refunds</Link></li>
                            <li><Link to="/faqs" className="hover:text-brand-latte transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-label text-sm uppercase tracking-widest mb-6 opacity-60">Get In Touch</h4>
                        <ul className="space-y-4 font-sans text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-brand-latte opacity-70 shrink-0" />
                                <span className="opacity-80">123 Nutri Lane, Wellness District, Mumbai, MH 400001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-brand-latte opacity-70 shrink-0" />
                                <span className="opacity-80">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <EnvelopeSimple size={20} className="text-brand-latte opacity-70 shrink-0" />
                                <span className="opacity-80">hello@nutrihaven.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-brand-cream/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="font-sans text-xs opacity-50">
                        © 2024 NutriHaven Premium Dry Fruits. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 opacity-50 font-sans text-xs">
                        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link to="/terms" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;