import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useAddresses } from "../api/address/hooks";
import ConfirmDialog from "../components/ConfirmDialog";
import { ProfilePageSkeleton } from "../components/Skeletons";
import ProfileEditModal from "../components/ProfileEditModal";
import {
  User, MapPin, Envelope, Pencil, Plus, Trash, Check,
  CircleNotch, ArrowLeft, House, Briefcase,
  ShieldCheck, MapTrifold, CaretRight, IdentificationCard,
} from "@phosphor-icons/react";
import { Input } from "../components/ui";
import { useFormWithValidation } from "../hooks/useFormValidation";
import * as z from "zod";

const ADDRESS_TYPES = [
  { id: "HOME" as const, label: "Home", icon: House },
  { id: "WORK" as const, label: "Work", icon: Briefcase },
  { id: "OTHER" as const, label: "Other", icon: MapPin },
] as const;

const addressSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  addressLine1: z.string().min(3, "Required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postalCode: z.string().min(3, "Required"),
  country: z.string().min(1, "Required"),
  phone: z.string().regex(/^[0-9]{10}$/, "10 digits required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading: authLoading } = useWebsiteAuth();
  const {
    addresses = [], isLoading, createAddress, updateAddress,
    deleteAddress, setDefaultAddress, isCreating, isUpdating, isDeleting,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedAddressType, setSelectedAddressType] = useState<string | null>("HOME");
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useFormWithValidation<AddressFormData>(addressSchema);

  if (authLoading || isLoading) return <ProfilePageSkeleton />;
  if (!currentUser) return null;

  const handleAddressSubmit = (data: AddressFormData) => {
    const payload = {
      type: (selectedAddressType as any) || "HOME",
      name: `${data.firstName} ${data.lastName}`.trim(),
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
    };
    editingAddressId ? updateAddress({ ...payload, id: editingAddressId }) : createAddress(payload);
    reset();
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleEdit = (address: any) => {
    const [firstName, ...rest] = (address.name || "").split(" ");
    setValue("firstName", firstName || "");
    setValue("lastName", rest.join(" ") || "");
    setValue("addressLine1", address.addressLine1 || "");
    setValue("addressLine2", address.addressLine2 || "");
    setValue("city", address.city || "");
    setValue("state", address.state || "");
    setValue("postalCode", address.postalCode || "");
    setValue("country", address.country || "");
    setValue("phone", address.phone || "");
    setSelectedAddressType(address.type);
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Premium Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate("/")} 
            className="group flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-all"
          >
            <div className="p-2 bg-brand-latte/20 rounded-lg group-hover:bg-brand-brown group-hover:text-white transition-colors">
              <ArrowLeft size={16} weight="bold" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-brand-brown">Back to Store</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate("/orders")} 
              className="px-6 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-brown transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Enhanced Visual Depth */}
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
                  onClick={() => setShowAddressForm(true)}
                  className="w-full flex items-center justify-between p-4 bg-brand-brown text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-brown/20"
                >
                  <div className="flex items-center gap-3">
                    <Plus weight="bold" size={16} />
                    <span>Add New Address</span>
                  </div>
                  <CaretRight weight="bold" />
                </button>
                
                <button 
                  onClick={() => setShowProfileEditModal(true)}
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

            {/* Loyalty/Account Status Card */}
            {/* <div className="p-6 bg-gradient-to-br from-brand-brown to-[#4a3728] rounded-[32px] text-white shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Account Status</p>
              <h4 className="text-lg font-bold">Premium Member</h4>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-white rounded-full" />
              </div>
            </div> */}
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8">
            <header className="flex items-end justify-between mb-4 px-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1 w-8 bg-brand-brown rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-brown/50">Address Book</span>
                </div>
                <h3 className="text-3xl font-black text-brand-brown tracking-tight">Saved Locations</h3>
              </div>
              <p className="text-xs font-bold text-gray-400">{addresses.length} Addresses Saved</p>
            </header>

            <AnimatePresence mode="wait">
              {showAddressForm && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-10"
                >
                  <form onSubmit={handleSubmit(handleAddressSubmit)} className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40">
                    <div className="mb-8">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-brown/50 mb-4 block">Select Category</label>
                      <div className="flex flex-wrap gap-3">
                        {ADDRESS_TYPES.map(t => (
                          <button
                            key={t.id} type="button"
                            onClick={() => { setSelectedAddressType(t.id); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedAddressType === t.id ? 'bg-brand-brown text-white shadow-xl shadow-brand-brown/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                          >
                            <t.icon size={16} weight={selectedAddressType === t.id ? "fill" : "bold"} />
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input label="First Name" placeholder="John" name="firstName" register={register} error={errors.firstName} />
                      <Input label="Last Name" placeholder="Doe" name="lastName" register={register} error={errors.lastName} />
                      <div className="md:col-span-2">
                        <Input label="Street Address" placeholder="Building, Street, Area" name="addressLine1" register={register} error={errors.addressLine1} />
                      </div>
                      <Input label="City" placeholder="Enter City" name="city" register={register} error={errors.city} />
                      <Input label="State" placeholder="Enter State" name="state" register={register} error={errors.state} />
                      <Input label="Postal Code" placeholder="ZIP Code" name="postalCode" register={register} error={errors.postalCode} />
                      <Input label="Country" placeholder="Enter Country" name="country" register={register} error={errors.country} />
                      <Input label="Contact Number" placeholder="10 Digit Phone" name="phone" register={register} error={errors.phone} />
                    </div>

                    <div className="flex items-center gap-4 mt-10 pt-8 border-t border-gray-50">
                      <button type="submit" disabled={isCreating || isUpdating} className="flex-1 py-4 bg-brand-brown text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-brand-brown/30 transition-all flex items-center justify-center gap-3">
                        {isCreating || isUpdating ? <CircleNotch className="animate-spin" size={18} /> : <Check size={18} weight="bold" />}
                        {isCreating || isUpdating ? 'Saving...' : 'Confirm & Save Location'}
                      </button>
                      <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); reset(); }} className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => (
                <motion.div
                  key={address.id} layout
                  className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-[32px] border transition-all ${address.isDefault ? 'border-brand-brown/30 bg-white shadow-xl shadow-brand-brown/5' : 'border-white bg-white shadow-sm hover:shadow-md hover:border-gray-100'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-colors ${address.isDefault ? 'bg-brand-brown text-white' : 'bg-brand-latte/10 text-brand-brown group-hover:bg-brand-brown group-hover:text-white'}`}>
                      {address.type === 'HOME' ? <House size={28} weight="duotone" /> : address.type === 'WORK' ? <Briefcase size={28} weight="duotone" /> : <MapPin size={28} weight="duotone" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-lg text-brand-brown tracking-tight">{address.name}</h4>
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

                  <div className="flex items-center gap-3 mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    {!address.isDefault && (
                      <button 
                        onClick={() => setDefaultAddress(address.id)} 
                        className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        title="Set as Primary"
                      >
                        <Check size={18} weight="bold" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(address)} 
                      className="w-10 h-10 flex items-center justify-center bg-brand-latte/10 text-brand-brown rounded-xl hover:bg-brand-brown hover:text-white transition-all"
                    >
                      <Pencil size={18} weight="bold" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(address.id)} 
                      className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash size={18} weight="bold" />
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
                    onClick={() => setShowAddressForm(true)}
                    className="mt-6 px-8 py-3 bg-brand-latte/20 text-brand-brown rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-brown hover:text-white transition-all"
                  >
                    Create Address
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => { deleteAddress(deleteConfirm!); setDeleteConfirm(null); }}
        type="danger" title="Remove Address?"
        description="This will permanently delete this shipping location. You can't undo this action."
        isLoading={isDeleting}
      />
      
      <ProfileEditModal isOpen={showProfileEditModal} onClose={() => setShowProfileEditModal(false)} />
    </div>
  );
};

export default ProfilePage;