import { apiMethods } from '../../index';
import { DELHIVERY_PINCODE_CHECK, DELHIVERY_CHARGES } from './endpoints';

export interface PincodeServiceabilityResponse {
    success: boolean;
    data: any; // Delhivery's response structure
}

export const delhiveryApi = {
    checkPincodeServiceability: async (pincode: string): Promise<PincodeServiceabilityResponse> => {
        const response = await apiMethods.get<PincodeServiceabilityResponse>(DELHIVERY_PINCODE_CHECK(pincode));
        return response.data;
    },

    calculateShippingCharges: async (params: Record<string, any>): Promise<any> => {
        const response = await apiMethods.get<any>(DELHIVERY_CHARGES, params);
        return response.data;
    },
};