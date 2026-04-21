import { useForm, UseFormProps, UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useFormWithValidation<TFieldValues extends FieldValues = FieldValues>(
    schema?: z.ZodType<TFieldValues, any, any>,
    options?: UseFormProps<TFieldValues>
): UseFormReturn<TFieldValues> {
    return useForm<TFieldValues>({
        ...options,
        resolver: schema ? zodResolver(schema) : undefined,
    });
}

// Type helpers for form components
export type FormFieldProps<T extends FieldValues = any> = {
    name: FieldPath<T>;
    control: UseFormReturn<T>['control'];
    register: UseFormReturn<T>['register'];
    errors: UseFormReturn<T>['formState']['errors'];
};