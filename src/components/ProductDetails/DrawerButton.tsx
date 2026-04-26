import React from "react";
import { CaretRight } from "@phosphor-icons/react";

interface DrawerButtonProps {
    label: string;
    onClick: () => void;
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ label, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center py-4 group transition-all border-b border-slate-50 last:border-none">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-brown/70 group-hover:text-brand-brown">{label}</span>
        <CaretRight size={18} className="text-slate-300 group-hover:text-brand-brown group-hover:translate-x-1 transition-all" />
    </button>
);

export default DrawerButton;