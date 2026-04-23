import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass,
    FunnelSimple,
    CheckCircle,
    Warning,
    CaretLeft,
    CaretRight,
    CurrencyInr,
    Tag,
    Truck,
    Clock,
    XCircle,
    Plus,
    Receipt
} from "@phosphor-icons/react";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { getStatusConfig } from "../utils/orderStatusMapper";
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
    const itemsPerPage = 6; // Reduced for more spacious layout

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

    const stats = useMemo(() => {
        const total = orders.reduce((acc, curr) => acc + parseFloat(curr.finalAmount || "0"), 0);
        const active = orders.filter(o => ["PROCESSING", "SHIPPED"].includes(o.status)).length;
        return { total, active };
    }, [orders]);

    const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return processedOrders.slice(startIdx, startIdx + itemsPerPage);
    }, [processedOrders, currentPage]);

    if (!currentUser) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 max-w-sm">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
                    <Warning size={40} weight="duotone" className="text-rose-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Access Restricted</h2>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">Please sign in to your Sappey account to manage your purchase history.</p>
                <button onClick={() => navigate("/")} className="w-full py-4 bg-[#3d2b1f] text-white rounded-2xl font-bold transition-all hover:bg-black hover:shadow-2xl active:scale-95">Return to Portal</button>
            </motion.div>
        </div>
    );

    if (isLoading) return <OrderListingSkeleton />;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 selection:bg-brand-cocoa/20">
            <div className="max-w-7xl mx-auto px-8 pt-12">

                {/* Upper Management Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="h-[1px] w-10 bg-brand-brown/30" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-brown/60">Orders & Logistics</span>
                        </div>
                        <h1 className="text-5xl font-light text-slate-900 tracking-tight">
                            Your <span className="font-serif italic text-brand-brown">Collections</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Summary Stats Pill */}
                        <div className="hidden lg:flex items-center bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm pr-6">
                            <div className="bg-brand-cream/30 p-2.5 rounded-xl mr-4">
                                <Receipt size={20} className="text-brand-brown" weight="duotone" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lifetime Spend</span>
                                <span className="text-sm font-bold text-slate-800 flex items-center">
                                    <CurrencyInr size={14} weight="bold" />
                                    {stats.total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/shop")}
                            className="group flex items-center gap-3 px-5 py-3 bg-[#65442e] text-white rounded-2xl font-bold text-sm hover:shadow-[0_20px_40px_-10px_rgba(61,43,31,0.3)] transition-all active:scale-95"
                        >
                            <span>New Order</span>
                            <div className="bg-white/10 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                                <Plus weight="bold" size={14} />
                            </div>
                        </button>
                    </div>
                </header>

                {/* Search & Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1 relative group">
                        <MagnifyingGlass className="absolute left-5 top-[45%] -translate-y-1/2 text-slate-400 group-focus-within:text-brand-brown transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Track by Order Number or ID..."
                            className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-3 text-sm font-medium transition-all shadow-sm focus:ring-4 focus:ring-brand-cream/20 focus:border-brand-brown outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            className="bg-white border border-slate-100 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:border-brand-brown transition-all"
                        >
                            <option value="date-newest">Recently Placed</option>
                            <option value="date-oldest">Oldest First</option>
                            <option value="amount-high">Highest Amount</option>
                            <option value="amount-low">Lowest Amount</option>
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-3 px-6 rounded-2xl border transition-all ${showFilters ? 'bg-brand-brown text-white shadow-xl' : 'bg-white text-slate-600 border-slate-100 hover:border-brand-brown'}`}
                        >
                            <FunnelSimple size={20} weight={showFilters ? "fill" : "bold"} />
                            <span className="text-xs font-black uppercase tracking-widest">Refine</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: "auto", opacity: 1, marginBottom: 48 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Order Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-brown outline-none"
                                    >
                                        <option value="ALL">All Statuses</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">From Date</label>
                                    <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">To Date</label>
                                    <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 outline-none" />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => setFilters({ status: "ALL", dateFrom: "", dateTo: "" })}
                                        className="w-full py-3.5 bg-brand-cream/20 text-brand-brown rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-brown hover:text-white transition-all active:scale-95"
                                    >
                                        Reset Configuration
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {paginatedOrders.length === 0 ? (
                        <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                            <Tag size={80} weight="duotone" className="mx-auto text-slate-100 mb-6" />
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Nothing to show</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">We couldn't find any orders matching your current criteria.</p>
                        </div>
                    ) : (
                        paginatedOrders?.map((order, idx) => {
                            const config = getStatusConfig(order.status);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="group relative bg-white rounded-2xl border border-slate-100 flex flex-col hover:border-[#3d2b1f]/20 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(61,43,31,0.12)]"
                                >
                                    {/* Top Metadata */}
                                    <div className="p-6 pb-4 flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-2 h-2 rounded-full animate-pulse ${config?.bg?.replace('bg-', 'bg-') || 'bg-slate-400'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${config?.text}`}>
                                                    {config?.label}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-black text-[#3d2b1f] tracking-tight group-hover:translate-x-1 transition-transform">
                                                {order.orderNumber || order.id.slice(-6).toUpperCase()}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-bold mt-1">Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { day: '2-digit', month: 'long' })}</p>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-2xl text-center min-w-[100px]">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Amount</p>
                                            <div className="flex items-center justify-center gap-0.5 text-[#3d2b1f] font-black text-lg">
                                                <CurrencyInr size={16} weight="bold" />
                                                {parseFloat(order.finalAmount || "0").toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Elevated Logistics Progress Bar */}
                                    <div className="px-4 py-3 mx-6 bg-[#FAF9F6] rounded-[2rem] border border-slate-50 flex items-center justify-between relative overflow-hidden">
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                                                <Clock size={20} weight="duotone" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dispatch</span>
                                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[80px]">Sappey Hub</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 px-4 flex flex-col items-center gap-2">
                                            <Truck size={18} weight="duotone" className={`transition-all duration-1000 ${order.status === "DELIVERED" ? "text-[#3d2b1f] ml-auto" : "text-slate-300"}`} />
                                            <div className="w-full h-[3px] bg-slate-200 rounded-full relative overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: order.status === "DELIVERED" ? "100%" : order.status === "SHIPPED" ? "60%" : "20%" }}
                                                    className="absolute inset-y-0 left-0 bg-[#3d2b1f]"
                                                />
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-3 relative z-10 text-right">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery</span>
                                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[80px]">Residence</span>
                                            </div>
                                            <div className={`w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center ${order.status === "DELIVERED" ? "bg-[#3d2b1f] text-white" : "bg-white text-slate-200"}`}>
                                                {order.status === "CANCELLED" ? <XCircle size={20} weight="fill" /> : <CheckCircle size={20} weight="fill" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="p-8 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-slate-400">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-tighter">Package</span>
                                                <span className="text-xs font-bold text-slate-600">{order.itemsCount} Premium Items</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="px-6 py-2 bg-[#65442e] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brown-900/10 hover:bg-black hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 group/btn"
                                        >
                                            View Details
                                            <CaretRight weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Aesthetic Pagination */}
                {totalPages > 1 && (
                    <div className="mt-24 flex items-center justify-center gap-10">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-brand-brown disabled:opacity-20 transition-all"
                        >
                            <CaretLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                            Previous
                        </button>

                        <div className="flex items-center gap-4">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`relative w-12 h-12 rounded-2xl text-[11px] font-black transition-all ${currentPage === i + 1
                                            ? "bg-brand-brown text-white shadow-2xl shadow-brand-brown/30 scale-110"
                                            : "bg-white text-slate-400 border border-slate-100 hover:border-brand-brown/30"
                                        }`}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-brand-brown disabled:opacity-20 transition-all"
                        >
                            Next
                            <CaretRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderListingPage;