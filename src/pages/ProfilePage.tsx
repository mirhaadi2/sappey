import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddresses } from "../api/address/hooks";
import ConfirmDialog from "../components/ConfirmDialog";
import { ProfilePageSkeleton } from "../components/Skeletons";
import {
  User, MapPin, Phone, Envelope, Pencil, Plus, Trash, Check,
  CircleNotch, ArrowLeft, House, Briefcase, ShoppingBag, ArrowRight
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Address type options (mapped to backend enum values)
const ADDRESS_TYPES = [
  { id: "HOME" as const, label: "Home", icon: House },
  { id: "WORK" as const, label: "Work", icon: Briefcase },
  { id: "OTHER" as const, label: "Other", icon: MapPin },
] as const;

// Form validation schemas
const addressSchema = z.object({
  name: z.string().min(1, "Address name required"),
  addressLine1: z.string().min(3, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit phone required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const ActionButton = ({ icon, onClick, color = "brown" }: { icon: React.ReactNode; onClick: () => void; color?: "red" | "brown" }) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-xl border transition-all duration-300 ${color === "red"
      ? "border-red-100 text-red-400 hover:bg-red-500 hover:text-white"
      : "border-brand-brown/10 text-brand-brown/60 hover:bg-brand-brown hover:text-white"
      }`}
  >
    {icon}
  </button>
);

const FloatingLabelInput = ({ label, register, error, placeholder, ...props }: { label: string; register: any; error?: any; placeholder?: string; props?: any }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-brand-brown/50 ml-1">
      {label}
    </label>
    <input
      {...register}
      {...props}
      placeholder={placeholder}
      className="w-full px-5 py-3 bg-white border border-brand-brown/10 rounded-2xl focus:ring-4 focus:ring-brand-brown/5 focus:border-brand-brown outline-none transition-all text-sm font-semibold placeholder:text-gray-300"
    />
    {error && <p className="text-red-500 text-[10px] font-bold ml-1">{error.message}</p>}
  </div>
);

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedAddressType, setSelectedAddressType] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-brand-brown text-white rounded-lg hover:bg-brand-cocoa transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleSelectAddressType = (typeId: string) => {
    setSelectedAddressType(typeId);
    const selectedType = ADDRESS_TYPES.find(t => t.id === typeId);
    if (selectedType && typeId !== "OTHER") {
      setValue("name", selectedType.label);
    } else {
      setValue("name", "");
    }
  };

  const handleAddressSubmit = (data: AddressFormData) => {
    if (editingAddressId) {
      updateAddress({
        ...data,
        id: editingAddressId,
        type: (selectedAddressType as any) || "HOME"
      });
    } else {
      createAddress({
        ...data,
        type: (selectedAddressType as any) || "HOME"
      });
    }
    reset();
    setEditingAddressId(null);
    setShowAddressForm(false);
    setSelectedAddressType(null);
  };

  const handleEditAddress = (addressId: string) => {
    const address = (addresses ?? []).find((a) => a?.id === addressId);
    if (address) {
      Object.entries(address).forEach(([key, value]) => {
        if (!["id", "userId", "type", "createdAt", "updatedAt", "isDefault"].includes(key)) {
          setValue(key as keyof AddressFormData, (value ?? '') as string);
        }
      });
      setSelectedAddressType(address?.type ?? "HOME");
      setEditingAddressId(addressId);
      setShowAddressForm(true);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-latte to-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-6 pb-6">
        <button
          onClick={() => navigate("/")}
          className="group inline-flex items-center gap-2 px-4 py-2 -ml-4 rounded-full text-brand-brown/60 hover:text-brand-brown hover:bg-brand-brown/5 transition-all duration-300"
        >
          <ArrowLeft
            size={18}
            weight="bold"
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1 lg:sticky lg:top-32 h-fit"
          >
            {/* The Card: Reduced padding from p-10 to p-6, enhanced borders */}
            <div className="group relative bg-white rounded-[24px] p-6 border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 overflow-hidden">

              {/* Subtle Top "Highlight" Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-brown/20 to-transparent" />

              <div className="flex flex-col">
                {/* Top Section: Compact Avatar & Identity */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-brand-brown/20 rounded-full blur-xl group-hover:bg-brand-brown/30 transition-colors" />
                    <div className="relative w-16 h-16 p-[2px] rounded-full bg-gradient-to-tr from-brand-brown to-brand-latte">
                      <div className="w-full h-full bg-brand-cream rounded-full flex items-center justify-center">
                        <User size={30} className="text-brand-brown" weight="duotone" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h2 className="text-xl font-black text-brand-brown truncate leading-tight">
                      {user?.name ?? 'User'}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-brown/40">
                        {user?.role ?? "Member"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Rows: More compact layout */}
                <div className="space-y-2 mb-6">
                  {[
                    { icon: <Envelope size={16} />, value: user?.email },
                    { icon: <Phone size={16} />, value: user?.phone || "No phone linked" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-brand-latte/20 border border-brand-brown/5 hover:bg-brand-latte/40 transition-colors">
                      <div className="text-brand-brown/60">{item.icon}</div>
                      <span className="text-xs font-bold text-brand-brown/80 truncate">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions: Highlighting the button as the focal point */}
                <div className="space-y-3 pt-4 border-t border-brand-brown/10">
                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full group/btn relative h-12 overflow-hidden rounded-xl bg-brand-brown text-brand-cream flex items-center justify-center gap-2 shadow-lg shadow-brand-brown/20 transition-all duration-300 active:scale-95"
                  >
                    {/* Subtle Button Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                    <ShoppingBag size={18} weight="fill" />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      My Orders
                    </span>
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                  </button>

                  {/* Optional: Secondary Action to fill space efficiently */}
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="w-full h-10 rounded-xl border border-brand-brown/10 text-brand-brown/60 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-brown hover:text-white transition-all"
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black text-brand-brown flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-brand-brown/5 rounded-lg text-brand-brown">
                    <MapPin size={24} weight="duotone" />
                  </div>
                  Shipping Addresses
                </h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Manage where your premium goods are delivered.</p>
              </div>

              <button
                onClick={() => {
                  reset();
                  setEditingAddressId(null);
                  setShowAddressForm(true);
                }}
                className="group flex items-center gap-2 px-6 py-3 bg-brand-brown text-white rounded-2xl hover:bg-brand-cocoa transition-all shadow-lg shadow-brand-brown/20 active:scale-95 font-bold text-sm tracking-wide"
              >
                <Plus size={20} weight="bold" className="group-hover:rotate-90 transition-transform duration-300" />
                New Address
              </button>
            </div>

            {/* Address Form: Re-engineered for Professionalism */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-brand-latte/10 rounded-[24px] p-8 mb-10 border border-brand-brown/10 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-6 w-1 bg-brand-brown rounded-full" />
                    <h4 className="text-lg font-black text-brand-brown">
                      {editingAddressId ? "Modify Address" : "Add New Destination"}
                    </h4>
                  </div>

                  {/* Improved Address Type Selector */}
                  {!editingAddressId && (
                    <div className="mb-8">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-4">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {ADDRESS_TYPES.map((type) => {
                          const IconComponent = type.icon;
                          const isActive = selectedAddressType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleSelectAddressType(type.id)}
                              className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${isActive
                                ? "border-brand-brown bg-brand-brown text-white shadow-md"
                                : "border-brand-brown/10 bg-white text-brand-brown/60 hover:border-brand-brown/30"
                                }`}
                            >
                              <IconComponent size={20} weight={isActive ? "fill" : "bold"} />
                              <span className="text-sm font-bold tracking-tight">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(handleAddressSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(!selectedAddressType || selectedAddressType === "other") && (
                        <div className="md:col-span-2">
                          <FloatingLabelInput label="Address Name" register={register("name")} error={errors.name} placeholder="e.g. Vacation Home" />
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <FloatingLabelInput label="Street Address" register={register("addressLine1")} error={errors.addressLine1} placeholder="123 Luxury Lane" />
                      </div>

                      <FloatingLabelInput label="Apt / Suite (Optional)" register={register("addressLine2")} />

                      <div className="grid grid-cols-2 gap-4">
                        <FloatingLabelInput label="City" register={register("city")} error={errors.city} />
                        <FloatingLabelInput label="State" register={register("state")} error={errors.state} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FloatingLabelInput label="Postal Code" register={register("postalCode")} error={errors.postalCode} />
                        <FloatingLabelInput label="Country" register={register("country")} error={errors.country} />
                      </div>

                      <FloatingLabelInput label="Contact Number" register={register("phone")} error={errors.phone} placeholder="For delivery updates" />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-[2] h-14 bg-brand-brown text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-brown/20 hover:bg-brand-cocoa transition-all flex items-center justify-center gap-3"
                      >
                        {isCreating || isUpdating ? <CircleNotch size={20} className="animate-spin" /> : <Check size={20} weight="bold" />}
                        Save Destination
                      </button>
                      <button
                        type="button"
                        onClick={() => { reset(); setShowAddressForm(false); setEditingAddressId(null); }}
                        className="flex-1 h-14 border-2 border-brand-brown/10 text-brand-brown/60 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all"
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Address List: High Contrast Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  layout
                  className={`relative p-6 rounded-[24px] border-2 transition-all duration-500 overflow-hidden ${address.isDefault
                    ? "border-brand-brown bg-brand-brown/[0.02] shadow-md"
                    : "border-gray-100 bg-white hover:border-brand-brown/20"
                    }`}
                >
                  {address.isDefault && (
                    <div className="absolute top-0 right-0 px-4 py-1 bg-brand-brown text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl">
                      Primary
                    </div>
                  )}

                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${address.isDefault ? 'bg-brand-brown text-white' : 'bg-brand-latte text-brand-brown'}`}>
                        <MapPin size={20} weight="fill" />
                      </div>
                      <div>
                        <h4 className="font-black text-brand-brown leading-tight">{address.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{address.city}, {address.state}</p>
                      </div>
                    </div>

                    <div className="flex-grow space-y-1">
                      <p className="text-gray-600 text-sm font-medium">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-gray-500 text-xs">{address.addressLine2}</p>}
                      <p className="text-gray-500 text-xs font-bold mt-2 flex items-center gap-2">
                        <Phone size={12} weight="fill" /> {address.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-50">
                      <ActionButton icon={<Pencil size={16} />} onClick={() => handleEditAddress(address.id)} color="brown" />
                      {!address.isDefault && <ActionButton icon={<Check size={16} />} onClick={() => setDefaultAddress(address.id)} color="brown" />}
                      <ActionButton icon={<Trash size={16} />} onClick={() => setDeleteConfirm(address.id)} color="red" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Delete Address Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            handleDeleteAddress(deleteConfirm);
            setDeleteConfirm(null);
          }
        }}
        type="danger"
        title="Delete Address?"
        description="This address will be permanently removed from your profile. This action cannot be undone."
        confirmText="Delete"
        cancelText="Keep Address"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProfilePage;
