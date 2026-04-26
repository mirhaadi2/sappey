import React from "react";
import { ClockCounterClockwise } from "@phosphor-icons/react";

interface ComingSoonPlaceholderProps {
    label: string;
}

const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({ label }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-brown shadow-sm">
            <ClockCounterClockwise size={24} weight="duotone" className="animate-spin-slow" />
        </div>
        <div>
            <h4 className="font-headline text-brand-brown text-lg">Coming Soon</h4>
            <p className="text-slate-400 text-xs max-w-[200px] mx-auto">We are currently updating the {label} for this product.</p>
        </div>
    </div>
);

export default ComingSoonPlaceholder;