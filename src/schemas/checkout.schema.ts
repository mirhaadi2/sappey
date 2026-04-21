import * as z from "zod";
import { addressSchema } from "./address.schema";

const checkoutFormSchema = z.object({
    contactEmail: z.string().email("Invalid email").or(z.literal("")),
    contactPhone: z.string().regex(/^[6-9][0-9]{9}$|^$/, "Invalid phone number"),
    contactWhatsapp: z.string().regex(/^[6-9][0-9]{9}$|^$/, "Invalid WhatsApp number"),
    deliveryAddress: addressSchema,
    billingSameAsShipping: z.boolean().default(true),
    // Make billingAddress optional in the base object
    billingAddress: z.union([
        addressSchema,
        z.object({
            firstName: z.string(),
            lastName: z.string().optional(),
            address: z.string(),
            city: z.string(),
            state: z.string(),
            pinCode: z.string(),
            phone: z.string(),
            country: z.string(),
        }).partial()
    ]).optional(),
    paymentMethod: z.enum(["cod", "card", "upi", "netbanking"]).default("cod"),
    shippingMethod: z.enum(["standard", "express", "overnight"]).default("standard"),
    newsletter: z.boolean().default(true),
    saveInfo: z.boolean().default(true),
}).superRefine((values, ctx) => {
    if (!values.billingSameAsShipping) {
        // Now we perform the strict check only when the toggle is OFF
        const billingResult = addressSchema.safeParse(values.billingAddress);
        if (!billingResult.success) {
            billingResult.error.issues.forEach((issue) => {
                ctx.addIssue({
                    ...issue,
                    path: ["billingAddress", ...issue.path],
                });
            });
        }
    }
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export { checkoutFormSchema };