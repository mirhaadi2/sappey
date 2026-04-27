import { useMutation } from '@tanstack/react-query';
import { delhiveryApi, PincodeServiceabilityResponse } from './client';

export const useCheckPincodeServiceability = () => {
    return useMutation({
        mutationFn: (pincode: string) => delhiveryApi.checkPincodeServiceability(pincode),
        onError: (error) => {
            console.error('Error checking pincode serviceability:', error);
        },
    });
};