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
            <div className="relative overflow-hidden bg-white p-4 rounded-[24px] border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-latte/20 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="relative z-10 flex flex-row items-center gap-5">
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-brand-latte to-brand-brown/20 rounded-[20px] flex items-center justify-center shadow-inner overflow-visible">
                            <User size={30} weight="duotone" className="text-brand-brown" />
                        </div>
                        {/* Verified Badge */}
                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md border border-gray-50 flex items-center justify-center">
                            <ShieldCheck size={14} weight="fill" className="text-emerald-500" />
                        </div>
                    </div>

                    {/* User Info Container */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-black text-brand-brown tracking-tight leading-none mb-1.5">
                            {currentUser.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Envelope size={16} weight="regular" className="opacity-70" />
                            <p className="text-sm font-medium leading-none">
                                {currentUser.email}
                            </p>
                        </div>
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