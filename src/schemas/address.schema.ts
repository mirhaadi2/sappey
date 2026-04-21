import * as z from "zod";

const addressSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
    lastName: z.string().optional().refine((val) => !val || /^[a-zA-Z\s]+$/.test(val), "Last name can only contain letters"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    city: z.string().min(2, "City must be at least 2 characters").regex(/^[a-zA-Z\s]+$/, "City can only contain letters"),
    state: z.string().min(1, "Please select a state"),
    pinCode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code"),
    phone: z.string().regex(/^[6-9][0-9]{9}$/, "Please enter a valid 10-digit phone number"),
    country: z.string().min(1, "Country is required"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export { addressSchema };