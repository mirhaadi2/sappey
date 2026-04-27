import React from "react";
import { motion } from "framer-motion";
import { Envelope, Phone, ChatCircle } from "@phosphor-icons/react";
import { CheckoutFormData } from "../../schemas";
import { ContactInformationSectionProps } from "../../types";

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
    form,
    enabledContactTypes,
    onSignIn,
    onContactChange,
    customerLookupLoading,
}) => {
    const contactFields = [];
    if (enabledContactTypes.email) contactFields.push('email');
    if (enabledContactTypes.phone) contactFields.push('phone');
    if (enabledContactTypes.whatsapp) contactFields.push('whatsapp');

    const getContactIcon = (type: 'email' | 'phone' | 'whatsapp') => {
        switch (type) {
            case 'email': return <Envelope size={20} />;
            case 'phone': return <Phone size={20} />;
            case 'whatsapp': return <ChatCircle size={20} />;
        }
    };

    const getContactPlaceholder = (type: 'email' | 'phone' | 'whatsapp') => {
        switch (type) {
            case 'email': return 'Enter email address';
            case 'phone': return 'Enter phone number';
            case 'whatsapp': return 'Enter WhatsApp number';
        }
    };

    const getFieldName = (type: string) => `contact${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof CheckoutFormData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-brand-brown/10 shadow-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-brown">Contact Information</h2>
                <button
                    onClick={onSignIn}
                    className="text-brand-brown font-bold text-sm hover:opacity-80 transition-opacity"
                >
                    Sign In
                </button>
            </div>

            <div className="space-y-4">
                {contactFields.map((type) => (
                    <div key={type} className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown transition-transform group-focus-within:scale-110">
                            {getContactIcon(type as 'email' | 'phone' | 'whatsapp')}
                        </div>
                        <input
                            type={type === 'email' ? 'email' : 'tel'}
                            {...form.register(getFieldName(type))}
                            onBlur={(e) => onContactChange(e.target.value, type as 'email' | 'phone' | 'whatsapp')}
                            placeholder={getContactPlaceholder(type as 'email' | 'phone' | 'whatsapp')}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 focus:outline-none transition-all"
                        />
                    </div>
                ))}

                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                        type="checkbox"
                        {...form.register("newsletter")}
                        className="w-5 h-5 accent-brand-brown rounded-md"
                    />
                    <span className="text-sm font-medium text-slate-600">Email me with news and offers</span>
                </label>

                {customerLookupLoading && (
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-brown/60 uppercase tracking-widest animate-pulse mt-2">
                        <div className="w-4 h-4 border-2 border-brand-brown border-t-transparent rounded-full animate-spin" />
                        Checking for profile...
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ContactInformationSection;