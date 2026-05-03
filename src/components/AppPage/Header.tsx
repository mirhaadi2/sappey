import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass, User, ShoppingCart, List, X, Heart, SpinnerGap, SignOut, CaretRight, ArrowRight
} from "@phosphor-icons/react";
import { useCart } from "../../context/CardContext";
import { useWebsiteAuth } from "../../context/WebsiteAuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProductSearch } from "../../api/products";
import { useHomepageData } from "../../api/homepage";
import { useHomepagePromotions } from "../../api/promotions";
import { Product } from "../../types";

const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Bulk Order", href: "/bulk-order" },
    { label: "Our Story", href: "/#story" },
    { label: "Contact", href: "/#contact" },
];

const Header: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const { totalItems, dispatch } = useCart();
    const {
        currentUser,
        isGuestAuthenticated,
        guestDisplayName,
        openAuthModal,
        signOut,
        logout: customerLogout
    } = useWebsiteAuth();
    const { wishlistCount } = useWishlist();

    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = Boolean(currentUser || isGuestAuthenticated);
    const displayName = currentUser?.name?.split(" ")[0] || currentUser?.email?.split(" ")[0] || guestDisplayName || "Guest";

    const { results: searchResults, isLoading: isSearching } = useProductSearch(debouncedSearchQuery);
    const { data: homepageData } = useHomepageData();
    const { data: promotions } = useHomepagePromotions();

    const activeBanner = homepageData?.banners?.find((b) => b?.isActive);
    const activePromotion = promotions?.[0];
    const hasTopBanner = !!(activePromotion || activeBanner);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (searchQuery.trim().length >= 2) {
            debounceTimer.current = setTimeout(() => {
                setDebouncedSearchQuery(searchQuery.trim());
            }, 300);
        } else {
            setDebouncedSearchQuery("");
        }
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, [searchQuery]);

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

    const scrollToSection = useCallback((sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        const state = location.state as { scrollToId?: string } | null;
        if (state?.scrollToId) {
            const timeout = window.setTimeout(() => scrollToSection(state.scrollToId!), 200);
            return () => window.clearTimeout(timeout);
        }
    }, [location, scrollToSection]);

    const handleNavClick = useCallback((href: string) => {
        setMobileOpen(false);
        if (href.startsWith('/#')) {
            const sectionId = href.replace('/#', "");
            if (location.pathname !== "/") {
                navigate("/", { state: { scrollToId: sectionId } });
            } else {
                scrollToSection(sectionId);
            }
        } else {
            navigate(href);
        }
    }, [location.pathname, navigate, scrollToSection]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) closeSearch();
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        if (searchOpen || profileOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchOpen, profileOpen, closeSearch]);

    const handleLogout = useCallback(async () => {
        currentUser ? await customerLogout() : await signOut();
        setProfileOpen(false);
        navigate("/");
    }, [currentUser, customerLogout, signOut, navigate]);

    return (
        <>
            <AnimatePresence>
                {hasTopBanner && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-[70] bg-brand-brown text-[#F9F6F0] h-10 flex items-center justify-center overflow-hidden"
                        initial={{ y: -40 }}
                        animate={{ y: 0 }}
                        exit={{ y: -40 }}
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
                        <p className="text-[10px] font-[800] tracking-[0.2em] uppercase relative z-10">
                            {activePromotion?.bannerText ?? activeBanner?.text}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <header
                className={`fixed left-0 right-0 transition-all duration-700 z-[60] 
                    ${hasTopBanner ? "top-10" : "top-0"} 
                    ${scrolled
                        ? "bg-white/90 backdrop-blur-xl border-b border-black/5 h-20 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
                        : "bg-transparent h-16"
                    }`}
            >
                <div className="max-w-[1440px] mx-auto h-full px-2 md:px-12 flex items-center justify-between">

                    {/* Brand Identity */}
                    <div className="flex-1">
                        <Link to="/" className="inline-block transform transition-transform duration-500 hover:scale-105">
                            <img
                                src="/images/sappey-logo-4.png"
                                alt="SAPPEY"
                                className={`transition-all duration-700 object-contain ${scrolled ? 'h-14' : 'h-12'}`}
                            />
                        </Link>
                    </div>

                    {/* Navigation - High End Editorial Style */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavClick(link.href)}
                                    className="group relative py-2"
                                >
                                    <span className={`text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300
                                        ${isActive
                                            ? "text-brand-brown/60"
                                            : "text-brand-brown group-hover:text-brand-brown/60"
                                        }`}>
                                        {link.label}
                                    </span>

                                    {/* The premium underline transition */}
                                    <motion.span
                                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-brown origin-left"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isActive ? 1 : 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Action Hub */}
                    <div className="flex-1 flex items-center justify-end gap-[0.1rem] md:gap-3">
                        <div ref={searchRef} className="relative">
                            <AnimatePresence mode="wait">
                                {searchOpen ? (
                                    <motion.form
                                        key="search-box"
                                        onSubmit={handleSearchSubmit}
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 280, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="flex items-center bg-[#F9F6F0] rounded-full border border-brand-brown/10 px-4 py-2 w-full max-w-[280px]"
                                    >
                                        <MagnifyingGlass size={18} className="text-brand-brown/40" />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search our collection..."
                                            className="bg-transparent w-full pl-3 text-[12px] font-medium text-brand-brown placeholder-brand-brown/30 outline-none"
                                        />
                                        <button type="button" onClick={closeSearch}>
                                            <X size={16} className="text-brand-brown/40 hover:text-brand-brown" />
                                        </button>
                                    </motion.form>
                                ) : (
                                    <button
                                        onClick={openSearch}
                                        className="p-3 hover:bg-brand-brown/5 rounded-full transition-colors"
                                    >
                                        <MagnifyingGlass size={22} weight="light" className="text-brand-brown" />
                                    </button>
                                )}
                            </AnimatePresence>

                            {/* Luxury Search Results Dropdown */}
                            <AnimatePresence>
                                {searchOpen && debouncedSearchQuery && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-4 right-0 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 w-full max-w-[min(100vw-2rem,380px)] rounded-2xl overflow-hidden z-[80]"
                                    >
                                        <div className="p-4 border-b border-black/5 bg-[#F9F6F0]/50">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-brown/40">Results for "{debouncedSearchQuery}"</h4>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {isSearching ? (
                                                <div className="p-12 flex justify-center"><SpinnerGap size={24} className="animate-spin text-brand-brown/20" /></div>
                                            ) : searchResults.length > 0 ? (
                                                searchResults.slice(0, 5).map((product: Product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => { navigate(`/products/${product.slug}`); closeSearch(); }}
                                                        className="w-full p-4 flex items-center gap-4 hover:bg-[#F9F6F0] transition-colors group text-left"
                                                    >
                                                        <img src={product.images?.[0]} className="w-14 h-14 object-cover rounded-lg bg-gray-50" alt="" />
                                                        <div className="flex-1">
                                                            <p className="text-[13px] font-bold text-brand-brown">{product.name}</p>
                                                            <p className="text-[11px] text-brand-brown/50 uppercase tracking-tighter">{product.category}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-brand-brown/40 text-[12px]">No products found.</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={() => navigate("/wishlist")} className="p-3 hover:bg-brand-brown/5 rounded-full relative transition-colors">
                            <Heart size={22} weight={wishlistCount > 0 ? "fill" : "light"} className={wishlistCount > 0 ? "text-red-500" : "text-brand-brown"} />
                        </button>

                        <button onClick={() => dispatch({ type: "OPEN_CART" })} className="p-3 hover:bg-brand-brown/5 rounded-full relative transition-colors group">
                            <ShoppingCart size={22} weight="light" className="text-brand-brown" />
                            {totalItems > 0 && (
                                <span className="absolute top-2 right-2 bg-brand-brown text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <div className="hidden md:block h-6 w-[1px] bg-brand-brown/10 mx-2" />

                        <div className="relative" ref={profileRef}>
                            {isLoggedIn ? (
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-brand-brown/5 transition-all"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-brown">{displayName}</span>
                                    <div className="w-8 h-8 rounded-full bg-brand-brown text-white flex items-center justify-center text-[11px] font-bold">
                                        {displayName.charAt(0)}
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => openAuthModal("customer")}
                                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-brown px-5 py-2 hover:bg-brand-brown hover:text-white border border-brand-brown/20 transition-all duration-500 rounded-full"
                                >
                                    Login
                                </button>
                            )}

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-4 right-0 bg-white shadow-2xl rounded-2xl border border-black/5 w-52 p-2 z-[90]"
                                    >
                                        <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full p-3 text-left text-[12px] font-bold text-brand-brown hover:bg-[#F9F6F0] rounded-xl flex items-center gap-3 transition-colors">
                                            <User size={18} weight="light" /> My Account
                                        </button>
                                        <button onClick={handleLogout} className="w-full p-3 text-left text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors">
                                            <SignOut size={18} weight="light" /> Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="lg:hidden p-3 text-brand-brown" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - OUTSIDE header for proper fixed positioning */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* 1. Added a Backdrop for depth - helps the menu feel "layered" */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] lg:hidden"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            // 2. Refined transition: Slightly snappier for navigation feel
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            /* 
                               3. Safety Fixes:
                               - Changed 'inset-0' to 'top-0 right-0 w-[85%] sm:w-[400px]' 
                                 Full-screen menus can feel claustrophobic; a partial slide-out is more modern.
                               - Added 'pb-[safe-area-inset-bottom]' logic via padding classes.
                            */
                            className="fixed top-0 right-0 w-full h-[100dvh] bg-white z-[100] flex flex-col shadow-2xl lg:hidden overflow-hidden"
                        >
                            {/* Header: Added 'pt-safe' (if using tailwind-safe-area) or extra top padding for notch safety */}
                            <div className="flex justify-between items-center p-6 pt-10 border-b border-brand-brown/5">
                                <img
                                    src="/images/sappey-logo-4.png"
                                    alt="SAPPEY"
                                    className="h-10 md:h-12 w-auto object-contain"
                                />
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 rounded-full bg-slate-50 text-brand-brown active:scale-90 transition-all"
                                >
                                    <X size={24} weight="bold" />
                                </button>
                            </div>

                            {/* Links: Added staggered animation for that "Premium" feel */}
                            <div className="flex-1 overflow-y-auto px-6">
                                <nav className="flex flex-col space-y-2">
                                    {navLinks.map((link, i) => (
                                        <motion.button
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            key={link.label}
                                            onClick={() => handleNavClick(link.href)}
                                            className="w-full py-2 text-md font-medium text-brand-brown flex justify-between items-center group active:opacity-60 transition-all border-b border-brand-brown/5"
                                        >
                                            <span className="tracking-tight">{link.label}</span>
                                            <CaretRight size={20} className="text-brand-brown/30" />
                                        </motion.button>
                                    ))}
                                </nav>
                            </div>

                            {/* Footer: Sticky bottom with safe area padding */}
                            <div className="mt-auto p-6 bg-slate-50/50 pb-10">
                                {!isLoggedIn && (
                                    <button
                                        onClick={() => { openAuthModal("customer"); setMobileOpen(false); }}
                                        className="w-full py-4 bg-brand-brown text-white font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg active:scale-[0.98] transition-all mb-6"
                                    >
                                        Member Login
                                    </button>
                                )}
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-brand-brown/40 font-bold">
                                        Direct From Source • Premium Selection
                                    </p>
                                    <div className="w-8 h-1 bg-brand-brown/10 mx-auto rounded-full mt-4" />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* SPACER: Height matches the default header (h-16) + banner (h-10) to avoid content jump */}
            <div className={`transition-all duration-700 ${hasTopBanner ? "h-[calc(64px+40px)]" : "h-16"}`} />
        </>
    );
};

export default memo(Header);