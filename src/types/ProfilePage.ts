import { Address } from './address';

// ============================================
// Address Types
// ============================================
export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export interface AddressTypeConfig {
    id: AddressType;
    label: string;
}

export interface AddressFormData {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export interface AddressPayload {
    type: AddressType;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    id?: string;
}

// ============================================
// Component Props Types
// ============================================
export interface ProfileSidebarProps {
    currentUser: {
        name: string;
        email: string;
    };
    onAddAddressClick: () => void;
    onEditProfileClick: () => void;
}

export interface AddressListProps {
    addresses: Address[];
    isLoading: boolean;
    isDeleting: boolean;
    onEditAddress: (address: Address) => void;
    onDeleteAddress: (addressId: string) => void;
    onSetDefault: (addressId: string) => void;
}

export interface AddressFormProps {
    selectedType: string | null;
    isLoading: boolean;
    onTypeSelect: (type: AddressType) => void;
    onSubmit: (data: AddressFormData) => void;
    onCancel: () => void;
    initialValues?: AddressFormData;
    isEditing?: boolean;
}

export interface AddressCardProps {
    address: Address;
    isDefault: boolean;
    isLoading: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}

export interface ProfileHeaderProps {
    onBackClick: () => void;
    onViewOrdersClick: () => void;
}

// ============================================
// Modal Props Types
// ============================================
export interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: {
        name: string;
        email: string;
    };
}

export interface DeleteConfirmDialogProps {
    isOpen: boolean;
    addressType?: string;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

// ============================================
// Context Value Types
// ============================================
export interface ProfilePageContextValue {
    showAddressForm: boolean;
    setShowAddressForm: (value: boolean) => void;
    editingAddressId: string | null;
    setEditingAddressId: (id: string | null) => void;
    deleteConfirm: string | null;
    setDeleteConfirm: (id: string | null) => void;
    selectedAddressType: AddressType | null;
    setSelectedAddressType: (type: AddressType | null) => void;
    showProfileEditModal: boolean;
    setShowProfileEditModal: (value: boolean) => void;
}
