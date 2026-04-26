import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";
import { useAddresses } from "../api/address/hooks";
import ConfirmDialog from "../components/ConfirmDialog";
import { ProfilePageSkeleton } from "../components/Skeletons";
import { useFormWithValidation } from "../hooks/useFormValidation";
import * as z from "zod";
import {
  ProfileNavigation,
  ProfileSidebar,
  ProfileMainContent,
  ProfileEditModal,
} from "../components/Profile";

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

  const form = useFormWithValidation<AddressFormData>(addressSchema);

  if (authLoading || isLoading) return <ProfilePageSkeleton />;
  if (!currentUser) return <Navigate to="/" replace />;

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
    form.reset();
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleEdit = (address: any) => {
    const [firstName, ...rest] = (address.name || "").split(" ");
    form.setValue("firstName", firstName || "");
    form.setValue("lastName", rest.join(" ") || "");
    form.setValue("addressLine1", address.addressLine1 || "");
    form.setValue("addressLine2", address.addressLine2 || "");
    form.setValue("city", address.city || "");
    form.setValue("state", address.state || "");
    form.setValue("postalCode", address.postalCode || "");
    form.setValue("country", address.country || "");
    form.setValue("phone", address.phone || "");
    setSelectedAddressType(address.type);
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ProfileNavigation
          onBack={() => navigate("/")}
          onViewOrders={() => navigate("/orders")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ProfileSidebar
            currentUser={currentUser}
            onAddAddress={() => setShowAddressForm(true)}
            onEditProfile={() => setShowProfileEditModal(true)}
          />

          <ProfileMainContent
            addresses={addresses}
            showAddressForm={showAddressForm}
            selectedAddressType={selectedAddressType}
            onAddressTypeSelect={setSelectedAddressType}
            form={form}
            onAddressSubmit={handleAddressSubmit}
            onCancelForm={() => { setShowAddressForm(false); setEditingAddressId(null); form.reset(); }}
            onAddAddress={() => setShowAddressForm(true)}
            onSetDefault={setDefaultAddress}
            onEditAddress={handleEdit}
            onDeleteAddress={(id) => setDeleteConfirm(id)}
            isCreating={isCreating}
            isUpdating={isUpdating}
          />
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