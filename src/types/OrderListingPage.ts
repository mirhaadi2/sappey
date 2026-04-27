import type { Order } from "../api/orders/types";
import { StatusConfig } from "../utils/orderStatusMapper";

export type SortBy = "date-newest" | "date-oldest" | "amount-high" | "amount-low";

export type OrderFilter = {
    status: Order["status"] | "ALL";
    dateFrom: string;
    dateTo: string;
};

export interface OrderListingStats {
    total: number;
    active: number;
}

export interface OrderListingHeaderProps {
    stats: OrderListingStats;
    onNewOrder: () => void;
}

export interface OrderListingListProps {
    orders: Order[];
    getStatusConfig: (status: Order["status"]) => StatusConfig | undefined;
    onViewDetails: (orderId: string) => void;
}

export interface OrderListingPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface OrderListingSearchFiltersProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    sortBy: SortBy;
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
    showFilters: boolean;
    onToggleFilters: () => void;
    filters: OrderFilter;
    onUpdateFilters: React.Dispatch<React.SetStateAction<OrderFilter>>;
    onResetFilters: () => void;
}
