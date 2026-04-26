import React from 'react';
import { motion } from 'framer-motion';
import { FunnelSimple } from '@phosphor-icons/react';

interface EmptyStateProps {
    onResetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-brand-latte"
        >
            <div className="w-24 h-24 bg-brand-latte rounded-full flex items-center justify-center mb-6">
                <FunnelSimple size={40} weight="thin" className="text-brand-brown opacity-40" />
            </div>
            <h3 className="text-2xl font-headline text-brand-brown mb-2">No items found</h3>
            <p className="text-slate-400 mb-8 max-w-xs text-center">Try adjusting your filters or search terms.</p>
            <button
                onClick={onResetFilters}
                className="px-10 py-4 bg-brand-brown text-brand-cream rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:-translate-y-1 transition-all"
            >
                Reset Filters
            </button>
        </motion.div>
    );
};

export default EmptyState;
