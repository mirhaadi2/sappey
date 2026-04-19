import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Building, Suitcase, Phone, EnvelopeSimple, Sparkle, Warning, Check, SpinnerGap } from "@phosphor-icons/react";
import { submitBulkOrder } from "../api/bulk-orders";

interface FormData {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    product: string;
    estimatedQuantity: string;
    additionalRequirements: string;
}

interface FormErrors {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    product?: string;
    estimatedQuantity?: string;
}

const BulkOrderPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        product: '',
        estimatedQuantity: '',
        additionalRequirements: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

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
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
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
        <div className="bg-[#FCFBF9] text-foreground">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-brown via-brand-cocoa to-brand-plum opacity-95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_30%)] pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                        <div className="text-white">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-brand-cream mb-6">
                                <Sparkle size={16} weight="fill" className="text-brand-cream" />
                                Bulk Order Services
                            </span>
                            <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tight leading-[1.02] mb-6">
                                Premium Bulk Ordering for Retailers & Businesses
                            </h1>
                            <p className="max-w-2xl text-base md:text-lg text-brand-cream/90 leading-relaxed mb-8">
                                Request a tailored quote, manage volume pricing, and get dedicated support for dry fruit and gourmet store assortments designed to match your supply chain expectations.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-white/10 border border-white/15 p-6">
                                    <p className="text-sm uppercase tracking-[0.25em] text-brand-cream/70 mb-3">Why choose bulk</p>
                                    <ul className="space-y-3 text-sm text-brand-cream/90">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={18} className="mt-1 text-brand-cream" />
                                            Volume pricing with reliable reorder timelines.
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={18} className="mt-1 text-brand-cream" />
                                            Premium packaging and logistics support for wholesale buyers.
                                        </li>
                                    </ul>
                                </div>
                                <div className="rounded-3xl bg-white/10 border border-white/15 p-6">
                                    <p className="text-sm uppercase tracking-[0.25em] text-brand-cream/70 mb-3">Ready for every order</p>
                                    <ul className="space-y-3 text-sm text-brand-cream/90">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={18} className="mt-1 text-brand-cream" />
                                            Flexible quantities from cartons to full pallets.
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={18} className="mt-1 text-brand-cream" />
                                            Dedicated support for large corporate and retail customers.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

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

                            <form className="space-y-4" id="bulk-order-form" onSubmit={handleSubmit}>
                                {submitStatus && (
                                    <div
                                        className={`rounded-2xl p-4 flex items-start gap-3 ${
                                            submitStatus.type === 'success'
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
                                            className={`text-sm ${
                                                submitStatus.type === 'success'
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
                                            className={`mt-2 w-full rounded-2xl border ${
                                                errors.companyName ? 'border-red-400' : 'border-slate-200'
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
                                            className={`mt-2 w-full rounded-2xl border ${
                                                errors.contactPerson ? 'border-red-400' : 'border-slate-200'
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
                                            className={`mt-2 w-full rounded-2xl border ${
                                                errors.phone ? 'border-red-400' : 'border-slate-200'
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
                                            className={`mt-2 w-full rounded-2xl border ${
                                                errors.email ? 'border-red-400' : 'border-slate-200'
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
                                        className={`mt-2 w-full rounded-2xl border ${
                                            errors.product ? 'border-red-400' : 'border-slate-200'
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
                                        className={`mt-2 w-full rounded-2xl border ${
                                            errors.estimatedQuantity ? 'border-red-400' : 'border-slate-200'
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
                                    className={`mt-3 inline-flex items-center justify-center gap-3 w-full rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-cream shadow-[0_20px_40px_rgba(34,22,9,0.25)] transition ${
                                        isSubmitting
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

                            {/* <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-slate-100 p-4">
                                    <div className="flex items-center gap-3 text-brand-brown font-semibold mb-3">
                                        <Phone size={18} />
                                        Call us
                                    </div>
                                    <p className="text-sm text-slate-600">+91 8492943652</p>
                                </div>
                                <div className="rounded-3xl bg-slate-100 p-4">
                                    <div className="flex items-center gap-3 text-brand-brown font-semibold mb-3">
                                        <EnvelopeSimple size={18} />
                                        Write to us
                                    </div>
                                    <p className="text-sm text-slate-600">support@sappey.com</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid gap-10 lg:grid-cols-3">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-cocoa/10 px-3 py-2 text-sm font-semibold text-brand-cocoa mb-5">
                            <Sparkle size={16} /> Premium Support
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Dedicated wholesale support</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">One point of contact for pricing, delivery, and order tracking across every bulk purchase.</p>
                    </div>
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-brown/10 px-3 py-2 text-sm font-semibold text-brand-brown mb-5">
                            <Suitcase size={16} /> Volume options
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Flexible quantities</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">From retail bundles to pallet orders, we shape supply plans around your business needs.</p>
                    </div>
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-plum/10 px-3 py-2 text-sm font-semibold text-brand-plum mb-5">
                            <Building size={16} /> Quality promise
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Consistent quality</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">Every shipment is packed carefully and delivered with the same freshness standards as our retail collections.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BulkOrderPage;
