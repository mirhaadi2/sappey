import { useMutation, useQuery } from '@tanstack/react-query';
import { delhiveryApi, ShippingChargesResponse } from './client';

export const useCheckPincodeServiceability = () => {
    return useMutation({
        mutationFn: (pincode: string) => delhiveryApi.checkPincodeServiceability(pincode),
        onError: (error) => {
            console.error('Error checking pincode serviceability:', error);
        },
    });
};

export const useCalculateShippingCharges = (params: Record<string, any>, options: any = {}) => {
    return useQuery<ShippingChargesResponse>({
        queryKey: [
            'delhiveryCharges',
            params?.o_pin,
            params?.d_pin,
            params?.cgm,
            // params?.shipping_method,
        ],
        queryFn: () => delhiveryApi.calculateShippingCharges(params),
        enabled: Boolean(params?.o_pin && params?.d_pin),
        staleTime: 60_000,
        ...options,
    });
};