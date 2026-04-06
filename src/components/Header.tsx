import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, User, ShoppingCart, List, X, SignOut, Heart } from "@phosphor-icons/react";
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
    const { user, signOut, openAuthModal } = useAuth();
    const { wishlistCount } = useWishlist();
    
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const activeCategory = searchParams.get("category") || "all";
    const { products } = useProducts(
        activeCategory !== "all" ? { categoryId: activeCategory } : undefined
    );
    const { data: homepageData } = useHomepageData();
    const { data: promotions } = useHomepagePromotions();

    const activeBanner = homepageData?.banners?.find((b) => b?.isActive);
    const activePromotion = promotions?.[0];
    const hasTopBanner = !!(activePromotion || activeBanner);

    const searchResults = useMemo(() => {
        const query = searchQuery?.trim()?.toLowerCase();
        if (!query || query.length < 2) return [];
        
        return (products ?? [])
            .filter((p: Product) =>
                p?.name?.toLowerCase().includes(query) ||
                p?.category?.toLowerCase().includes(query)
            )
            .slice(0, 6);
    }, [searchQuery, products]);

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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
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

    return (
        <>
            {/* 1. Promo Banner - Height is h-8 (32px) */}
            <AnimatePresence>
                {hasTopBanner && (
                    <motion.div 
                        className="fixed top-0 left-0 right-0 z-50 bg-brand-brown text-brand-cream text-center py-2 px-4 font-label text-[10px] tracking-[0.2em] uppercase w-full h-8"
                        initial={{ opacity: 0, y: -32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -32 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activePromotion?.bannerText ?? activeBanner?.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Main Header - Height is h-16 (64px) */}
            <header
                className={`fixed left-0 right-0 transition-all duration-300 z-40 h-16 
                    ${hasTopBanner ? "top-8" : "top-0"} 
                    ${scrolled 
                        ? "bg-brand-cream/95 backdrop-blur-md border-b border-gray-300 shadow-sm" 
                        : "bg-brand-cream border-b border-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-full">
                    
                    {/* ZONE 1: LOGO */}
                    <div className="flex-1">
                        <Link
                            to="/"
                            className="font-headline font-bold text-2xl text-brand-brown tracking-tighter hover:opacity-80 transition-opacity"
                        >
                            Sappey
                        </Link>
                    </div>

                    {/* ZONE 2: CENTER NAV */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavClick(link.href)}
                                className={`font-label text-xs uppercase tracking-widest px-5 py-2 rounded-full transition-all duration-300
                                    ${location.pathname === link.href 
                                        ? "text-brand-brown font-bold bg-brand-latte" 
                                        : "text-brand-brown hover:bg-brand-latte/60"
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* ZONE 3: ACTIONS */}
                    <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                        
                        {/* Search */}
                        <div ref={searchRef} className="relative flex items-center">
                            <AnimatePresence mode="wait">
                                {searchOpen ? (
                                    <motion.form
                                        key="search-active"
                                        onSubmit={handleSearchSubmit}
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 240, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="flex items-center bg-white border border-gray-400 rounded-full overflow-hidden shadow-inner"
                                    >
                                        <MagnifyingGlass className="ml-3 text-brand-brown" size={16} />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search collection..."
                                            className="flex-1 bg-transparent font-label text-xs text-brand-brown font-medium placeholder-gray-500 px-2 py-2 focus:outline-none"
                                        />
                                        <button type="button" onClick={closeSearch} className="p-2 text-brand-brown hover:text-black">
                                            <X size={14} />
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.button
                                        key="search-trigger"
                                        onClick={openSearch}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-2 text-brand-brown hover:bg-brand-latte rounded-full transition-colors"
                                    >
                                        <MagnifyingGlass size={22} weight="bold" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Account */}
                        <div className="hidden sm:flex items-center border-l border-gray-300 ml-2 pl-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-latte text-brand-brown hover:bg-brand-brown hover:text-brand-cream transition-all duration-300"
                                    >
                                        <User size={18} weight="fill" />
                                        <span className="text-[10px] uppercase tracking-widest font-black">
                                            {user?.name?.split(" ")[0] || "Profile"}
                                        </span>
                                    </button>
                                    <button onClick={() => signOut()} className="p-2 text-brand-brown hover:opacity-70 transition-colors">
                                        <SignOut size={18} weight="bold" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => openAuthModal("signin")}
                                    className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown hover:opacity-60 transition-opacity"
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Wishlist & Cart */}
                        <div className="flex items-center gap-1">
                            <button onClick={() => navigate("/wishlist")} className="relative p-2 text-brand-brown hover:bg-brand-latte rounded-full">
                                <Heart size={22} weight={wishlistCount > 0 ? "fill" : "bold"} className={wishlistCount > 0 ? "text-red-600" : ""} />
                            </button>

                            <button onClick={() => dispatch({ type: "OPEN_CART" })} className="relative p-2 text-brand-brown hover:bg-brand-latte rounded-full">
                                <ShoppingCart size={22} weight="bold" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-brand-brown text-brand-cream text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-brand-cream shadow-md">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            <button className="md:hidden p-2 text-brand-brown" onClick={() => setMobileOpen(!mobileOpen)}>
                                {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* 3. Spacer - Prevents layout jumping */}
            {/* Transition duration matches the header slide duration */}
            <div 
                className={`transition-all duration-300 ${hasTopBanner ? "h-24" : "h-16"}`} 
            />
        </>
    );
};

export default memo(Header);