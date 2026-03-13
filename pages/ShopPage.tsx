import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FunnelSimple, GridFour, SquaresFour, Rows } from "@phosphor-icons/react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid-4" | "grid-3" | "grid-2";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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

  const setCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
    return result;
  }, [activeCategory, sortBy, searchQuery]);

  const gridClass =
    viewMode === "grid-4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : viewMode === "grid-3"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className="min-h-screen bg-brand-latte text-foreground">
      {/* Page Header */}
      <div className="bg-gradient-1 py-16 px-8">
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
              Discover our full range of carefully sourced, premium quality dry fruits and nuts.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label text-xs uppercase tracking-wider text-gray-500 mr-1">
                Category:
              </span>
              {[{ id: "all", name: "All" }, ...categories].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`font-label text-xs px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-brand-brown text-brand-cream"
                      : "bg-brand-latte text-brand-brown hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <FunnelSimple size={16} weight="regular" className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="font-label text-xs bg-brand-latte text-brand-brown border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-brown cursor-pointer"
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
          Showing <span className="text-brand-brown font-medium" style={{ fontWeight: 500 }}>{filteredProducts.length}</span> products
          {activeCategory !== "all" && (
            <span> in <span className="text-brand-brown capitalize">{activeCategory}</span></span>
          )}
          {searchQuery && (
            <span> matching "<span className="text-brand-brown font-medium">{searchQuery}</span>"</span>
          )}
        </p>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 ${gridClass}`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-brand-latte rounded-full flex items-center justify-center mx-auto mb-6">
                <FunnelSimple size={32} weight="light" className="text-brand-brown" />
              </div>
              <h3 className="font-headline text-2xl text-brand-brown mb-2">No products found</h3>
              <p className="font-sans text-gray-500 mb-8">
                We couldn't find any products matching your current filters. Try adjusting your search or category selection.
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