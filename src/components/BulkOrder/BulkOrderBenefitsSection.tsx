import React from "react";
import { Sparkle, Suitcase, Building } from "@phosphor-icons/react";

const BulkOrderBenefitsSection: React.FC = () => {
    return (
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
    );
};

export default BulkOrderBenefitsSection;