import React from "react";
import { motion } from "framer-motion";

export const CheckoutPageSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-latte to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-200 rounded" />
          <motion.div {...skeletonAnimation} className="h-8 w-40 bg-slate-200 rounded" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <motion.div {...skeletonAnimation} className="w-12 h-12 rounded-full bg-slate-200" />
                  {i < 4 && <motion.div {...skeletonAnimation} className="flex-1 h-1 mx-2 bg-slate-200" />}
                </div>
              ))}
            </div>

            {/* Form Sections */}
            {[1, 2, 3].map((section) => (
              <motion.div key={section} {...skeletonAnimation} className="bg-white rounded-3xl p-8 border border-gray-100">
                <motion.div {...skeletonAnimation} className="h-6 w-48 bg-slate-200 rounded mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div key={i} {...skeletonAnimation} className="h-12 bg-slate-200 rounded-xl" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div {...skeletonAnimation} className="bg-white rounded-3xl p-8 border border-gray-100 h-fit sticky top-32">
            <motion.div {...skeletonAnimation} className="h-6 w-40 bg-slate-200 rounded mb-6" />
            <div className="space-y-3 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <motion.div {...skeletonAnimation} className="h-4 w-20 bg-slate-200 rounded" />
                  <motion.div {...skeletonAnimation} className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
            <motion.div {...skeletonAnimation} className="h-12 bg-slate-300 rounded-xl" />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-brand-latte">
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-200 rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <motion.div {...skeletonAnimation} className="aspect-square bg-slate-200 rounded-lg mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} {...skeletonAnimation} className="aspect-square bg-slate-200 rounded" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <motion.div {...skeletonAnimation} className="h-6 w-32 bg-slate-200 rounded mb-4" />
          <motion.div {...skeletonAnimation} className="h-8 w-64 bg-slate-200 rounded mb-4" />
          <motion.div {...skeletonAnimation} className="h-5 w-40 bg-slate-200 rounded mb-6" />
          <motion.div {...skeletonAnimation} className="h-10 w-32 bg-slate-200 rounded mb-8" />
          
          <motion.div {...skeletonAnimation} className="h-24 bg-slate-200 rounded mb-6" />

          <div className="space-y-3 mb-8">
            {[1, 2, 3].map((i) => (
              <motion.div key={i} {...skeletonAnimation} className="h-4 w-full bg-slate-200 rounded" />
            ))}
          </div>

          <div className="flex gap-4">
            <motion.div {...skeletonAnimation} className="flex-1 h-12 bg-slate-200 rounded-lg" />
            <motion.div {...skeletonAnimation} className="flex-1 h-12 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductCardSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ count = 8 }) => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          {...skeletonAnimation}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="aspect-square bg-slate-200" />
          <div className="p-5 space-y-3">
            <motion.div {...skeletonAnimation} className="h-5 bg-slate-200 rounded w-3/4" />
            <motion.div {...skeletonAnimation} className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="flex gap-2">
              <motion.div {...skeletonAnimation} className="h-6 bg-slate-200 rounded-full flex-1" />
              <motion.div {...skeletonAnimation} className="h-6 bg-slate-200 rounded-full flex-1" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
