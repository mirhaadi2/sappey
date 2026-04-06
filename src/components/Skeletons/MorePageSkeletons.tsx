import React from "react";
import { motion } from "framer-motion";

export const ShopPageSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-brand-latte">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.div {...skeletonAnimation} className="h-10 w-64 bg-slate-200 rounded mb-2" />
            <motion.div {...skeletonAnimation} className="h-5 w-48 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Filters and Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            {[1, 2, 3].map((section) => (
              <motion.div key={section} {...skeletonAnimation} className="bg-white rounded-2xl p-6 border border-slate-100">
                <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-200 rounded mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div key={i} {...skeletonAnimation} className="h-4 w-full bg-slate-200 rounded" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-8">
              <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-200 rounded" />
              <motion.div {...skeletonAnimation} className="h-10 w-40 bg-slate-200 rounded-lg" />
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  {...skeletonAnimation}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                >
                  <div className="aspect-square bg-slate-200 relative">
                    <motion.div {...skeletonAnimation} className="absolute top-3 right-3 h-8 w-16 bg-slate-300 rounded-full" />
                  </div>
                  <div className="p-4 space-y-3">
                    <motion.div {...skeletonAnimation} className="h-5 w-3/4 bg-slate-200 rounded" />
                    <motion.div {...skeletonAnimation} className="h-4 w-1/2 bg-slate-200 rounded" />
                    <div className="flex gap-2">
                      <motion.div {...skeletonAnimation} className="h-6 bg-slate-200 rounded-full flex-1" />
                      <motion.div {...skeletonAnimation} className="h-6 bg-slate-200 rounded-full flex-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <motion.div {...skeletonAnimation} className="h-12 w-40 bg-slate-200 rounded-lg mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfilePageSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-brand-latte">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div {...skeletonAnimation} className="h-10 w-64 bg-slate-200 rounded mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div {...skeletonAnimation} className="bg-white rounded-3xl p-8 border border-slate-100 h-fit">
            <motion.div {...skeletonAnimation} className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-6" />
            <div className="text-center space-y-3 mb-6">
              <motion.div {...skeletonAnimation} className="h-6 w-32 bg-slate-200 rounded mx-auto" />
              <motion.div {...skeletonAnimation} className="h-4 w-40 bg-slate-200 rounded mx-auto" />
            </div>
            <motion.div {...skeletonAnimation} className="h-10 bg-slate-200 rounded-lg" />
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} {...skeletonAnimation} className="h-8 w-32 bg-slate-200 rounded" />
              ))}
            </div>

            {/* Form Sections */}
            {[1, 2].map((section) => (
              <motion.div key={section} {...skeletonAnimation} className="bg-white rounded-3xl p-8 border border-slate-100">
                <motion.div {...skeletonAnimation} className="h-6 w-48 bg-slate-200 rounded mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div key={i} {...skeletonAnimation} className="h-12 bg-slate-200 rounded-lg" />
                  ))}
                </div>
                <motion.div {...skeletonAnimation} className="h-10 w-32 bg-slate-200 rounded" />
              </motion.div>
            ))}

            {/* Address List */}
            <motion.div {...skeletonAnimation} className="bg-white rounded-3xl p-8 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <motion.div {...skeletonAnimation} className="h-6 w-40 bg-slate-200 rounded" />
                <motion.div {...skeletonAnimation} className="h-10 w-32 bg-slate-200 rounded" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    {...skeletonAnimation}
                    className="bg-gradient-to-r from-brand-latte/50 to-brand-cream/50 rounded-2xl p-6 border border-slate-100"
                  >
                    <div className="space-y-2">
                      <motion.div {...skeletonAnimation} className="h-4 w-40 bg-slate-200 rounded" />
                      <motion.div {...skeletonAnimation} className="h-4 w-32 bg-slate-200 rounded" />
                      <motion.div {...skeletonAnimation} className="h-4 w-36 bg-slate-200 rounded" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-brand-latte">
      {/* Hero Section */}
      <motion.div {...skeletonAnimation} className="w-full h-96 bg-slate-300 mb-12" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Section */}
        <motion.div {...skeletonAnimation} className="h-8 w-48 bg-slate-200 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} {...skeletonAnimation} className="bg-white rounded-2xl overflow-hidden">
              <div className="aspect-square bg-slate-200" />
              <div className="p-4 space-y-2">
                <motion.div {...skeletonAnimation} className="h-5 w-3/4 bg-slate-200 rounded" />
                <motion.div {...skeletonAnimation} className="h-8 w-24 bg-slate-200 rounded" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categories Section */}
        <motion.div {...skeletonAnimation} className="h-8 w-48 bg-slate-200 rounded mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} {...skeletonAnimation} className="aspect-square bg-white rounded-xl" />
          ))}
        </div>

        {/* Products Section */}
        <motion.div {...skeletonAnimation} className="h-8 w-48 bg-slate-200 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} {...skeletonAnimation} className="bg-white rounded-2xl overflow-hidden">
              <div className="aspect-square bg-slate-200" />
              <div className="p-4 space-y-3">
                <motion.div {...skeletonAnimation} className="h-5 w-3/4 bg-slate-200 rounded" />
                <motion.div {...skeletonAnimation} className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="flex gap-2">
                  <motion.div {...skeletonAnimation} className="h-6 bg-slate-200 rounded-full flex-1" />
                  <motion.div {...skeletonAnimation} className="h-6 bg-slate-200 rounded-full flex-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WishlistPageSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <motion.div {...skeletonAnimation} className="h-6 w-20 bg-slate-200 rounded mb-6" />
          <div className="flex items-center justify-between">
            <div>
              <motion.div {...skeletonAnimation} className="h-12 w-64 bg-slate-200 rounded mb-2" />
              <motion.div {...skeletonAnimation} className="h-5 w-48 bg-slate-200 rounded" />
            </div>
            <motion.div {...skeletonAnimation} className="hidden md:block h-12 w-12 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Products Grid and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  {...skeletonAnimation}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-200" />
                  <div className="p-4 space-y-3 flex-1">
                    <motion.div {...skeletonAnimation} className="h-4 w-full bg-slate-200 rounded" />
                    <motion.div {...skeletonAnimation} className="h-4 w-3/4 bg-slate-200 rounded" />
                    <motion.div {...skeletonAnimation} className="h-6 w-20 bg-slate-200 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <motion.div {...skeletonAnimation} className="bg-white rounded-2xl border border-slate-100 p-6 h-fit">
            <motion.div {...skeletonAnimation} className="h-6 w-32 bg-slate-200 rounded mb-6" />
            <div className="space-y-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <motion.div {...skeletonAnimation} className="h-4 w-24 bg-slate-200 rounded" />
                  <motion.div {...skeletonAnimation} className="h-4 w-20 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
            <motion.div {...skeletonAnimation} className="h-12 w-full bg-slate-200 rounded-lg" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
