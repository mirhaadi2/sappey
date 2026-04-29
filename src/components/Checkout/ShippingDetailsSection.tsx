import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Buildings, House, CheckCircle, Plus } from "@phosphor-icons/react";
import { Address } from "../../types/address";
import { AddressForm } from "./index";
import { ShippingDetailsSectionProps } from "../../types";

const ShippingDetailsSection: React.FC<ShippingDetailsSectionProps> = ({
    form,
    userAddresses,
    existingAddresses,
    selectedAddressId,
    selectedAddressServiceable,
    selectedAddressServiceabilityLoading,
    newDestinationAddress,
    currentUser,
    existingCustomer,
    onToggleSavedAddress,
    onSetNewDestinationAddress,
    onCancelNewAddress,
    onDeliveryPincodeServiceabilityChange,
}) => {
    const addresses = currentUser ? userAddresses : existingAddresses;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-brand-brown/10 shadow-sm"
        >
            <h2 className="text-xl font-bold text-brand-brown mb-8 flex items-center gap-3">
                <div className="p-2 bg-brand-brown/5 rounded-xl">
                    <MapPin size={24} weight="duotone" />
                </div>
                Shipping Details
            </h2>

            {/* SAVED ADDRESSES GRID (Show for both Logged In and Recognized Guests) */}
            {(currentUser || existingCustomer) && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            {currentUser ? "Your Saved Addresses" : "Found in your profile"}
                        </h3>
                        <span className="text-[11px] font-bold text-brand-brown bg-brand-brown/5 px-2 py-1 rounded-md">
                            {addresses.length} Destinations
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address: Address) => {
                            const isSelected = selectedAddressId === address.id;
                            return (
                                <button
                                    key={address.id}
                                    type="button"
                                    onClick={() => onToggleSavedAddress(address)}
                                    className={`relative group text-left p-5 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                        ? 'border-brand-brown bg-brand-brown/[0.02] shadow-md shadow-brand-brown/5 ring-1 ring-brand-brown/10'
                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-brown text-white' : 'bg-slate-50 text-slate-400'}`}>
                                            {address.name?.toLowerCase().includes('office') ? <Buildings size={16} /> : <House size={16} />}
                                        </div>
                                        {isSelected ? (
                                            <CheckCircle size={22} weight="fill" className="text-brand-brown" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-brand-brown/30 transition-colors" />
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className={`text-sm font-bold ${isSelected ? 'text-brand-brown' : 'text-slate-800'}`}>
                                            {address.name || 'Personal Address'}
                                        </p>
                                        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-1">
                                            {address.addressLine1}, {address.city}
                                        </p>
                                        <p className="text-[12px] font-medium text-slate-400">
                                            {address.state}, {address.postalCode}
                                        </p>
                                        {isSelected && (
                                            <p className={`text-[12px] font-semibold ${selectedAddressServiceable === true ? 'text-emerald-700' : selectedAddressServiceable === false ? 'text-red-700' : 'text-slate-500'}`}>
                                                {selectedAddressServiceabilityLoading
                                                    ? 'Checking delivery serviceability…'
                                                    : selectedAddressServiceable === true
                                                        ? 'Delivery available for this PIN code'
                                                        : selectedAddressServiceable === false
                                                            ? 'Delivery not available for this PIN code'
                                                            : ''
                                                }
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        {/* New Destination Button */}
                        {!newDestinationAddress ? (
                            <button
                                type="button"
                                onClick={() => onSetNewDestinationAddress(true)}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all min-h-[145px] ${!selectedAddressId
                                    ? 'border-brand-brown bg-brand-brown/[0.02] ring-1 ring-brand-brown/10'
                                    : 'border-slate-200 hover:border-brand-brown/40 hover:bg-slate-50 text-slate-400 hover:text-brand-brown'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all ${!selectedAddressId ? 'bg-brand-brown text-white' : 'bg-slate-100 group-hover:bg-brand-brown group-hover:text-white'
                                    }`}>
                                    <Plus size={20} weight="bold" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest">New Destination</p>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onCancelNewAddress}
                                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-brand-brown bg-brand-brown/[0.02] ring-1 ring-brand-brown/10 transition-all min-h-[145px] group"
                            >
                                <div className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center mb-3 shadow-lg shadow-brand-brown/20">
                                    <Plus size={20} weight="bold" className="rotate-45" /> {/* Rotated Plus = X */}
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-brand-brown">Cancel New Address</p>
                                <p className="text-[10px] mt-1 text-brand-brown/60">Back to saved list</p>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {((!selectedAddressId && addresses.length === 0) || newDestinationAddress) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-6 mt-4 border-t border-slate-100">
                            <AddressForm
                                form={form}
                                addressFieldPrefix="deliveryAddress"
                                showSaveInfo={!currentUser}
                                phoneLabel="Delivery Phone"
                                onPincodeServiceabilityChange={onDeliveryPincodeServiceabilityChange}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ShippingDetailsSection;