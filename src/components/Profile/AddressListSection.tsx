import React from "react";
import { motion } from "framer-motion";
import { House, Briefcase, MapPin, Check, Pencil, Trash, MapTrifold } from "@phosphor-icons/react";
import { AddressListSectionProps } from "../../types";

const AddressListSection: React.FC<AddressListSectionProps> = ({
    addresses,
    showAddressForm,
    onAddAddress,
    onSetDefault,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {addresses.map((address) => (
                <motion.div
                    key={address.id} layout
                    className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-[20px] border transition-all ${address.isDefault ? 'border-brand-brown/30 bg-white shadow-xl shadow-brand-brown/5' : 'border-white bg-white shadow-sm hover:shadow-md hover:border-gray-100'}`}
                >
                    <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-colors ${address.isDefault ? 'bg-brand-brown text-white' : 'bg-brand-latte/10 text-brand-brown group-hover:bg-brand-brown group-hover:text-white'}`}>
                            {address.type === 'HOME' ? <House size={24} weight="duotone" /> : address.type === 'WORK' ? <Briefcase size={24} weight="duotone" /> : <MapPin size={28} weight="duotone" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-black text-lg text-brand-brown tracking-tight">{address.name || 'Personal Address'}</h4>
                                {address.isDefault && (
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20">
                                        Primary
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-bold text-gray-600">{address.addressLine1}</p>
                                <p className="text-xs font-medium text-gray-400">{address.city}, {address.state} • {address.postalCode}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {!address.isDefault && (
                            <button
                                onClick={() => onSetDefault(address.id)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Set Primary"
                            >
                                <Check size={16} weight="bold" />
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(address)}
                            className="p-2 text-gray-400 hover:text-brand-brown hover:bg-brand-latte/20 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Pencil size={16} weight="bold" />
                        </button>
                        <button
                            onClick={() => onDelete(address.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash size={16} weight="bold" />
                        </button>
                    </div>
                </motion.div>
            ))}

            {addresses.length === 0 && !showAddressForm && (
                <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-[40px]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapTrifold size={40} weight="duotone" className="text-gray-200" />
                    </div>
                    <h4 className="text-lg font-bold text-brand-brown">No addresses yet</h4>
                    <p className="text-gray-400 text-sm font-medium mt-1">Add your first shipping location to get started.</p>
                    <button
                        onClick={onAddAddress}
                        className="mt-6 px-8 py-3 bg-brand-latte/20 text-brand-brown rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-brown hover:text-white transition-all"
                    >
                        Create Address
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddressListSection;