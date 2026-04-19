import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FunnelSimple,
  GridFour,
  SquaresFour,
  Rows,
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
  const navigate = useNavigate();
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
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts(productFilters);

  const { categories: apiCategories, isLoading: categoriesLoading } = useCategories(true);

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
      <div className="bg-gradient-1 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-headline text-5xl md:text-6xl text-brand-cream mb-6 leading-tight tracking-tight">
              Shop Premium <br /> Dry Fruits & Nuts
            </h1>
            <p className="font-sans text-lg text-brand-cream/80 max-w-2xl leading-relaxed">
              Experience the pinnacle of taste and nutrition with our hand-selected,
              sustainably sourced collection.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-24">
        {/* Floating Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl shadow-brand-brown/5 p-2 px-4 mb-12">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

            {/* Categories with custom scrollbar */}
            <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar py-1">
              <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar py-2 px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-brown">
                  Filter:
                </span>
                <div className="flex gap-3">
                  {[{ id: "all", name: "All Products" }, ...(apiCategories ?? [])].map((cat) => (
                    <button
                      key={cat?.id}
                      onClick={() => setCategory(cat?.id ?? "all")}
                      // The transform (scale-105) now has room because of the py-2 and px-1 above
                      className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === (cat?.id ?? "all")
                          ? "bg-brand-brown text-brand-cream shadow-lg shadow-brand-brown/20 scale-105"
                          : "bg-brand-latte/50 text-brand-brown hover:bg-brand-latte"
                        }`}
                    >
                      {cat?.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full xl:w-auto gap-4 px-2">
              {/* Premium Select Box */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-10 pr-12 py-3 bg-brand-latte/30 border-none rounded-2xl text-sm font-semibold text-brand-brown focus:ring-2 focus:ring-brand-brown/10 cursor-pointer transition-all min-w-[180px]"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Latest Arrivals</option>
                </select>
                <FunnelSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown/60" />
              </div>

              {/* View Toggles */}
              <div className="hidden md:flex bg-brand-latte/30 p-1.5 rounded-2xl">
                {[
                  { id: "grid-4", icon: GridFour },
                  { id: "grid-3", icon: SquaresFour },
                  { id: "grid-2", icon: Rows }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as ViewMode)}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === mode.id
                        ? "bg-white text-brand-brown shadow-sm scale-110"
                        : "text-brand-brown/40 hover:text-brand-brown"
                      }`}
                  >
                    <mode.icon size={20} weight={viewMode === mode.id ? "fill" : "regular"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Results Grid */}
        <div className="mb-8 flex items-baseline justify-between px-2">
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