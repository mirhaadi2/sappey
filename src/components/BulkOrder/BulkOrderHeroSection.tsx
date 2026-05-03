import React from "react";
import { Sparkle, CheckCircle } from "@phosphor-icons/react";

const BulkOrderHeroSection: React.FC = () => {
    return (
        <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-brand-cream mb-6">
                <Sparkle size={16} weight="fill" className="text-brand-cream" />
                Bulk Order Services
            </span>
            <h1 className="font-headline text-[clamp(1.75rem,4vw,2.8rem)] font-black tracking-tight leading-[1.02] mb-6">
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
    );
};

export default BulkOrderHeroSection;