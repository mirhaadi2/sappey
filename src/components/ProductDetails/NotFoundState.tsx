import React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { NotFoundStateProps } from "../../types/ProductDetails";

const NotFoundState: React.FC<NotFoundStateProps> = ({ onBack }) => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-5xl font-headline text-brand-brown mb-6">Item not found</h1>
        <button onClick={onBack} className="flex items-center gap-3 bg-brand-brown text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-cocoa transition-colors">
            <ArrowLeft /> Return to Shop
        </button>
    </div>
);

export default NotFoundState;