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
} from "@phosphor-icons/react";
import { useCategories, useInfiniteProducts } from "../api/exports";
import ProductCard from "../components/ProductCard";
import { ShopPageSkeleton } from "../components/Skeletons";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid-4" | "grid-3" | "grid-2";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const isBestsellerFilter = searchParams.get("isBestseller") === "true";
  const isNewFilter = searchParams.get("isNew") === "true";
  const isCustomerFavouritesFilter =
    searchParams.get("isCustomerFavourites") === "true";

  const limit = 12;

  const productFilters: Record<string, unknown> = React.useMemo(
    () => ({
      ...(activeCategory !== "all" ? { categoryId: activeCategory } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(isBestsellerFilter ? { isBestseller: true } : {}),
      ...(isNewFilter ? { isNew: true } : {}),
      ...(isCustomerFavouritesFilter ? { isCustomerFavourites: true } : {}),
      sort: sortBy, // <-- Add this line
      limit,
    }),
    [
      activeCategory,
      searchQuery,
      isBestsellerFilter,
      isNewFilter,
      isCustomerFavouritesFilter,
      sortBy, // <-- Add this to dependencies
      limit,
    ],
  );
  // Fetch products from API with optional category or feature filter using infinite scroll + pagination
  const {
    products,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts(productFilters);
  // Fetch categories from API
  const { categories: apiCategories, isLoading: categoriesLoading } =
    useCategories(true);

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
    [searchParams, setSearchParams],
  );

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Create a copy to avoid mutating original
    const result = [...products];

    // Apply sorting based on sortBy state
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = Number(a?.basePrice ?? 0);
          const priceB = Number(b?.basePrice ?? 0);
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = Number(a?.basePrice ?? 0);
          const priceB = Number(b?.basePrice ?? 0);
          return priceB - priceA;
        });
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = new Date(b?.createdAt ?? 0).getTime();
          const dateB = new Date(a?.createdAt ?? 0).getTime();
          return dateA - dateB;
        });
        break;
      case "rating":
        // Rating sorting - implementation depends on API data
        result.sort((a, b) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0));
        break;
      case "default":
      default:
        // Keep original order
        break;
    }

    return result;
  }, [products, sortBy]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const gridClass =
    viewMode === "grid-4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : viewMode === "grid-3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  if (isLoading && sortedProducts.length === 0) {
    return <ShopPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-brand-latte text-foreground">
      {/* Page Header */}
      <div className="bg-gradient-1 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="font-headline text-5xl text-brand-cream mb-4"
              style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
            >
              Shop Premium Dry Fruits & Nuts
            </h1>
            <p className="font-sans text-brand-cream opacity-80 max-w-xl">
              Discover our full range of carefully sourced, premium quality dry
              fruits and nuts.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-[24px] border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label text-xs uppercase tracking-wider text-gray-500 mr-1">
                Category:
              </span>
              {categoriesLoading ? (
                <div className="text-xs text-gray-500">Loading...</div>
              ) : (
                [{ id: "all", name: "All" }, ...(apiCategories ?? [])].map(
                  (cat) => (
                    <button
                      key={cat?.id}
                      onClick={() => setCategory(cat?.id ?? "all")}
                      className={`font-label text-xs px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeCategory === (cat?.id ?? "all")
                          ? "bg-brand-brown text-brand-cream"
                          : "bg-brand-latte text-brand-brown hover:bg-gray-200"
                      }`}
                    >
                      {cat?.name ?? "Category"}
                    </button>
                  ),
                )
              )}
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <FunnelSimple
                  size={16}
                  weight="regular"
                  className={
                    sortBy !== "default" ? "text-brand-brown" : "text-gray-500"
                  }
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={`font-label text-xs rounded-lg px-3 py-2 focus:outline-none cursor-pointer transition-all ${
                    sortBy !== "default"
                      ? "bg-brand-brown text-brand-cream border border-brand-brown font-bold"
                      : "bg-brand-latte text-brand-brown border border-gray-200 focus:border-brand-brown"
                  }`}
                  aria-label="Sort products"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Most Popular</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-brand-latte rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid-4")}
                  className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                    viewMode === "grid-4"
                      ? "bg-brand-brown text-brand-cream"
                      : "text-gray-500 hover:text-brand-brown"
                  }`}
                  aria-label="4 column grid"
                >
                  <GridFour size={16} weight="regular" />
                </button>
                <button
                  onClick={() => setViewMode("grid-3")}
                  className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                    viewMode === "grid-3"
                      ? "bg-brand-brown text-brand-cream"
                      : "text-gray-500 hover:text-brand-brown"
                  }`}
                  aria-label="3 column grid"
                >
                  <SquaresFour size={16} weight="regular" />
                </button>
                <button
                  onClick={() => setViewMode("grid-2")}
                  className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                    viewMode === "grid-2"
                      ? "bg-brand-brown text-brand-cream"
                      : "text-gray-500 hover:text-brand-brown"
                  }`}
                  aria-label="2 column grid"
                >
                  <Rows size={16} weight="regular" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="font-sans text-sm text-gray-500 mb-6">
          {isLoading ? (
            "Loading products..."
          ) : (
            <>
              Showing{" "}
              <span
                className="text-brand-brown font-medium"
                style={{ fontWeight: 500 }}
              >
                {sortedProducts.length}
              </span>{" "}
              products
              {activeCategory !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-brand-brown capitalize">
                    {activeCategory}
                  </span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching "
                  <span className="text-brand-brown font-medium">
                    {searchQuery}
                  </span>
                  "
                </span>
              )}
            </>
          )}
        </p>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6"
          >
            <p className="text-red-800">
              Failed to load products. Please try again.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 ${gridClass}">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 ${gridClass}`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-brand-latte rounded-full flex items-center justify-center mx-auto mb-6">
                <FunnelSimple
                  size={32}
                  weight="light"
                  className="text-brand-brown"
                />
              </div>
              <h3 className="font-headline text-2xl text-brand-brown mb-2">
                No products found
              </h3>
              <p className="font-sans text-gray-500 mb-8">
                We couldn't find any products matching your current filters. Try
                adjusting your search or category selection.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSortBy("default");
                }}
                className="font-label text-sm bg-brand-brown text-brand-cream px-8 py-3 rounded-xl hover:bg-brand-cocoa transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {!isLoading && sortedProducts.length > 0 && hasNextPage && (
          <div ref={loadMoreRef} className="text-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="font-label text-sm bg-brand-brown text-brand-cream px-8 py-3 rounded-xl hover:bg-brand-cocoa transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .bg-gradient-1 {
          background: linear-gradient(135deg, var(--color-brand-brown) 0%, var(--color-brand-cocoa) 100%);
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
