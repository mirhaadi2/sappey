// ============================================
// Form Data Types
// ============================================
export interface BulkOrderFormData {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    product: string;
    estimatedQuantity: string;
    additionalRequirements: string;
}

export interface BulkOrderFormErrors {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    product?: string;
    estimatedQuantity?: string;
}

// ============================================
// Submission Types
// ============================================
export type SubmitStatusType = 'success' | 'error';

export interface SubmitStatus {
    type: SubmitStatusType;
    message: string;
}

export interface BulkOrderSubmissionPayload {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    product: string;
    estimatedQuantity: string;
    additionalRequirements?: string;
}

export interface BulkOrderResponse {
    success: boolean;
    message: string;
    error?: string;
    data?: any;
}

// ============================================
// Component Props Types
// ============================================
export interface BulkOrderHeroProps {
    onFormReady?: () => void;
}

export interface BulkOrderFormProps {
    formData: BulkOrderFormData;
    errors: BulkOrderFormErrors;
    isSubmitting: boolean;
    submitStatus: SubmitStatus | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'phone' | 'textarea';
    placeholder?: string;
    value: string;
    error?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    helpText?: string;
}

export interface FormFieldGroupProps {
    label: string;
    children: React.ReactNode;
    required?: boolean;
}

// ============================================
// Status Message Types
// ============================================
export interface SuccessMessageProps {
    message: string;
}

export interface ErrorMessageProps {
    message: string;
}

// ============================================
// Context Value Types
// ============================================
export interface BulkOrderPageContextValue {
    formData: BulkOrderFormData;
    setFormData: (data: BulkOrderFormData) => void;
    errors: BulkOrderFormErrors;
    setErrors: (errors: BulkOrderFormErrors) => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    submitStatus: SubmitStatus | null;
    setSubmitStatus: (status: SubmitStatus | null) => void;
}

// ============================================
// Validation Types
// ============================================
export interface ValidationRules {
    companyName: {
        required: boolean;
        minLength: number;
        maxLength?: number;
    };
    contactPerson: {
        required: boolean;
        minLength: number;
    };
    phone: {
        required: boolean;
        pattern: RegExp;
    };
    email: {
        required: boolean;
        pattern: RegExp;
    };
    product: {
        required: boolean;
        minLength: number;
    };
    estimatedQuantity: {
        required: boolean;
        minLength: number;
    };
}
