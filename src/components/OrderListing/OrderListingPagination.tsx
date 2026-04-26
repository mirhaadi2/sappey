import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface OrderListingPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const OrderListingPagination: React.FC<OrderListingPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-24 flex items-center justify-center gap-10">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-brand-brown disabled:opacity-20 transition-all"
            >
                <CaretLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                Previous
            </button>

            <div className="flex items-center gap-4">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onPageChange(index + 1)}
                        className={`relative w-12 h-12 rounded-2xl text-[11px] font-black transition-all ${currentPage === index + 1
                            ? "bg-brand-brown text-white shadow-2xl shadow-brand-brown/30 scale-110"
                            : "bg-white text-slate-400 border border-slate-100 hover:border-brand-brown/30"
                            }`}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </button>
                ))}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-brand-brown disabled:opacity-20 transition-all"
            >
                Next
                <CaretRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default OrderListingPagination;
