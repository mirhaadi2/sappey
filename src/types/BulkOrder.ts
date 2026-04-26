export interface FormData {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    product: string;
    estimatedQuantity: string;
    additionalRequirements: string;
}

export interface FormErrors {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    product?: string;
    estimatedQuantity?: string;
}

export interface SubmitStatus {
    type: 'success' | 'error';
    message: string;
}

export interface BulkOrderFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: FormErrors;
    setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export interface BulkOrderSuccessProps {
    submitStatus: SubmitStatus;
    onReset: () => void;
}