import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass,
    FunnelSimple,
    CheckCircle,
    CalendarBlank,
    Warning,
    CaretLeft,
    CaretRight,
    CurrencyInr,
    Tag,
    MapPin,
    Truck,
    Clock,
    XCircle,
    Plus
} from "@phosphor-icons/react";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useOrders } from "../api/orders/hooks";
import { getStatusConfig, getStatusLabel } from "../utils/orderStatusMapper";
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

    if (!currentUser) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-10 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-sm">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Warning size={40} weight="duotone" className="text-rose-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Access Restricted</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">Your journey begins with a secure login. Please sign in to view your orders.</p>
                <button onClick={() => navigate("/")} className="w-full py-4 bg-[#3d2b1f] text-white rounded-2xl font-bold transition-all hover:bg-black hover:shadow-lg active:scale-95">Return to Login</button>
            </motion.div>
        </div>
    );

    if (isLoading) return <OrderListingSkeleton />;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-20 selection:bg-[#3d2b1f]/10">
            {/* Header / Premium Search */}


            <div className="max-w-7xl mx-auto px-6 pt-10">

                {/* Horizontal Status Scroller */}
                {/* <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
                    {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setFilters({ ...filters, status: s as any }); setCurrentPage(1); }}
                            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3 ${filters.status === s ? "bg-[#3d2b1f] text-white shadow-xl shadow-brown-900/20" : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300"}`}
                        >
                            {s === "ALL" ? "All Orders" : getStatusLabel(s)}
                            <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] ${filters.status === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                                {orders.filter(o => s === "ALL" ? true : o.status === s).length}
                            </span>
                        </button>
                    ))}
                </div> */}
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
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown group-focus-within:text-[#3d2b1f] transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search Order ID..."
                                    className="min-w-[280px] bg-transparent border border-brand-brown rounded-2xl pl-12 pr-4 py-2 text-sm font-medium transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#fff]/5"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-xl border transition-all ${showFilters ? 'bg-[#3d2b1f] text-white shadow-lg shadow-brown-900/20' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                            >
                                <FunnelSimple size={20} weight="bold" />
                            </button>
                        </div>
                        <button
                            onClick={() => navigate("/shop")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#9a5d2e] text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-orange-900/10 active:scale-95"
                        >
                            Create New Entry <Plus weight="bold" size={16} />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-12">
                            <div className="bg-[#3d2b1f] p-8 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
                                {/* Decorative circle for UI depth */}
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase mb-3 block tracking-widest">Start Date</label>
                                    <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-3 text-sm focus:bg-white/20 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase mb-3 block tracking-widest">End Date</label>
                                    <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="w-full bg-white/10 border border-white/10 text-white rounded-xl p-3 text-sm focus:bg-white/20 outline-none transition-all" />
                                </div>
                                <div className="flex items-end">
                                    <button onClick={() => setFilters({ status: "ALL", dateFrom: "", dateTo: "" })} className="w-full py-3.5 bg-white text-[#3d2b1f] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-transform active:scale-95">Reset Filters</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Orders Grid */}
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
                                            className="px-6 py-2 bg-[#9a5d2e] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brown-900/10 hover:bg-black hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 group/btn"
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

                {/* Sophisticated Pagination */}
                {totalPages > 1 && (
                    <div className="mt-20 flex items-center justify-center gap-8 pb-10">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#3d2b1f] disabled:opacity-20 transition-all"
                        >
                            <CaretLeft weight="bold" /> Prev
                        </button>

                        <div className="flex gap-4">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`w-10 h-10 rounded-2xl text-[11px] font-black transition-all ${currentPage === i + 1 ? "bg-[#3d2b1f] text-white shadow-lg shadow-brown-900/20 scale-110" : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300"}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#3d2b1f] disabled:opacity-20 transition-all"
                        >
                            Next <CaretRight weight="bold" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderListingPage;