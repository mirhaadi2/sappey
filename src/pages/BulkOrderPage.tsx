import React, { useEffect } from "react";
import {
    BulkOrderHeroSection,
    BulkOrderFormSection,
    BulkOrderBenefitsSection,
} from "../components/BulkOrder";

const BulkOrderPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FCFBF9] text-foreground">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-brown via-brand-cocoa to-brand-plum opacity-95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_30%)] pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                        <BulkOrderHeroSection />
                        <BulkOrderFormSection />
                    </div>
                </div>
            </section>
            <BulkOrderBenefitsSection />
        </div>
    );
};

export default BulkOrderPage;