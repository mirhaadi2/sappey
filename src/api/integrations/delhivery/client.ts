import { apiMethods } from '../../index';
import { DELHIVERY_PINCODE_CHECK } from './endpoints';

export interface PincodeServiceabilityResponse {
    success: boolean;
    data: any; // Delhivery's response structure
}

export const delhiveryApi = {
    checkPincodeServiceability: async (pincode: string): Promise<PincodeServiceabilityResponse> => {
        const response = await apiMethods.get<PincodeServiceabilityResponse>(DELHIVERY_PINCODE_CHECK(pincode));
        return response.data;
    },
};