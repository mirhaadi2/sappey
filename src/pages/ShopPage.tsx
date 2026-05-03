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
    if (!products || products.length === 0) return [];
    const result = [...products];
    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => Number(a?.basePrice ?? 0) - Number(b?.basePrice ?? 0));
      case "price-desc":
        return result.sort((a, b) => Number(b?.basePrice ?? 0) - Number(a?.basePrice ?? 0));
      case "newest":
        return result.sort((a, b) => new Date(b?.createdAt ?? 0).getTime() - new Date(a?.createdAt ?? 0).getTime());
      case "rating":
        return result.sort((a, b) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0));
      default:
        return result;
    }
  }, [products, sortBy]);

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
        <div className="mb-8 flex items-baseline justify-between px-2 mt-6">
          <h3 className="text-brand-brown font-headline text-2xl">
            {activeCategory === "all" ? "Our Collection" : activeCategory}
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            Showing <span className="text-brand-brown font-bold">{sortedProducts.length}</span> items
          </p>
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