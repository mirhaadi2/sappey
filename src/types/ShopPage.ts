import { Product } from './index';

// ============================================
// Filter & Sort Types
// ============================================
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
export type ViewMode = 'grid-4' | 'grid-3' | 'grid-2';

export interface ProductFilters {
    categoryId?: string;
    search?: string;
    isBestseller?: boolean;
    isNew?: boolean;
    isCustomerFavourites?: boolean;
    sort: SortOption;
    limit: number;
}

// ============================================
// Component Props Types
// ============================================
export interface ShopHeaderProps {
    onScroll?: () => void;
}

export interface FilterControlsProps {
    sortBy: SortOption;
    viewMode: ViewMode;
    onSortChange: (sort: SortOption) => void;
    onViewModeChange: (mode: ViewMode) => void;
}

export interface ProductGridProps {
    products: Product[];
    viewMode: ViewMode;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    hasNextPage: boolean;
}

export interface ProductResultsHeaderProps {
    activeCategory: string;
    productCount: number;
}

export interface EmptyStateProps {
    onResetFilters: () => void;
}

// ============================================
// Layout Types
// ============================================
export interface StaggerContainerVariants {
    hidden: { opacity: number };
    visible: {
        opacity: number;
        transition: {
            staggerChildren: number;
        };
    };
}

export interface ShopPageContextValue {
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}
