import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FunnelSimple,
  GridFour,
  SquaresFour,
  Rows,
  Leaf,
  Trophy,
  Sparkle,
} from "@phosphor-icons/react";
import { useCategories, useInfiniteProducts } from "../api/exports";
import ProductCard from "../components/ProductCard";
import { ShopPageSkeleton } from "../components/Skeletons";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid-4" | "grid-3" | "grid-2";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
};

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const isBestsellerFilter = searchParams.get("isBestseller") === "true";
  const isNewFilter = searchParams.get("isNew") === "true";
  const isCustomerFavouritesFilter = searchParams.get("isCustomerFavourites") === "true";

  const limit = 12;

  const productFilters = useMemo(
    () => ({
      ...(activeCategory !== "all" ? { categoryId: activeCategory } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(isBestsellerFilter ? { isBestseller: true } : {}),
      ...(isNewFilter ? { isNew: true } : {}),
      ...(isCustomerFavouritesFilter ? { isCustomerFavourites: true } : {}),
      sort: sortBy,
      limit,
    }),
    [activeCategory, searchQuery, isBestsellerFilter, isNewFilter, isCustomerFavouritesFilter, sortBy]
  );

  const {
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts(productFilters);

  // const { categories: apiCategories, isLoading: categoriesLoading } = useCategories(true);

  const setCategory = useCallback(
    (cat: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (cat === "all") {
        newParams.delete("category");
      } else {
        newParams.set("category", cat);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const result = [...products];
    switch (sortBy) {
      case "price-asc": return result.sort((a, b) => Number(a?.basePrice ?? 0) - Number(b?.basePrice ?? 0));
      case "price-desc": return result.sort((a, b) => Number(b?.basePrice ?? 0) - Number(a?.basePrice ?? 0));
      case "newest": return result.sort((a, b) => new Date(b?.createdAt ?? 0).getTime() - new Date(a?.createdAt ?? 0).getTime());
      case "rating": return result.sort((a, b) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0));
      default: return result;
    }
  }, [products, sortBy]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "300px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const gridClass = {
    "grid-4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    "grid-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "grid-2": "grid-cols-1 sm:grid-cols-2",
  }[viewMode];

  if (isLoading && sortedProducts.length === 0) return <ShopPageSkeleton />;

  return (
    <div className="min-h-screen bg-brand-latte/30">
      {/* Refined Header */}
      <div className="relative min-h-[500px] flex items-center bg-brand-brown overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-latte/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Elegant Top Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="h-px w-8 bg-orange-500" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                  Direct from Source
                </span>
              </motion.div>

              <h1 className="font-headline text-6xl md:text-7xl text-white mb-8 leading-[1.1] tracking-tight">
                The <span className="italic font-light text-brand-cream">Elite</span> <br />
                Selection
              </h1>

              <p className="font-sans text-lg md:text-xl text-brand-cream/70 max-w-xl leading-relaxed mb-10 border-l-2 border-brand-latte/30 pl-6">
                Nature’s best, curated by <span className="text-white font-semibold">Sappey</span>. From sun-drenched orchards to fertile groves, we bring you the
                <span className="text-white font-medium"> ultimate dry fruit experience</span>—pure, nutrient-rich, and vacuum-packed at the peak of freshness for a superior taste in every bite.
              </p>

              {/* Quick Stats Badges */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Leaf size={16} />, text: "100% Organic" },
                  { icon: <Trophy size={16} />, text: "Premium Grade" },
                  { icon: <Sparkle size={16} />, text: "No Additives" }
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-brand-cream tracking-wide uppercase"
                  >
                    <span className="text-orange-500">{badge.icon}</span>
                    {badge.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Decorative Abstract */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="hidden lg:flex justify-end relative"
            >
              <div className="relative group">
                {/* Glass Card Effect */}
                <div className="w-80 h-96 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/20 rounded-2xl rotate-3 flex flex-col justify-center items-center p-8 shadow-2xl transition-transform group-hover:rotate-0 duration-700">
                  <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                    <Sparkle size={40} className="text-orange-500 animate-pulse" />
                  </div>
                  <h3 className="font-headline text-2xl text-white text-center">Quality Assured</h3>
                  <p className="text-center text-brand-cream/60 text-sm mt-4 italic">
                    "Every nut is manually inspected for size, color, and texture."
                  </p>
                  <div className="mt-8 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    ))}
                  </div>
                </div>

                {/* Offset Decorative Border */}
                <div className="absolute inset-0 border-2 border-brand-latte/20 rounded-2xl -rotate-6 -z-10 transition-transform group-hover:-rotate-3 duration-700" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Elegant Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-cream">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-orange-500 to-transparent" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-24">
        {/* The Floating Glass Control Bar */}
        <div className="sticky top-24 z-30 flex items-center justify-between p-2 px-4 bg-white backdrop-blur-2xl border border-white/80 rounded-[28px] shadow-2xl shadow-brand-brown/5">

          {/* Sort Section */}
          <div className="flex items-center gap-2">
            {/* Filter Icon Circle */}
            <div className="p-2 bg-brand-brown/5 rounded-full">
              <FunnelSimple size={16} className="text-brand-brown" />
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-4 px-2">
              {["default", "price-asc", "price-desc"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option as SortOption)}
                  className={`text-[11px] font-bold uppercase tracking-tighter transition-all ${sortBy === option ? "text-orange-500" : "text-brand-brown/40 hover:text-brand-brown"
                    }`}
                >
                  {option === "default" && "Recommended"}
                  {option === "price-asc" && "Price ↑"}
                  {option === "price-desc" && "Price ↓"}
                </button>
              ))}
            </div>
          </div>

          {/* View Switcher (Right Side) */}
          <div className="flex items-center gap-1 bg-brand-brown/5 p-1 rounded-full">
            {[
              { id: "grid-4", icon: GridFour },
              { id: "grid-3", icon: SquaresFour },
              { id: "grid-2", icon: Rows }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`p-2 rounded-full transition-all ${viewMode === mode.id
                    ? "bg-brand-brown text-white shadow-inner"
                    : "text-brand-brown/30 hover:text-brand-brown/60"
                  }`}
              >
                <mode.icon size={16} weight={viewMode === mode.id ? "fill" : "regular"} />
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Results Grid */}
        <div className="mb-8 flex items-baseline justify-between px-2 mt-6">
          <h3 className="text-brand-brown font-headline text-2xl">
            {activeCategory === "all" ? "Our Collection" : activeCategory}
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            Showing <span className="text-brand-brown font-bold">{sortedProducts.length}</span> items
          </p>
        </div>

        {sortedProducts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={`grid gap-8 items-stretch ${gridClass}`}
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-brand-latte"
          >
            <div className="w-24 h-24 bg-brand-latte rounded-full flex items-center justify-center mb-6">
              <FunnelSimple size={40} weight="thin" className="text-brand-brown opacity-40" />
            </div>
            <h3 className="text-2xl font-headline text-brand-brown mb-2">No items found</h3>
            <p className="text-slate-400 mb-8 max-w-xs text-center">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => setSearchParams({})}
              className="px-10 py-4 bg-brand-brown text-brand-cream rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:-translate-y-1 transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Load More Area */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="mt-20 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="group flex items-center gap-3 px-12 py-5 bg-white border border-brand-latte text-brand-brown rounded-[24px] font-bold hover:bg-brand-brown hover:text-white transition-all duration-500 disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <div className="w-5 h-5 border-2 border-brand-brown/30 border-t-brand-brown animate-spin rounded-full" />
              ) : (
                "Show More Products"
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .bg-gradient-1 {
          background: linear-gradient(135deg, var(--color-brand-brown) 0%, var(--color-brand-cocoa) 100%);
          
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ShopPage;