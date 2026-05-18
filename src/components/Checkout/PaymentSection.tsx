import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Bank, QrCode, HandCoins } from "@phosphor-icons/react";
import { PaymentSectionProps } from "../../types";

const PaymentSection: React.FC<PaymentSectionProps> = ({ form }) => {
    const selectedPaymentMethod = form.watch("paymentMethod");

    const paymentMethods = [
    {
        id: 'cod',
        label: 'Cash on Delivery (COD)',
        icon: <HandCoins size={20} />,
        description: 'Pay with cash when your package arrives.',
    },
    {
        id: 'online', // MUST match the ID used in handlePlaceOrder
        label: 'Online Payment',
        icon: <CreditCard size={20} />,
        description: 'Secure checkout via Razorpay. Supports Cards, UPI, and Netbanking.',
    }
];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-brand-brown/10 shadow-sm"
        >
            <h2 className="text-xl font-bold text-brand-brown mb-6 flex items-center gap-2">
                <CreditCard size={24} />
                Payment Method
            </h2>

            <div className="grid gap-4">
                {paymentMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-start gap-4 p-5 border rounded-2xl cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === method.id 
                            ? 'border-brand-brown bg-brand-brown/5 ring-1 ring-brand-brown' 
                            : 'border-slate-200 hover:border-brand-brown/50'
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => form.setValue("paymentMethod", e.target.value as any)}
                            className="mt-1 w-5 h-5 accent-brand-brown"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-brand-brown">{method.icon}</span>
                                <span className="font-bold text-slate-800">{method.label}</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {method.description}
                            </p>
                        </div>
                    </label>
                ))}
            </div>

            {selectedPaymentMethod === 'online' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-5"
                >
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-900">Secure Razorpay checkout</p>
                        <p className="mt-2 text-sm text-slate-600">
                            After clicking Complete Order, a Razorpay window will open and let you pay with cards, UPI or netbanking.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                            <CreditCard size={20} className="text-brand-brown" />
                            <span className="font-semibold">Cards</span>
                            <span className="text-xs text-slate-500 text-center">Visa, Mastercard, Rupay</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                            <QrCode size={20} className="text-brand-brown" />
                            <span className="font-semibold">UPI</span>
                            <span className="text-xs text-slate-500 text-center">Pay from any UPI app</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                            <Bank size={20} className="text-brand-brown" />
                            <span className="font-semibold">Netbanking</span>
                            <span className="text-xs text-slate-500 text-center">Direct bank transfer</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                        <p className="font-semibold">Important</p>
                        <p className="mt-1">No card or bank details are stored on this website. Razorpay handles all payment processing securely.</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default PaymentSection;