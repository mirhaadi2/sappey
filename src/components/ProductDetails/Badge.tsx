import React from "react";

interface BadgeProps {
    icon: React.ReactNode;
    text: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ icon, text }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-latte rounded-lg text-brand-brown">{icon}</div>
        <span className="text-[10px] font-bold uppercase leading-tight text-slate-500">{text}</span>
    </div>
);

export default Badge;