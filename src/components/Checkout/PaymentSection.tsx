import React from "react";
import { motion } from "framer-motion";
import { CreditCard } from "@phosphor-icons/react";
import { PaymentSectionProps } from "../../types";

const PaymentSection: React.FC<PaymentSectionProps> = ({ form }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-brand-brown/10"
        >
            <h2 className="text-xl font-bold text-brand-brown mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Payment
            </h2>

            <div className="space-y-3">
                {[
                    { id: 'cod', label: 'Cash on Delivery (COD)' },
                ].map((method) => (
                    <label key={method.id} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-brand-brown transition"
                        style={{
                            borderColor: form.watch("paymentMethod") === method.id ? '#6B4423' : '#E5E7EB',
                        }}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={form.watch("paymentMethod") === method.id}
                            onChange={(e) => form.setValue("paymentMethod", e.target.value as any)}
                            className="w-5 h-5 accent-brand-brown"
                        />
                        <span className="text-sm font-medium text-slate-700">{method.label}</span>
                    </label>
                ))}
            </div>
        </motion.div>
    );
};

export default PaymentSection;