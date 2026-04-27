import React from 'react';
import { FunnelSimple, GridFour, SquaresFour, Rows } from '@phosphor-icons/react';
import { SortOption, ViewMode, FilterControlsProps } from '../../types/ShopPage';

const FilterControls: React.FC<FilterControlsProps> = ({
    sortBy,
    viewMode,
    onSortChange,
    onViewModeChange,
}) => {
    return (
        <div className="sticky top-24 z-30 flex flex-wrap items-center justify-between gap-3 p-2 px-4 bg-white backdrop-blur-2xl border border-white/80 rounded-[28px] shadow-2xl shadow-brand-brown/5">
            {/* Sort Section */}
            <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-brown/5 rounded-full">
                    <FunnelSimple size={16} className="text-brand-brown" />
                </div>

                <div className="flex gap-4 px-2">
                    {['default', 'price-asc', 'price-desc'].map((option) => (
                        <button
                            key={option}
                            onClick={() => onSortChange(option as SortOption)}
                            className={`text-[11px] font-bold uppercase tracking-tighter transition-all ${sortBy === option ? "text-orange-500" : "text-brand-brown/40 hover:text-brand-brown"
                                }`}
                        >
                            {option === "default" && "Recommended"}
                            {option === "price-asc" && "Price ↑"}
                            {option === "price-desc" && "Price ↓"}
                        </button>
                    ))}
                </div>
            </div>

            {/* View Switcher (Right Side) */}
            <div className="flex items-center gap-1 bg-brand-brown/5 p-1 rounded-full">
                {[
                    { id: "grid-4", icon: GridFour },
                    { id: "grid-3", icon: SquaresFour },
                    { id: "grid-2", icon: Rows }
                ].map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onViewModeChange(mode.id as ViewMode)}
                        className={`p-2 rounded-full transition-all ${viewMode === mode.id
                            ? "bg-brand-brown text-white shadow-inner"
                            : "text-brand-brown/30 hover:text-brand-brown/60"
                            }`}
                    >
                        <mode.icon size={16} weight={viewMode === mode.id ? "fill" : "regular"} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterControls;
