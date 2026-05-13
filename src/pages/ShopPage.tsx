import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteProducts } from "../api/exports";
import { ShopPageSkeleton } from "../components/Skeletons";
import { SortOption, ViewMode } from "../types/ShopPage";
import {
  ShopPageHeader,
  FilterControls,
  ProductGrid,
  EmptyState,
} from "../components/Shop";

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

  // Handler functions
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, []);

  const handleViewModeChange = useCallback((newMode: ViewMode) => {
    setViewMode(newMode);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handleResetFilters = useCallback(() => {
    setSearchParams({});
    setSortBy("default");
    setViewMode("grid-4");
  }, [setSearchParams]);

  // Sort products
  const sortedProducts = useMemo(() => {
    // API already returns sorted results based on filters.sort
    // No need for client-side sorting - it breaks infinite pagination
    return products || [];
  }, [products]);

  if (isLoading && sortedProducts.length === 0) return <ShopPageSkeleton />;

  return (
    <div className="min-h-screen bg-brand-latte/30">
      {/* Hero Header */}
      <ShopPageHeader />

      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-12">
        {/* Filter Controls Bar */}
        <FilterControls
          sortBy={sortBy}
          viewMode={viewMode}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
        />

        {/* Results Header */}
        <div className="relative flex items-center justify-center mb-6 mt-6 px-4 min-h-[80px]">
          {/* CENTER CONTENT */}
          <div className="flex flex-col items-center text-center z-10">
            {/* Small Premium Label */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-[#B08A37]/60" />
              <span className="uppercase tracking-[0.35em] text-[#B08A37] text-[10px] font-semibold">
                Premium Collection
              </span>
              <div className="w-8 h-[1px] bg-[#B08A37]/60" />
            </div>

            {/* Main Heading */}
            <h3
              className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] text-brand-brown capitalize leading-tight"
              style={{
                fontWeight: 500,
                letterSpacing: "-0.03em",
              }}
            >
              {activeCategory === "all" ? "Our Collection" : activeCategory}
            </h3>
          </div>

          {/* RIGHT COUNT - Absolute ensures it doesn't shift the H3 */}
          <div className="hidden lg:flex absolute right-4 items-center">
            <div className="px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[#B08A37]/20 shadow-sm transition-all hover:border-[#B08A37]/40">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B665E] font-medium">
                <span className="text-[#B08A37] font-bold mr-1">
                  {sortedProducts.length}
                </span>
                Products
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid or Empty State */}
        {sortedProducts.length > 0 ? (
          <ProductGrid
            products={sortedProducts}
            viewMode={viewMode}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
          />
        ) : (
          <EmptyState onResetFilters={handleResetFilters} />
        )}
      </div>
    </div>
  );
};

export default ShopPage;