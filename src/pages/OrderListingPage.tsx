import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass,
    FunnelSimple,
    CheckCircle,
    Eye,
    CalendarBlank,
    Receipt,
    Warning,
    CaretLeft,
    CaretRight,
    CurrencyInr,
    TrendUp,
    Tag,
    Plus
} from "@phosphor-icons/react";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { ORDER_STATUS_CONFIG, getStatusConfig, getStatusLabel } from "../utils/orderStatusMapper";
import { OrderListingSkeleton } from "../components/Skeletons";

// --- Types ---
type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";
type SortBy = "date-newest" | "date-oldest" | "amount-high" | "amount-low";

interface OrderFilter {
    status: OrderStatus | "ALL";
    dateFrom: string;
    dateTo: string;
}

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
    const itemsPerPage = 8;

    // --- Logic: Filtering & Sorting ---
    const processedOrders = useMemo(() => {
        let result = [...orders];
        if (filters.status !== "ALL") result = result.filter((o) => o?.status === filters.status);
        if (filters.dateFrom) result = result.filter((o) => new Date(o?.createdAt) >= new Date(filters.dateFrom));
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter((o) => new Date(o?.createdAt) <= toDate);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((o) => o?.orderNumber?.toLowerCase()?.includes(q) || o?.id?.toLowerCase()?.includes(q));
        }
        switch (sortBy) {
            case "date-newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
            case "date-oldest": result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
            case "amount-high": result.sort((a, b) => Number(b.finalAmount) - Number(a.finalAmount)); break;
            case "amount-low": result.sort((a, b) => Number(a.finalAmount) - Number(b.finalAmount)); break;
        }
        return result;
    }, [orders, filters, searchQuery, sortBy]);

    const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return processedOrders.slice(startIdx, startIdx + itemsPerPage);
    }, [processedOrders, currentPage]);

    const stats = useMemo(() => {
        const totalSpent = orders.reduce((sum, o) => sum + Number(o?.finalAmount ?? 0), 0);
        const delivered = orders.filter((o) => o?.status === "DELIVERED").length;
        return { totalSpent, delivered, count: orders.length };
    }, [orders]);

    if (!currentUser) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm">
                <Warning size={48} weight="duotone" className="text-rose-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
                <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg">Return to Login</button>
            </div>
        </div>
    );

    if (isLoading) return <OrderListingSkeleton />;

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-12">
                
                {/* --- Compact Header --- */}
                <div className="flex flex-row items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-[2px] w-8 bg-[#9a5d2e]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management Suite</span>
                        </div>
                        <h1 className="text-3xl font-light text-slate-900 leading-tight">
                            Purchase <span className="text-slate-400 italic">Orders</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/shop")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#9a5d2e] text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-orange-900/10 active:scale-95"
                    >
                        Create New Entry <Plus weight="bold" size={16} />
                    </button>
                </div>

                {/* --- Refined Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Volume", value: stats.count, icon: Receipt, color: "text-blue-600", bg: "bg-blue-50/50" },
                        { label: "Expenditure", value: `₹${stats.totalSpent.toLocaleString()}`, icon: CurrencyInr, color: "text-[#9a5d2e]", bg: "bg-orange-50/50" },
                        { label: "Fulfilled", value: stats.delivered, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50/50" },
                        { label: "Active Pipeline", value: stats.count - stats.delivered, icon: TrendUp, color: "text-amber-600", bg: "bg-amber-50/50" },
                    ].map((item, i) => (
                        <div key={i} className="relative overflow-hidden bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                            <div className="flex flex-col gap-3 relative z-10">
                                <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                                    <item.icon size={20} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{item.value}</h3>
                                </div>
                            </div>
                            <item.icon size={72} weight="fill" className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* --- Search & Filters (Slim Profile) --- */}
                <div className="flex flex-col md:flex-row gap-3 mb-8">
                    <div className="relative flex-1 group">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9a5d2e] transition-colors" size={18} weight="bold" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or SKU..."
                            className="w-full bg-white border border-slate-200 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-[#9a5d2e] transition-all placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-full border transition-all ${showFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                        >
                            <FunnelSimple weight="bold" /> Filters
                        </button>
                        
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-full px-5 py-3 pr-10 focus:outline-none hover:bg-slate-50 cursor-pointer appearance-none"
                            >
                                <option value="date-newest">Newest Records</option>
                                <option value="date-oldest">Oldest Records</option>
                                <option value="amount-high">High Value</option>
                            </select>
                            <CaretRight size={14} weight="bold" className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                            <div className="bg-slate-100/50 border border-slate-200 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Status</label>
                                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as any })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold outline-none">
                                        <option value="ALL">All Statuses</option>
                                        {Object.keys(ORDER_STATUS_CONFIG).map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">From Date</label>
                                    <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold outline-none" />
                                </div>
                                <div className="flex items-end">
                                    <button onClick={() => setFilters({ status: "ALL", dateFrom: "", dateTo: "" })} className="w-full py-2.5 px-4 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-black uppercase hover:bg-rose-100 transition-colors">Reset Filters</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Table Part (Remains robust as you requested) --- */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="pl-10 pr-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Placement Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lifecycle</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Qty</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Net Value</th>
                                    <th className="pl-6 pr-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-24 text-center">
                                            <Tag size={48} weight="duotone" className="mx-auto text-slate-200 mb-2" />
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Transactions Found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order) => {
                                        const config = getStatusConfig(order.status);
                                        return (
                                            <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="pl-10 pr-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#9a5d2e] group-hover:text-white transition-all duration-300">
                                                            <Receipt weight="bold" size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 group-hover:text-[#9a5d2e] transition-colors leading-none mb-1">{order?.orderNumber ?? 'UNTITLED'}</p>
                                                            <p className="text-[9px] font-mono font-bold text-slate-300 uppercase">Ref: {order?.id?.slice(-8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <CalendarBlank size={14} className="text-slate-300" />
                                                        {new Date(order?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config?.bg} ${config?.text} text-[9px] font-black uppercase tracking-widest`}>
                                                        <div className={`w-1 h-1 rounded-full animate-pulse ${config?.dot}`} />
                                                        {config?.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right text-sm font-black text-slate-900">
                                                    {order?.itemsCount} <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Units</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <p className="text-sm font-black text-slate-950">₹{parseFloat(order?.finalAmount ?? "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                    <span className={`text-[8px] font-black uppercase ${(order?.paymentStatus === "COMPLETED") ? "text-emerald-500" : "text-amber-500"}`}>{order?.paymentStatus}</span>
                                                </td>
                                                <td className="pl-6 pr-10 py-5 text-center">
                                                    <button onClick={() => navigate(`/orders/${order.id}`)} className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-[#9a5d2e] hover:text-white rounded-lg transition-all"><Eye size={16} weight="bold" /></button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Footer Pagination --- */}
                    <div className="bg-slate-50/50 px-10 py-4 flex justify-between items-center border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {currentPage} <span className="mx-2 text-slate-200">/</span> {totalPages || 1}
                        </p>
                        <div className="flex gap-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:border-[#9a5d2e] text-slate-600 transition-all shadow-sm"><CaretLeft weight="bold" size={16} /></button>
                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)} className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:border-[#9a5d2e] text-slate-600 transition-all shadow-sm"><CaretRight weight="bold" size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderListingPage;