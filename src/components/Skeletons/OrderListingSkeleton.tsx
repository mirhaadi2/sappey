import React from "react";
import { motion } from "framer-motion";

export const OrderListingSkeleton: React.FC = () => {
  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <motion.div {...skeletonAnimation} className="h-10 w-64 bg-slate-200 rounded mb-2" />
            <motion.div {...skeletonAnimation} className="h-5 w-48 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <motion.div {...skeletonAnimation} className="h-10 w-32 bg-slate-200 rounded" />
            <motion.div {...skeletonAnimation} className="h-10 w-40 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Analytics Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <motion.div key={i} {...skeletonAnimation} className="bg-white/60 border border-white p-6 rounded-2xl">
              <motion.div {...skeletonAnimation} className="h-5 w-20 bg-slate-200 rounded mb-3" />
              <motion.div {...skeletonAnimation} className="h-8 w-32 bg-slate-200 rounded" />
            </motion.div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <motion.div {...skeletonAnimation} className="bg-white/80 border border-white p-3 rounded-2xl mb-8 flex gap-3">
          <motion.div {...skeletonAnimation} className="flex-1 h-10 bg-slate-200 rounded-xl" />
          <motion.div {...skeletonAnimation} className="h-10 w-24 bg-slate-200 rounded-xl" />
        </motion.div>

        {/* Table Skeleton */}
        <motion.div {...skeletonAnimation} className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <th key={i} className="px-8 py-5">
                      <motion.div {...skeletonAnimation} className="h-4 bg-slate-200 rounded w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                  <tr key={row} className="hover:bg-slate-50/50">
                    {[1, 2, 3, 4, 5, 6].map((col) => (
                      <td key={col} className="px-8 py-6">
                        <motion.div {...skeletonAnimation} className="h-4 bg-slate-200 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50/80 px-8 py-5 border-t border-slate-100 flex justify-between items-center">
            <motion.div {...skeletonAnimation} className="h-4 w-32 bg-slate-200 rounded" />
            <div className="flex gap-2">
              <motion.div {...skeletonAnimation} className="h-8 w-8 bg-slate-200 rounded" />
              <motion.div {...skeletonAnimation} className="h-8 w-8 bg-slate-200 rounded" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
