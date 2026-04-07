import React from 'react';

/**
 * Skeleton loaders tailored for different lazy-loaded sections
 * These maintain proper layout while data is being fetched
 */

export const SectionSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        ))}
    </div>
);

export const ReviewSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);

export const HeroSkeleton: React.FC = () => (
    <div className="w-full h-96 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
);

export const FormSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
            </div>
        ))}
    </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
        ))}
    </div>
);
