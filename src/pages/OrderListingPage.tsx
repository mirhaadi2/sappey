import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass,
    FunnelSimple,
    CheckCircle,
    ArrowRight,
    Eye,
    CalendarBlank,
    Receipt,
    DownloadSimple,
    TrendUp,
    Warning,
    CaretLeft,
    CaretRight,
    CurrencyInr
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../api/orders/hooks";
import { ORDER_STATUS_CONFIG, getStatusConfig, getStatusLabel } from "../utils/orderStatusMapper";
import { OrderListingSkeleton } from "../components/Skeletons";

// --- Types ---
type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "FAILED";
type SortBy = "date-newest" | "date-oldest" | "amount-high" | "amount-low";

interface OrderFilter {
    status: OrderStatus | "ALL";
    dateFrom: string;
    dateTo: string;
}

const OrderListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
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
    const itemsPerPage = 8;

    // --- Logic: Filtering & Sorting ---
    const processedOrders = useMemo(() => {
        let result = [...orders];

        if (filters.status !== "ALL") {
            result = result.filter((o) => o?.status === filters.status);
        }

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            result = result.filter((o) => new Date(o?.createdAt ?? new Date()) >= fromDate);
        }
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter((o) => new Date(o?.createdAt ?? new Date()) <= toDate);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (o) =>
                    o?.orderNumber?.toLowerCase?.()?.includes(q) ||
                    o?.id?.toLowerCase?.()?.includes(q),
            );
        }

        switch (sortBy) {
            case "date-newest":
                result.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                break;
            case "date-oldest":
                result.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                );
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

    const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return processedOrders.slice(startIdx, startIdx + itemsPerPage);
    }, [processedOrders, currentPage]);

    const stats = useMemo(() => {
        const totalSpent = (orders ?? []).reduce(
            (sum, o) => sum + Number(o?.finalAmount ?? 0),
            0,
        );
        const delivered = (orders ?? []).filter((o) => o?.status === "DELIVERED").length;
        return { totalSpent, delivered, count: (orders ?? []).length };
    }, [orders]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Warning size={32} weight="duotone" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Access Denied
                    </h2>
                    <p className="text-slate-500 mb-6">
                        You must be authenticated to view the order ledger.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <OrderListingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
                            Purchase Orders
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">
                            Enterprise Procurement Management
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                            <DownloadSimple weight="bold" /> Export Ledger
                        </button>
                        <button
                            onClick={() => navigate("/shop")}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#9a5d2e] rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            Create New Order <ArrowRight weight="bold" />
                        </button>
                    </motion.div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        {
                            label: "Total Volume",
                            value: stats.count,
                            icon: Receipt,
                            color: "text-blue-600",
                            bg: "bg-blue-50",
                        },
                        {
                            label: "Total Expenditure",
                            value: `${stats.totalSpent.toLocaleString()}`,
                            icon: CurrencyInr,
                            color: "text-emerald-600",
                            bg: "bg-emerald-50",
                        },
                        {
                            label: "Fulfilled",
                            value: stats.delivered,
                            icon: CheckCircle,
                            color: "text-indigo-600",
                            bg: "bg-indigo-50",
                        },
                        {
                            label: "Active Pipeline",
                            value: stats.count - stats.delivered,
                            icon: TrendUp,
                            color: "text-amber-600",
                            bg: "bg-amber-50",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-2xl shadow-sm border-b-4 border-b-slate-100"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                                    <item.icon size={20} weight="duotone" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Live Data
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-500">{item.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                {item.value}
                            </h3>
                        </motion.div>
                    ))}
                </div>

                {/* Global Search & Control Bar */}
                <div className="sticky top-6 z-40 mb-8">
                    <div className="bg-white/80 backdrop-blur-xl border border-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <MagnifyingGlass
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                                weight="bold"
                            />
                            <input
                                type="text"
                                placeholder="Search by Order #, UUID, or SKU..."
                                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all border ${showFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"}`}
                            >
                                <FunnelSimple weight="bold" /> Filters
                            </button>
                            <div className="h-8 w-px bg-slate-200 mx-1 hidden lg:block" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="bg-slate-50 border-none text-sm font-bold text-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                            >
                                <option value="date-newest">Sort: Newest</option>
                                <option value="date-oldest">Sort: Oldest</option>
                                <option value="amount-high">Sort: High Price</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white border border-slate-200 mt-2 p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">
                                            Status Filter
                                        </label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) =>
                                                setFilters({
                                                    ...filters,
                                                    status: e.target.value as any,
                                                })
                                            }
                                            className="w-full bg-slate-50 border-slate-100 rounded-lg text-sm font-bold p-2.5 focus:border-indigo-500 outline-none"
                                        >
                                            <option value="ALL">All Orders</option>
                                            {Object.keys(ORDER_STATUS_CONFIG ?? {}).map((s) => (
                                                <option key={s} value={s}>
                                                    {getStatusLabel(s)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">
                                            Starting Date
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.dateFrom}
                                            onChange={(e) =>
                                                setFilters({ ...filters, dateFrom: e.target.value })
                                            }
                                            className="w-full bg-slate-50 border-slate-100 rounded-lg text-sm font-bold p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">
                                            Actions
                                        </label>
                                        <button
                                            onClick={() =>
                                                setFilters({ status: "ALL", dateFrom: "", dateTo: "" })
                                            }
                                            className="text-indigo-600 text-xs font-bold hover:underline"
                                        >
                                            Reset Parameters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Data Presentation Layer */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                        Order Information
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                        Date & Timeline
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                        Status
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">
                                        Items
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">
                                        Value (INR)
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-20 text-center text-slate-400 font-bold animate-pulse"
                                        >
                                            Synchronizing Data...
                                        </td>
                                    </tr>
                                ) : paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-20 text-center text-slate-400 font-bold"
                                        >
                                            No records matched your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order, idx) => {
                                        const config = getStatusConfig(order.status);
                                        return (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                                            <Receipt weight="duotone" size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                                {order?.orderNumber ?? 'N/A'}
                                                            </p>
                                                            {/* <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">#{order?.id?.slice(0, 12) ?? ''}</p> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <CalendarBlank
                                                            size={16}
                                                            className="text-slate-400"
                                                        />
                                                        {new Date(order?.createdAt ?? new Date()).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 ml-6">
                                                        Recorded at{" "}
                                                        {new Date(order?.createdAt ?? new Date()).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div
                                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${config?.bg} ${config?.text} text-[11px] font-black uppercase tracking-wider`}
                                                    >
                                                        <div
                                                            className={`w-1.5 h-1.5 rounded-full ${config?.dot ?? config?.dot}`}
                                                        />
                                                        {config?.label}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {order?.itemsCount ?? 0}{" "}
                                                        {Number(order?.itemsCount ?? 0) === 1 ? "item" : "items"}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-base font-black text-slate-950">
                                                        ₹
                                                        {parseFloat(
                                                            order?.finalAmount ?? "0",
                                                        ).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                    <p
                                                        className={`text-[9px] font-black uppercase tracking-tighter ${(order?.paymentStatus === "COMPLETED") ? "text-emerald-500" : "text-amber-500"}`}
                                                    >
                                                        {order?.paymentStatus ?? 'PENDING'}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                                                        title="View Transaction Details"
                                                    >
                                                        <Eye size={22} weight="bold" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="bg-slate-50/80 px-8 py-5 border-t border-slate-100 flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Page {currentPage} of {totalPages || 1}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:shadow-sm"
                            >
                                <CaretLeft weight="bold" />
                            </button>
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:shadow-sm"
                            >
                                <CaretRight weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderListingPage;
