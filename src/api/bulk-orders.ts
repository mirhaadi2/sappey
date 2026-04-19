import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true,
});

export interface BulkOrderSubmission {
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
    bulkOrderId?: string;
    error?: string;
}

export const submitBulkOrder = async (data: BulkOrderSubmission): Promise<BulkOrderResponse> => {
    try {
        const response = await api.post<BulkOrderResponse>('/bulk-orders', {
            companyName: data.companyName,
            contactPerson: data.contactPerson,
            phone: data.phone,
            email: data.email,
            product: data.product,
            estimatedQuantity: data.estimatedQuantity,
            additionalRequirements: data.additionalRequirements || '',
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || { success: false, error: 'Network error. Please try again.' };
    }
};
