import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass, User, ShoppingCart, List, X, Heart
} from "@phosphor-icons/react";
import { useCart } from "../context/CardContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../api/products";
import { useHomepageData } from "../api/homepage";
import { useHomepagePromotions } from "../api/promotions";
import { Product } from "../types";

const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Story", href: "/#story" },
    { label: "Recipes", href: "/#recipes" },
    { label: "Contact", href: "/#contact" },
];

const Header: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { totalItems, dispatch } = useCart();
    const { user, openAuthModal } = useAuth();
    const { wishlistCount } = useWishlist();

    const location = useLocation();
    const navigate = useNavigate();

    // API Hooks - Fetch ALL products for search (not filtered by category)
    const { products: allProducts } = useProducts(); // No category filter for search
    const { data: homepageData } = useHomepageData();
    const { data: promotions } = useHomepagePromotions();

    // Banner Logic
    const activeBanner = homepageData?.banners?.find((b) => b?.isActive);
    const activePromotion = promotions?.[0];
    const hasTopBanner = !!(activePromotion || activeBanner);

    // Search Filtering - Search across ALL products, not just category
    const searchResults = useMemo(() => {
        const query = searchQuery?.trim()?.toLowerCase();
        if (!query || query.length < 2) return [];

        return (allProducts ?? [])
            .filter((p: Product) =>
                p?.name?.toLowerCase().includes(query) ||
                p?.description?.toLowerCase().includes(query) ||
                p?.category?.toLowerCase().includes(query)
            )
            .slice(0, 8); // Show 8 results
    }, [searchQuery, allProducts]);

    // Handlers
    const openSearch = useCallback(() => {
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const closeSearch = useCallback(() => {
        setSearchOpen(false);
        setSearchQuery("");
    }, []);

    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            closeSearch();
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    }, [searchQuery, navigate, closeSearch]);

    const handleNavClick = useCallback((href: string) => {
        setMobileOpen(false);
        if (href.startsWith('/#')) {
            const sectionId = href.replace('/#', "");
            if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
                }, 300);
            } else {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate(href);
        }
    }, [location.pathname, navigate]);

    // Effects
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                closeSearch();
            }
        };
        if (searchOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchOpen, closeSearch]);

    return (
        <>
            {/* 1. TOP PROMO BANNER */}
            <AnimatePresence>
                {hasTopBanner && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-[60] bg-brand-brown text-brand-cream text-center flex items-center justify-center font-label text-[9px] tracking-[0.25em] uppercase w-full h-8 overflow-hidden"
                        initial={{ opacity: 0, y: -32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -32 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Premium Animated Shine Effect */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 skew-x-12"
                        />
                        <span className="relative z-10 font-bold">
                            {activePromotion?.bannerText ?? activeBanner?.text}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. MAIN HEADER NAVIGATION */}
            <header
                className={`fixed left-0 right-0 transition-all duration-500 z-50 h-16 
                    ${hasTopBanner ? "top-8" : "top-0"} 
                    ${scrolled
                        ? "bg-white/80 backdrop-blur-xl border-b border-brand-brown/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                        : "bg-brand-cream border-b border-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-full">

                    {/* LOGO ZONE */}
                    <div className="flex-1">
                        <Link
                            to="/"
                            className="group flex items-center gap-2.5 font-headline font-black text-2xl text-brand-brown tracking-tighter transition-all duration-300"
                        >
                            <div className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center text-brand-cream text-xs group-hover:rotate-6 transition-transform">
                                S
                            </div>
                            <span className="hidden sm:inline-block">Sappey</span>
                        </Link>
                    </div>

                    {/* CENTER NAVIGATION (Desktop) */}
                    <nav className="hidden md:flex items-center bg-brand-brown/[0.03] p-1 rounded-full border border-brand-brown/5">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavClick(link.href)}
                                    className={`relative font-label text-[10px] uppercase tracking-[0.18em] px-6 py-2 rounded-full transition-all duration-500
                                        ${isActive ? "text-brand-cream" : "text-brand-brown/80 hover:text-brand-brown"}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active-pill"
                                            className="absolute inset-0 bg-brand-brown rounded-full shadow-lg shadow-brand-brown/20"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 font-black">{link.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* ACTIONS ZONE (Search, Account, Cart) */}
                    <div className="flex-1 flex items-center justify-end gap-1 md:gap-3 ml-2">

                        {/* Premium Search Bar */}
                        <div ref={searchRef} className="relative flex items-center justify-end">
                            <AnimatePresence mode="wait">
                                {searchOpen ? (
                                    <motion.form
                                        key="search-active"
                                        onSubmit={handleSearchSubmit}
                                        initial={{ width: 60, opacity: 0, x: 20 }}
                                        animate={{ width: 280, opacity: 1, x: 0 }}
                                        exit={{ width: 60, opacity: 0, x: 20 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        className="flex items-center bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.03] overflow-hidden"
                                    >
                                        <div className="pl-4 pr-2 text-brand-brown/40">
                                            <MagnifyingGlass size={18} weight="bold" />
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search our collection..."
                                            className="flex-1 bg-transparent font-label text-[12px] text-brand-brown font-bold placeholder-brand-brown/20 py-2.5 focus:outline-none"
                                        />
                                        <motion.button
                                            whileHover={{ rotate: 90 }}
                                            type="button"
                                            onClick={closeSearch}
                                            className="p-2 mr-1 text-brand-brown/30 hover:text-brand-brown transition-colors"
                                        >
                                            <X size={16} weight="bold" />
                                        </motion.button>
                                    </motion.form>
                                ) : (
                                    <motion.button
                                        key="search-trigger"
                                        layoutId="search-pill"
                                        onClick={openSearch}
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: "rgba(255,255,255,0.9)",
                                            boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-brand-brown hover:text-brand-brown rounded-full transition-all duration-300 bg-white/0"
                                    >
                                        <MagnifyingGlass size={18} weight="bold" />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchOpen && searchResults.length > 0 && (
                                    <motion.div
                                        key="search-results"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-brown/10 shadow-lg overflow-hidden z-50 w-80"
                                    >
                                        {searchResults.map((product: Product) => (
                                            <motion.button
                                                key={product.id}
                                                onClick={() => {
                                                    navigate(`/product/${product.id}`);
                                                    closeSearch();
                                                }}
                                                whileHover={{ backgroundColor: "rgba(139, 115, 85, 0.05)" }}
                                                className="w-full px-4 py-3 text-left flex items-center gap-3 border-b border-brand-brown/5 last:border-0 transition-colors"
                                            >
                                                <img
                                                    src={product.images?.[0] || "/placeholder.png"}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-brand-brown truncate">{product.name}</p>
                                                    <p className="text-[10px] text-brand-brown/60 truncate">{product.category}</p>
                                                </div>
                                                <p className="text-xs font-black text-brand-brown whitespace-nowrap">SAR {product.price?.toFixed(2)}</p>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile/Account Button */}
                        <div className="hidden sm:flex items-center">
                            {user ? (
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="group flex items-center gap-2 pl-1 pr-4 py-1 rounded-full bg-white border border-brand-brown/10 hover:border-brand-brown transition-all duration-300"
                                >
                                    <div className="w-7 h-7 rounded-full bg-brand-latte flex items-center justify-center text-brand-brown group-hover:bg-brand-brown group-hover:text-white transition-colors">
                                        <User size={14} weight="fill" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-brand-brown">
                                        {user?.name?.split(" ")[0]}
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => openAuthModal("signin")}
                                    className="px-5 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown border border-brand-brown/10 hover:bg-brand-brown hover:text-white transition-all duration-300"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Icons Stack */}
                        <div className="flex items-center gap-1">
                            <button onClick={() => navigate("/wishlist")} className="p-2.5 text-brand-brown hover:bg-white hover:shadow-sm rounded-xl transition-all">
                                <Heart size={22} weight={wishlistCount > 0 ? "fill" : "bold"} className={wishlistCount > 0 ? "text-red-500" : ""} />
                            </button>

                            <button onClick={() => dispatch({ type: "OPEN_CART" })} className="group relative p-2.5 text-brand-brown hover:bg-white hover:shadow-sm rounded-xl transition-all">
                                <ShoppingCart size={22} weight="bold" />
                                {totalItems > 0 && (
                                    <span className="absolute top-1.5 right-1.5 bg-brand-brown text-brand-cream text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm group-hover:scale-110 transition-transform">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Trigger */}
                            <button className="md:hidden p-2 text-brand-brown ml-1" onClick={() => setMobileOpen(!mobileOpen)}>
                                {mobileOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. DYNAMIC SPACER 
          Ensures the rest of the page doesn't go under the fixed header. 
          Height changes based on whether the Top Banner is visible. */}
            <div className={`transition-all duration-500 ease-in-out ${hasTopBanner ? "h-24" : "h-16"}`} />
        </>
    );
};

export default memo(Header);