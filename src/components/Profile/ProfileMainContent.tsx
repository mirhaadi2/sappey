import React from "react";
import AddressFormSection from "./AddressFormSection";
import AddressListSection from "./AddressListSection";
import { Address } from "../../types/address";

interface ProfileMainContentProps {
    addresses: Address[];
    showAddressForm: boolean;
    selectedAddressType: string | null;
    onAddressTypeSelect: (type: string) => void;
    form: any;
    onAddressSubmit: (data: any) => void;
    onCancelForm: () => void;
    onAddAddress: () => void;
    onSetDefault: (id: string) => void;
    onEditAddress: (address: Address) => void;
    onDeleteAddress: (id: string) => void;
    isCreating: boolean;
    isUpdating: boolean;
}

const ProfileMainContent: React.FC<ProfileMainContentProps> = ({
    addresses,
    showAddressForm,
    selectedAddressType,
    onAddressTypeSelect,
    form,
    onAddressSubmit,
    onCancelForm,
    onAddAddress,
    onSetDefault,
    onEditAddress,
    onDeleteAddress,
    isCreating,
    isUpdating,
}) => {
    return (
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

            <AddressFormSection
                showAddressForm={showAddressForm}
                selectedAddressType={selectedAddressType}
                onAddressTypeSelect={onAddressTypeSelect}
                form={form}
                onSubmit={onAddressSubmit}
                onCancel={onCancelForm}
                isCreating={isCreating}
                isUpdating={isUpdating}
            />

            <AddressListSection
                addresses={addresses}
                showAddressForm={showAddressForm}
                onAddAddress={onAddAddress}
                onSetDefault={onSetDefault}
                onEdit={onEditAddress}
                onDelete={onDeleteAddress}
            />
        </main>
    );
};

export default ProfileMainContent;