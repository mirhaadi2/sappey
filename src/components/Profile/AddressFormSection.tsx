import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CircleNotch } from "@phosphor-icons/react";
import { Input } from "../common";
import { AddressFormSectionProps } from "../../types";

const ADDRESS_TYPES = [
    { id: "HOME" as const, label: "Home", icon: () => null },
    { id: "WORK" as const, label: "Work", icon: () => null },
    { id: "OTHER" as const, label: "Other", icon: () => null },
] as const;

const AddressFormSection: React.FC<AddressFormSectionProps> = ({
    showAddressForm,
    selectedAddressType,
    onAddressTypeSelect,
    form,
    onSubmit,
    onCancel,
    isCreating,
    isUpdating,
}) => {
    return (
        <AnimatePresence mode="wait">
            {showAddressForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-10"
                >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40">
                        <div className="mb-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-brown/50 mb-4 block">Select Category</label>
                            <div className="flex flex-wrap gap-3">
                                {ADDRESS_TYPES.map(t => (
                                    <button
                                        key={t.id} type="button"
                                        onClick={() => onAddressTypeSelect(t.id)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedAddressType === t.id ? 'bg-brand-brown text-white shadow-xl shadow-brand-brown/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="First Name" placeholder="John" name="firstName" register={form.register} error={form.formState.errors.firstName} />
                            <Input label="Last Name" placeholder="Doe" name="lastName" register={form.register} error={form.formState.errors.lastName} />
                            <div className="md:col-span-2">
                                <Input label="Street Address" placeholder="Building, Street, Area" name="addressLine1" register={form.register} error={form.formState.errors.addressLine1} />
                            </div>
                            <Input label="City" placeholder="Enter City" name="city" register={form.register} error={form.formState.errors.city} />
                            <Input label="State" placeholder="Enter State" name="state" register={form.register} error={form.formState.errors.state} />
                            <Input label="Postal Code" placeholder="ZIP Code" name="postalCode" register={form.register} error={form.formState.errors.postalCode} />
                            <Input label="Country" placeholder="Enter Country" name="country" register={form.register} error={form.formState.errors.country} />
                            <Input label="Contact Number" placeholder="10 Digit Phone" name="phone" register={form.register} error={form.formState.errors.phone} />
                        </div>

                        <div className="flex items-center gap-4 mt-10 pt-8 border-t border-gray-50">
                            <button type="submit" disabled={isCreating || isUpdating} className="flex-1 py-4 bg-brand-brown text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-brand-brown/30 transition-all flex items-center justify-center gap-3">
                                {isCreating || isUpdating ? <CircleNotch className="animate-spin" size={18} /> : <Check size={18} weight="bold" />}
                                {isCreating || isUpdating ? 'Saving...' : 'Confirm & Save Location'}
                            </button>
                            <button type="button" onClick={onCancel} className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddressFormSection;