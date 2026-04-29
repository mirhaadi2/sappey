import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";
import { OrderFilter, OrderListingSearchFiltersProps, SortBy } from "../../types/OrderListingPage";

const OrderListingSearchFilters: React.FC<OrderListingSearchFiltersProps> = ({
    searchQuery, // This is the 'debounced' value from the parent
    setSearchQuery,
    sortBy,
    setSortBy,
    showFilters,
    onToggleFilters,
    filters,
    onUpdateFilters,
    onResetFilters,
}) => {
    // 1. Local state for immediate input feedback (prevents UI lag)
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // 2. Debounce Logic: Only update the parent (and trigger API) 500ms after user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(localSearch);
        }, 500);

        return () => clearTimeout(handler);
    }, [localSearch, setSearchQuery]);

    // 3. Sync local search if parent resets it
    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <MagnifyingGlass 
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-brown transition-colors" 
                        size={20} 
                    />
                    <input
                        type="text"
                        placeholder="Track by Order Number or ID..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium transition-all shadow-sm focus:ring-4 focus:ring-brand-cream/20 focus:border-brand-brown outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="bg-white border border-slate-100 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:border-brand-brown transition-all appearance-none"
                    >
                        <option value="date-newest">Recently Placed</option>
                        <option value="date-oldest">Oldest First</option>
                        <option value="amount-high">Highest Amount</option>
                        <option value="amount-low">Lowest Amount</option>
                    </select>

                    <button
                        onClick={onToggleFilters}
                        className={`flex items-center gap-3 px-6 rounded-2xl border transition-all active:scale-95 ${
                            showFilters 
                                ? 'bg-brand-brown text-white shadow-xl border-brand-brown' 
                                : 'bg-white text-slate-600 border-slate-100 hover:border-brand-brown'
                        }`}
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
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Order Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => onUpdateFilters((prev) => ({ ...prev, status: e.target.value as OrderFilter['status'] }))}
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-brown outline-none cursor-pointer"
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            {/* Date filters: Ensure your backend SQL is updated to handle 'dateFrom' and 'dateTo' */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">From Date</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => onUpdateFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-brown"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">To Date</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => onUpdateFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-brown"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setLocalSearch(""); // Clear local state too
                                        onResetFilters();
                                    }}
                                    className="w-full py-3.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OrderListingSearchFilters;