import React from "react";
import { motion } from "framer-motion";

export const OrderDetailsSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div {...skeletonAnimation} className="h-10 w-40 bg-slate-200 rounded-lg" />
          <div className="flex items-center gap-3">
            <motion.div {...skeletonAnimation} className="h-10 w-32 bg-slate-200 rounded-lg" />
            <motion.div {...skeletonAnimation} className="h-10 w-32 bg-slate-200 rounded-lg" />
          </div>
        </div>

        {/* Status Card Skeleton */}
        <motion.div {...skeletonAnimation} className="relative overflow-hidden rounded-[2rem] border-2 p-6 px-10 mb-8 bg-white border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <motion.div {...skeletonAnimation} className="h-6 w-20 bg-slate-200 rounded mb-3" />
              <motion.div {...skeletonAnimation} className="h-8 w-40 bg-slate-200 rounded mb-3" />
              <motion.div {...skeletonAnimation} className="h-5 w-48 bg-slate-200 rounded" />
            </div>
            <motion.div {...skeletonAnimation} className="h-12 w-32 bg-slate-200 rounded-full" />
          </div>
        </motion.div>

        {/* Timeline Skeleton */}
        <motion.div {...skeletonAnimation} className="bg-white rounded-3xl border border-slate-200 p-8 mb-8">
          <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-200 rounded mb-10" />
          <div className="flex justify-between items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                <motion.div {...skeletonAnimation} className="w-14 h-14 rounded-2xl bg-slate-200" />
                <motion.div {...skeletonAnimation} className="h-4 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grid Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List Skeleton */}
          <div className="lg:col-span-2">
            <motion.div {...skeletonAnimation} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <motion.div {...skeletonAnimation} className="h-6 w-40 bg-slate-200 rounded" />
                <motion.div {...skeletonAnimation} className="h-6 w-12 bg-slate-200 rounded-full" />
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-8 flex gap-4">
                    <motion.div {...skeletonAnimation} className="w-24 h-24 rounded-2xl bg-slate-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <motion.div {...skeletonAnimation} className="h-4 w-48 bg-slate-200 rounded" />
                      <motion.div {...skeletonAnimation} className="h-4 w-32 bg-slate-200 rounded" />
                      <motion.div {...skeletonAnimation} className="h-4 w-40 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-[#9a5d2e]/10 rounded-b-3xl space-y-3">
                <motion.div {...skeletonAnimation} className="h-5 w-48 bg-slate-300 rounded" />
                <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-300 rounded" />
              </div>
            </motion.div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <motion.div key={i} {...skeletonAnimation} className="bg-white rounded-3xl border border-slate-200 p-8">
                <motion.div {...skeletonAnimation} className="h-5 w-32 bg-slate-200 rounded mb-4" />
                <div className="space-y-3">
                  <motion.div {...skeletonAnimation} className="h-4 w-full bg-slate-200 rounded" />
                  <motion.div {...skeletonAnimation} className="h-4 w-5/6 bg-slate-200 rounded" />
                  <motion.div {...skeletonAnimation} className="h-4 w-4/5 bg-slate-200 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
