import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, User, ShoppingCart, List, X, SignOut } from "@phosphor-icons/react";
import { useCart } from "../context/CardContext";
import { useAuth } from "../context/AuthContext";
import { products } from "../data/products";

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
    const location = useLocation();
    const navigate = useNavigate();

    const searchResults = searchQuery?.trim()?.length > 0
        ? products?.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )?.slice(0, 6)
        : [];

    const openSearch = () => {
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };

    const handleSearchSelect = (productId: string) => {
        closeSearch();
        navigate(`/product/${productId}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            closeSearch();
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Handle scroll state for header styling
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                closeSearch();
            }
        };
        if (searchOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [searchOpen]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const isActive = (href: string) => {
        if (href === "/shop") return location.pathname === "/shop";
        return false;
    };

    const handleNavClick = (href: string) => {
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
    };

    return (
        <>
            <div className="bg-brand-brown text-brand-cream text-center py-2 px-4 font-label text-xs tracking-widest uppercase">
                Free shipping on orders over $49 &nbsp;|&nbsp; Use code KRUNCHO10 for 10% off
            </div>

            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    scrolled ? "bg-brand-cream border-b border-gray-200 shadow-sm" : "bg-brand-cream"
                }`}
            >
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
                    <Link
                        to="/"
                        className="font-headline font-700 text-2xl text-brand-brown tracking-tight hover:text-brand-cocoa transition-colors duration-200"
                        style={{ fontWeight: 700, letterSpacing: "-0.025em" }}
                    >
                        Kruncho
                    </Link>

                    <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
                        {navLinks.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => handleNavClick(item.href)}
                                className={`font-label text-sm px-5 py-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive(item.href) ?
                                    "text-brand-brown font-500 bg-brand-latte" :
                                    "text-brand-brown hover:text-brand-cocoa hover:bg-brand-latte"
                                    }`}
                                style={{ fontWeight: isActive(item.href) ? 500 : 400 }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <div ref={searchRef} className="relative">
                            <AnimatePresence>
                                {searchOpen ? (
                                    <motion.form
                                        key="search-box"
                                        onSubmit={handleSearchSubmit}
                                        initial={{ width: 40, opacity: 0 }}
                                        animate={{ width: 200, opacity: 1 }}
                                        exit={{ width: 40, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="flex items-center bg-brand-latte border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <MagnifyingGlass className="ml-3 text-gray-400 flex-shrink-0" size={16} />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products..."
                                            className="flex-1 bg-transparent font-label text-sm text-brand-brown placeholder-gray-400 px-2 py-2 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={closeSearch}
                                            className="p-2 text-gray-400 hover:text-brand-brown transition-colors"
                                            aria-label="Close search"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.button
                                        key="search-icon"
                                        onClick={openSearch}
                                        className="p-3 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                                        aria-label="Open search"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <MagnifyingGlass size={20} weight="regular" />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {searchOpen && searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                                    >
                                        {searchResults.map((result) => (
                                            <button
                                                onClick={() => handleSearchSelect(result.id)}
                                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-brand-latte transition-colors text-left"
                                                key={result.id}
                                            >
                                                <img
                                                    src={result.image}
                                                    alt={result.name}
                                                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <div className="font-label text-sm text-brand-brown truncate">{result.name}</div>   
                                                    <div className="font-sans text-xs text-gray-400 capitalize">{result.category}</div>
                                                </div>
                                                <span className="ml-auto font-label text-sm text-brand-brown font-medium flex-shrink-0">
                                                    ${result?.price?.toFixed(2)}
                                                </span>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => { closeSearch(); navigate(`/shop?search=${encodeURIComponent(searchQuery)}`); }}
                                            className="w-full px-4 py-3 bg-brand-latte font-label text-xs text-brand-cocoa hover:text-brand-brown transition-colors text-center border-t border-gray-100"
                                        >
                                            See all results for "<span className="font-medium">{searchQuery}</span>"
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {user ? (
                            <div className="relative flex items-center gap-1">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-latte text-brand-brown">
                                    <User size={18} weight="fill" />
                                    <span className="hidden sm:inline font-label text-sm font-medium capitalize">
                                        {user?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="p-2 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                                    aria-label="Sign out"
                                    title="Sign out"
                                >
                                    <SignOut size={18} weight="regular" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    console.log('hello header')
                                    openAuthModal("signin")
                                  }}
                                  className="font-label text-sm px-4 py-2 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"  
                                >
                                    Sign In
                                </button>
                                <button
                                  onClick={() => openAuthModal("signup")}
                                  className="font-label text-sm px-4 py-2 rounded-lg bg-brand-brown text-brand-cream hover:bg-brand-cocoa transition-colors duration-200 cursor-pointer"  
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {!user && (
                            <button
                                className="md:hidden p-3 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                                aria-label="Account"
                                onClick={() => openAuthModal("signin")}
                            >
                                <User size={20} weight="regular" />
                            </button>
                        )}

                        <button
                            onClick={() => dispatch({ type: "OPEN_CART" })}
                            className="relative p-3 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                            aria-label={`Cart, ${totalItems} items`}
                        >
                            <ShoppingCart size={20} weight="regular" />
                            {totalItems > 0 && (
                                <span className="absolute top-1 right-1 bg-brand-brown text-brand-cream text-xs font-label rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden p-3 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={20} weight="regular" /> : <List size={20} weight="regular" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="md:hidden bg-brand-cream border-t border-gray-200 overflow-hidden"
                        >
                            <nav className="flex flex-col px-8 py-4 gap-1" aria-label="Mobile navigation">
                                {navLinks?.map((link) => (
                                    <button
                                        key={link.href}
                                        onClick={() => handleNavClick(link.href)}
                                        className={`font-label text-sm px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                                            isActive(link?.href)
                                                ? "text-brand-brown font-500 bg-brand-latte"
                                                : "text-brand-brown hover:bg-brand-latte"  
                                        }`}
                                    >
                                        {link?.label}
                                    </button>        
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;