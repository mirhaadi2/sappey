import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddresses } from "../api/address/hooks";
import {
  User, MapPin, Phone, Envelope, Pencil, Plus, Trash, Check, X,
  CircleNotch, ArrowLeft, House, Briefcase, ShoppingBag
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

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    addresses,
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
    const address = addresses.find((a) => a.id === addressId);
    if (address) {
      Object.entries(address).forEach(([key, value]) => {
        if (key !== "id" && key !== "userId" && key !== "type" && key !== "createdAt" && key !== "updatedAt" && key !== "isDefault") {
          setValue(key as keyof AddressFormData, value as string);
        }
      });
      setSelectedAddressType(address.type || "HOME");
      setEditingAddressId(addressId);
      setShowAddressForm(true);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-latte to-white">
      {/* Header */}
      <div className="sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-brown transition mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          {/* <h1 className="text-4xl font-bold text-brand-brown">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your account and addresses</p> */}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 lg:sticky lg:top-32 h-fit"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-brown/20 to-brand-cocoa/20 rounded-full flex items-center justify-center mb-6">
                  <User size={40} className="text-brand-brown" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold text-brand-brown mb-1">{user?.name ?? user.email?.split("@")[0]}</h2>
                {/* <p className="text-gray-500 text-sm mb-6">{user.email}</p> */}
                <div className="w-full space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    <Envelope size={18} className="text-brand-brown" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    <Phone size={18} className="text-brand-brown" />
                    <span className="capitalize">{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    <User size={18} className="text-brand-brown" />
                    <span className="capitalize">{user.role || "Customer"}</span>
                  </div>

                  {/* Orders Button */}
                  <div className="pt-3 mt-6 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      <ShoppingBag size={18} weight="fill" />
                      View My Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Addresses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-brand-brown flex items-center gap-2">
                  <MapPin size={28} />
                  Addresses
                </h3>
                <p className="text-gray-500 mt-1">Manage your delivery addresses</p>
              </div>
              <button
                onClick={() => {
                  reset();
                  setEditingAddressId(null);
                  setShowAddressForm(true);
                }}
                className="flex items-center gap-2 px-4 py-3 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} weight="bold" />
                Add Address
              </button>
            </div>

            {/* Address Form */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-brand-latte/50 to-white rounded-2xl p-6 mb-8 border border-brand-latte"
                >
                  <h4 className="text-lg font-bold text-brand-brown mb-6">
                    {editingAddressId ? "Edit Address" : "New Address"}
                  </h4>

                  {/* Address Type Selection */}
                  {!editingAddressId && (
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Select Address Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {ADDRESS_TYPES.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <motion.button
                              key={type.id}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSelectAddressType(type.id)}
                              className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-1 text-sm ${selectedAddressType === type.id
                                  ? "border-brand-brown bg-brand-brown/10 text-brand-brown"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-brand-brown/50"
                                }`}
                            >
                              <IconComponent size={24} weight={selectedAddressType === type.id ? "fill" : "regular"} />
                              <span className="text-xs font-semibold">{type.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(handleAddressSubmit)} className="space-y-5">
                    {/* Address Name - Only show custom name input for "Other" type */}
                    {(!selectedAddressType || selectedAddressType === "other") && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {selectedAddressType === "other" ? "Address Name" : "Address Label"}
                        </label>
                        <input
                          {...register("name")}
                          placeholder={selectedAddressType === "other" ? "e.g., Grandparent's House" : "e.g., Home, Work"}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        {...register("addressLine1")}
                        placeholder="Street address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <input
                        {...register("addressLine2")}
                        placeholder="Apartment, Suite, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          {...register("city")}
                          placeholder="City"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          {...register("state")}
                          placeholder="State"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          {...register("postalCode")}
                          placeholder="Postal Code"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          {...register("country")}
                          placeholder="Country"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                        />
                        {errors.country && (
                          <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          {...register("phone")}
                          placeholder="10-digit number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown outline-none transition"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-brand-brown text-white rounded-xl hover:bg-brand-cocoa disabled:opacity-50 transition font-semibold"
                      >
                        {isCreating || isUpdating ? (
                          <>
                            <CircleNotch size={18} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            Save Address
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          reset();
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                        }}
                        className="flex-1 px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Addresses List */}
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <MapPin size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">No addresses yet</p>
                  <p className="text-gray-500 text-sm">Add your first address to get started</p>
                </div>
              ) : (
                addresses.map((address) => (
                  <motion.div
                    key={address.id}
                    layout
                    className={`p-6 rounded-2xl border-2 transition-all ${address.isDefault
                        ? "border-brand-brown bg-gradient-to-br from-brand-brown/5 to-brand-latte"
                        : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-brand-brown">{address.name}</h4>
                          {address.isDefault && (
                            <span className="px-3 py-1 bg-brand-brown/10 text-brand-brown text-xs font-semibold rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-gray-600 text-sm">{address.country}</p>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                          <Phone size={14} />
                          {address.phone}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditAddress(address.id)}
                          className="p-3 rounded-lg text-brand-brown border-2 border-brand-brown/20 hover:bg-brand-brown/5 transition"
                          title="Edit address"
                        >
                          <Pencil size={18} />
                        </motion.button>

                        {!address.isDefault && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDefaultAddress(address.id)}
                            disabled={isUpdating}
                            className="p-3 rounded-lg text-gray-500 border-2 border-gray-300 hover:text-brand-brown hover:border-brand-brown transition disabled:opacity-50"
                            title="Set as default"
                          >
                            <Check size={18} />
                          </motion.button>
                        )}

                        <div className="relative">
                          <AnimatePresence>
                            {deleteConfirm === address.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute right-0 top-full mt-2 bg-white border-2 border-red-200 rounded-lg p-3 shadow-lg z-10 min-w-max"
                              >
                                <p className="text-xs text-gray-700 font-semibold mb-2">Delete this address?</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDeleteAddress(address.id)}
                                    disabled={isDeleting}
                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded font-semibold hover:bg-red-600 transition disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded font-semibold hover:bg-gray-300 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setDeleteConfirm(deleteConfirm === address.id ? null : address.id)
                            }
                            className="p-3 rounded-lg text-red-500 border-2 border-red-300/50 hover:bg-red-50 transition"
                            title="Delete address"
                          >
                            <Trash size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
