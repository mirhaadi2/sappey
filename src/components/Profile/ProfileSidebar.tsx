import React from "react";
import {
    User, Envelope, Plus, CaretRight, ShieldCheck, IdentificationCard,
} from "@phosphor-icons/react";
import { ProfileSidebarProps } from "../../types";

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    currentUser,
    onAddAddress,
    onEditProfile,
}) => {
    return (
        <aside className="lg:col-span-4 space-y-6">
            <div className="relative overflow-hidden bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-latte/20 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-brand-latte to-brand-brown/20 rounded-[32px] flex items-center justify-center shadow-inner">
                            <User size={48} weight="duotone" className="text-brand-brown" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-50">
                            <ShieldCheck size={18} weight="fill" className="text-emerald-500" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-brand-brown tracking-tight mb-1">{currentUser.name}</h1>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Envelope size={14} weight="bold" />
                        <p className="text-sm font-medium">{currentUser.email}</p>
                    </div>
                </div>

                <div className="mt-10 space-y-3">
                    <button
                        onClick={onAddAddress}
                        className="w-full flex items-center justify-between p-4 bg-brand-brown text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-brown/20"
                    >
                        <div className="flex items-center gap-3">
                            <Plus weight="bold" size={16} />
                            <span>Add New Address</span>
                        </div>
                        <CaretRight weight="bold" />
                    </button>

                    <button
                        onClick={onEditProfile}
                        className="w-full flex items-center justify-between p-4 bg-brand-latte/10 text-brand-brown rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-latte/30 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <IdentificationCard weight="duotone" size={18} />
                            <span>Edit Profile Details</span>
                        </div>
                        <CaretRight weight="bold" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ProfileSidebar;