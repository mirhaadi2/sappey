import React from "react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from "../../schemas";
import { AddressForm } from "./index";

interface BillingAddressSectionProps {
    form: UseFormReturn<CheckoutFormData>;
}

const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({ form }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-brand-brown/10"
        >
            <h2 className="text-xl font-bold text-brand-brown mb-6">Billing address</h2>

            <div className="space-y-3">
                <label
                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-brown transition"
                    onClick={() => {
                        form.setValue("billingSameAsShipping", true);
                        form.clearErrors("billingAddress");
                    }}
                >
                    <input
                        type="radio"
                        name="billing"
                        checked={form.watch("billingSameAsShipping")}
                        readOnly
                        className="w-5 h-5 accent-brand-brown"
                    />
                    <span className="text-sm font-medium text-slate-700">Same as shipping address</span>
                </label>

                <label
                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-brown transition"
                    onClick={() => form.setValue("billingSameAsShipping", false)}
                >
                    <input
                        type="radio"
                        name="billing"
                        checked={!form.watch("billingSameAsShipping")}
                        readOnly
                        className="w-5 h-5 accent-brand-brown"
                    />
                    <span className="text-sm font-medium text-slate-700">Use a different billing address</span>
                </label>
            </div>
            {!form.watch("billingSameAsShipping") && (
                <div className="mt-6">
                    <AddressForm
                        form={form}
                        addressFieldPrefix="billingAddress"
                        showSaveInfo={false}
                        phoneLabel="Phone (Optional)"
                    />
                </div>
            )}
        </motion.div>
    );
};

export default BillingAddressSection;