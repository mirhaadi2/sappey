import * as z from "zod";
import { addressSchema } from "./address.schema";

const checkoutFormSchema = z.object({
    contactEmail: z.string().email("Invalid email").or(z.literal("")),
    contactPhone: z.string().regex(/^[6-9][0-9]{9}$|^$/, "Invalid phone number"),
    contactWhatsapp: z.string().regex(/^[6-9][0-9]{9}$|^$/, "Invalid WhatsApp number"),
    deliveryAddress: addressSchema,
    billingSameAsShipping: z.boolean().default(true),
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
    paymentMethod: z.enum(["cod", "online"]).default("cod"),
    cardNumber: z.string().optional(),
    cardHolderName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    upiId: z.string().optional(),
    netbankingBank: z.string().optional(),
    shippingMethod: z.enum(["standard", "express", "overnight"]).default("standard"),
    newsletter: z.boolean().default(true),
    saveInfo: z.boolean().default(true),
}).superRefine((values, ctx) => {
    if (!values.billingSameAsShipping) {
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

    if (values.paymentMethod === 'card') {
        if (!values.cardNumber?.trim()) {
            ctx.addIssue({ path: ['cardNumber'], code: 'custom', message: 'Card number is required' });
        } else if (!/^[0-9]{13,19}$/.test(values.cardNumber.replace(/\s+/g, ''))) {
            ctx.addIssue({ path: ['cardNumber'], code: 'custom', message: 'Enter a valid card number' });
        }

        if (!values.cardHolderName?.trim()) {
            ctx.addIssue({ path: ['cardHolderName'], code: 'custom', message: 'Cardholder name is required' });
        }

        if (!values.cardExpiry?.trim()) {
            ctx.addIssue({ path: ['cardExpiry'], code: 'custom', message: 'Expiry date is required' });
        } else if (!/^(0[1-9]|1[0-2])\/(?:[0-9]{2}|[0-9]{4})$/.test(values.cardExpiry.trim())) {
            ctx.addIssue({ path: ['cardExpiry'], code: 'custom', message: 'Expiry must be MM/YY or MM/YYYY' });
        }

        if (!values.cardCvv?.trim()) {
            ctx.addIssue({ path: ['cardCvv'], code: 'custom', message: 'CVV is required' });
        } else if (!/^[0-9]{3,4}$/.test(values.cardCvv.trim())) {
            ctx.addIssue({ path: ['cardCvv'], code: 'custom', message: 'Enter a valid 3-4 digit CVV' });
        }
    }

    if (values.paymentMethod === 'upi') {
        if (!values.upiId?.trim()) {
            ctx.addIssue({ path: ['upiId'], code: 'custom', message: 'UPI ID is required' });
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z]+$/.test(values.upiId.trim())) {
            ctx.addIssue({ path: ['upiId'], code: 'custom', message: 'Enter a valid UPI ID' });
        }
    }

    if (values.paymentMethod === 'netbanking') {
        if (!values.netbankingBank?.trim()) {
            ctx.addIssue({ path: ['netbankingBank'], code: 'custom', message: 'Please select your bank' });
        }
    }
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export { checkoutFormSchema };