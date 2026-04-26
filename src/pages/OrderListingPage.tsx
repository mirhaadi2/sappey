import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Warning } from "@phosphor-icons/react";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { getStatusConfig } from "../utils/orderStatusMapper";
import { OrderListingHeader, OrderListingSearchFilters, OrderListingList, OrderListingPagination } from "../components/OrderListing";
import { OrderListingSkeleton } from "../components/Skeletons";
import { OrderFilter, SortBy } from "../types/OrderListingPage";

const OrderListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useWebsiteAuth();
    const { orders = [], isLoading } = useOrders();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("date-newest");
    const [filters, setFilters] = useState<OrderFilter>({
        status: "ALL",
        dateFrom: "",
        dateTo: "",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const processedOrders = useMemo(() => {
        let result = [...orders];

        if (filters.status !== "ALL") {
            result = result.filter((order) => order.status === filters.status);
        }

        if (filters.dateFrom) {
            result = result.filter((order) => new Date(order.createdAt) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter((order) => new Date(order.createdAt) <= toDate);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (order) =>
                    order.orderNumber?.toLowerCase().includes(query) ||
                    order.id.toLowerCase().includes(query),
            );
        }

        switch (sortBy) {
            case "date-newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "date-oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "amount-high":
                result.sort((a, b) => Number(b.finalAmount) - Number(a.finalAmount));
                break;
            case "amount-low":
                result.sort((a, b) => Number(a.finalAmount) - Number(b.finalAmount));
                break;
        }

        return result;
    }, [orders, filters, searchQuery, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [processedOrders.length]);

    const stats = useMemo(() => {
        const total = orders.reduce((sum, order) => sum + parseFloat(order.finalAmount || "0"), 0);
        const active = orders.filter((order) => ["PROCESSING", "SHIPPED"].includes(order.status)).length;
        return { total, active };
    }, [orders]);

    const totalPages = Math.max(1, Math.ceil(processedOrders.length / itemsPerPage));
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [processedOrders, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 max-w-sm"
                >
                    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
                        <Warning size={40} weight="duotone" className="text-rose-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Access Restricted</h2>
                    <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                        Please sign in to your Sappey account to manage your purchase history.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-4 bg-[#3d2b1f] text-white rounded-2xl font-bold transition-all hover:bg-black hover:shadow-2xl active:scale-95"
                    >
                        Return to Portal
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isLoading) {
        return <OrderListingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 selection:bg-brand-cocoa/20">
            <div className="max-w-7xl mx-auto px-8 pt-12">
                <OrderListingHeader stats={stats} onNewOrder={() => navigate("/shop")} />

                <OrderListingSearchFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters((current) => !current)}
                    filters={filters}
                    onUpdateFilters={setFilters}
                    onResetFilters={() => setFilters({ status: "ALL", dateFrom: "", dateTo: "" })}
                />

                <OrderListingList
                    orders={paginatedOrders}
                    getStatusConfig={getStatusConfig}
                    onViewDetails={(orderId) => navigate(`/orders/${orderId}`)}
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
