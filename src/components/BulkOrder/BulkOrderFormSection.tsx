import React, { useState } from "react";
import { Building, Warning, Check, SpinnerGap, ArrowRight } from "@phosphor-icons/react";
import { BulkOrderFormData, BulkOrderFormErrors, SubmitStatus } from "../../types/BulkOrderPage";
import { submitBulkOrder } from "../../api/bulk-orders";

const BulkOrderFormSection: React.FC = () => {
    const [formData, setFormData] = useState<BulkOrderFormData>({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        product: '',
        estimatedQuantity: '',
        additionalRequirements: '',
    });

    const [errors, setErrors] = useState<BulkOrderFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

    const validateForm = (): boolean => {
        const newErrors: BulkOrderFormErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        } else if (formData.companyName.trim().length < 2) {
            newErrors.companyName = 'Company name must be at least 2 characters';
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = 'Contact person name is required';
        } else if (formData.contactPerson.trim().length < 2) {
            newErrors.contactPerson = 'Name must be at least 2 characters';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                newErrors.phone = 'Phone number must be at least 10 digits';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!formData.product.trim()) {
            newErrors.product = 'Product/Category is required';
        } else if (formData.product.trim().length < 3) {
            newErrors.product = 'Please specify product details (minimum 3 characters)';
        }

        if (!formData.estimatedQuantity.trim()) {
            newErrors.estimatedQuantity = 'Estimated quantity is required';
        } else if (formData.estimatedQuantity.trim().length < 2) {
            newErrors.estimatedQuantity = 'Please provide quantity details';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof BulkOrderFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await submitBulkOrder({
                companyName: formData.companyName.trim(),
                contactPerson: formData.contactPerson.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                product: formData.product.trim(),
                estimatedQuantity: formData.estimatedQuantity.trim(),
                additionalRequirements: formData.additionalRequirements.trim(),
            });

            if (response.success) {
                setSubmitStatus({
                    type: 'success',
                    message: response.message,
                });
                setFormData({
                    companyName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    product: '',
                    estimatedQuantity: '',
                    additionalRequirements: '',
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: response.error || 'Failed to submit form',
                });
            }
        } catch (error: any) {
            setSubmitStatus({
                type: 'error',
                message: error.error || 'An error occurred. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-[32px] border border-white/15 bg-white text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.12)] p-8 md:p-10">
            <div className="flex flex-col gap-4 mb-8">
                <div className="inline-flex items-center gap-3 rounded-full bg-brand-brown/10 px-4 py-2 text-sm font-semibold text-brand-brown w-fit">
                    <Building size={18} /> Wholesale Inquiry
                </div>
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-brand-brown/60">Start your order</p>
                    <h2 className="text-3xl font-black text-slate-900">Get a quote in minutes</h2>
                </div>
            </div>

            <form className="space-y-4" id="bulk-order-form"  onSubmit={handleSubmit}>
                {submitStatus && (
                    <div
                        className={`rounded-2xl p-4 flex items-start gap-3 ${submitStatus.type === 'success'
                                ? 'bg-emerald-50 border border-emerald-200'
                                : 'bg-red-50 border border-red-200'
                            }`}
                    >
                        {submitStatus.type === 'success' ? (
                            <Check size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <Warning size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <p
                            className={`text-sm ${submitStatus.type === 'success'
                                    ? 'text-emerald-700'
                                    : 'text-red-700'
                                }`}
                        >
                            {submitStatus.message}
                        </p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Company Name <span className="text-red-500">*</span>
                        </span>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Your company"
                            className={`mt-2 w-full rounded-2xl border ${errors.companyName ? 'border-red-400' : 'border-slate-200'
                                } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15`}
                        />
                        {errors.companyName && (
                            <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
                        )}
                    </label>
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Contact Person <span className="text-red-500">*</span>
                        </span>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            placeholder="Full name"
                            className={`mt-2 w-full rounded-2xl border ${errors.contactPerson ? 'border-red-400' : 'border-slate-200'
                                } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15`}
                        />
                        {errors.contactPerson && (
                            <p className="text-xs text-red-600 mt-1">{errors.contactPerson}</p>
                        )}
                    </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Phone <span className="text-red-500">*</span>
                        </span>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 or 10+ digit number"
                            className={`mt-2 w-full rounded-2xl border ${errors.phone ? 'border-red-400' : 'border-slate-200'
                                } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15`}
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                        )}
                    </label>
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Email <span className="text-red-500">*</span>
                        </span>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`mt-2 w-full rounded-2xl border ${errors.email ? 'border-red-400' : 'border-slate-200'
                                } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                        )}
                    </label>
                </div>

                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                        Product / Category <span className="text-red-500">*</span>
                    </span>
                    <input
                        type="text"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        placeholder="e.g. premium cashews, mixed dry fruits"
                        className={`mt-2 w-full rounded-2xl border ${errors.product ? 'border-red-400' : 'border-slate-200'
                            } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15`}
                    />
                    {errors.product && (
                        <p className="text-xs text-red-600 mt-1">{errors.product}</p>
                    )}
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                        Estimated Quantity <span className="text-red-500">*</span>
                    </span>
                    <input
                        type="text"
                        name="estimatedQuantity"
                        value={formData.estimatedQuantity}
                        onChange={handleChange}
                        placeholder="e.g. 500 kg, 100 cartons, 5 pallets"
                        className={`mt-2 w-full rounded-2xl border ${errors.estimatedQuantity ? 'border-red-400' : 'border-slate-200'
                            } bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15`}
                    />
                    {errors.estimatedQuantity && (
                        <p className="text-xs text-red-600 mt-1">{errors.estimatedQuantity}</p>
                    )}
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Additional Requirements</span>
                    <textarea
                        name="additionalRequirements"
                        value={formData.additionalRequirements}
                        onChange={handleChange}
                        placeholder="Packaging preferences, delivery window, custom requests, etc."
                        rows={4}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-cocoa focus:ring-2 focus:ring-brand-cocoa/15"
                    />
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-3 inline-flex items-center justify-center gap-3 w-full rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-cream shadow-[0_20px_40px_rgba(34,22,9,0.25)] transition ${isSubmitting
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-brand-brown hover:bg-brand-cocoa'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <SpinnerGap size={18} weight="bold" className="animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Request
                            <ArrowRight size={18} weight="bold" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default BulkOrderFormSection;