import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebsiteAuth } from "../context/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { motion } from "framer-motion";
import { Warning } from "@phosphor-icons/react";
import { getStatusConfig } from "../utils/orderStatusMapper";
import { 
  OrderListingHeader, 
  OrderListingSearchFilters, 
  OrderListingList, 
  OrderListingPagination 
} from "../components/OrderListing";
import { OrderListingSkeleton } from "../components/Skeletons";
import { OrderFilter, SortBy } from "../types/OrderListingPage";

const OrderListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useWebsiteAuth();

    // 1. Unified State for Server-Side sync
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("date-newest");
      const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<OrderFilter>({
        status: "ALL",
        dateFrom: "", // If your backend supports date filtering, pass these to useOrders
        dateTo: "",
    });

    const itemsPerPage = 6;
    const offset = (currentPage - 1) * itemsPerPage;

    // 2. Fetch data based on UI State
    const { 
        orders, 
        isLoading, 
        total, 
        isFetching 
    } = useOrders({
        limit: itemsPerPage,
        offset: offset,
        status: filters.status !== "ALL" ? filters.status : undefined,
        search: searchQuery.trim() || undefined,
        sortBy: sortBy,
        enabled: !!currentUser
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 3. Reset to page 1 when any filter/search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, filters.status]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Calculate total pages from backend total count
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

    // Stats are now derived from the currently fetched slice or a separate "stats" endpoint
    // For a senior approach, you'd usually have a separate API for global stats
    const stats = {
        total: total, // Representing total orders in DB
        active: orders.filter(o => ["PROCESSING", "SHIPPED"].includes(o.status)).length
    };

    if (isLoading) return <OrderListingSkeleton />;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-12">
            <div className="max-w-7xl mx-auto px-8 pt-12">
                <OrderListingHeader 
                    stats={stats} 
                    onNewOrder={() => navigate("/shop")} 
                />

                <OrderListingSearchFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    filters={filters}
                    onUpdateFilters={setFilters}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters((current) => !current)}
                    onResetFilters={() => setFilters({ status: "ALL", dateFrom: "", dateTo: "" })}
                />

                {/* Optional: Visual indicator that background fetching is happening */}
                {isFetching && <div className="text-xs text-slate-400 animate-pulse">Syncing with server...</div>}

                <OrderListingList
                    orders={orders} // These are already filtered and paginated by the backend
                    getStatusConfig={getStatusConfig}
                    onViewDetails={(id) => navigate(`/orders/${id}`)}
                />

                <OrderListingPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default OrderListingPage;