import React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { ProfileNavigationProps } from "../../types";

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
    onBack,
    onViewOrders,
}) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <button
                onClick={onBack}
                className="group flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-all"
            >
                <div className="p-2 bg-brand-latte/20 rounded-lg group-hover:bg-brand-brown group-hover:text-white transition-colors">
                    <ArrowLeft size={16} weight="bold" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-brand-brown">Back to Store</span>
            </button>

            <div className="flex items-center gap-2">
                <button
                    onClick={onViewOrders}
                    className="px-6 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-brown transition-colors"
                >
                    View Orders
                </button>
            </div>
        </div>
    );
};

export default ProfileNavigation;