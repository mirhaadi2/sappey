import React from "react";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { OrderListingPaginationProps } from "../../types/OrderListingPage";

const OrderListingPagination: React.FC<OrderListingPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {

    if (totalPages <= 1) return null;

    // RESPONSIVE PAGE LOGIC
    const generatePages = () => {

        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {

            pages.push(1);

            if (currentPage > 3) {
                pages.push("start-ellipsis");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("end-ellipsis");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = generatePages();

    return (
        <div className="mt-10 flex items-center justify-center">

            <div className="flex items-center gap-1 rounded-full border border-[#ECE4D8] bg-white/80 backdrop-blur-xl px-2 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-x-auto max-w-full scrollbar-hide">

                {/* PREVIOUS */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7A746B] transition-all duration-300 hover:bg-[#F7F2EA] hover:text-[#1A1815] disabled:pointer-events-none disabled:opacity-30"
                >
                    <CaretLeft size={15} weight="bold" />
                </button>

                {/* PAGE NUMBERS */}
                <div className="flex items-center gap-1">

                    {visiblePages.map((page, index) => {

                        // ELLIPSIS
                        if (typeof page === "string") {
                            return (
                                <div
                                    key={page + index}
                                    className="flex h-9 w-9 items-center justify-center text-[#8B847B]"
                                >
                                    <DotsThree size={16} weight="bold" />
                                </div>
                            );
                        }

                        const active = currentPage === page;

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative flex h-9 min-w-[36px] shrink-0 items-center justify-center rounded-full px-3 text-[12px] font-medium transition-all duration-300 ${
                                    active
                                        ? "text-[#1A1815]"
                                        : "text-[#8B847B] hover:text-[#1A1815]"
                                }`}
                            >

                                {/* ACTIVE INDICATOR */}
                                {active && (
                                    <motion.div
                                        layoutId="pagination-pill"
                                        className="absolute inset-0 rounded-full bg-[#F3ECE2]"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <span className="relative z-10">
                                    {String(page).padStart(2, "0")}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* NEXT */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7A746B] transition-all duration-300 hover:bg-[#F7F2EA] hover:text-[#1A1815] disabled:pointer-events-none disabled:opacity-30"
                >
                    <CaretRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

export default OrderListingPagination;