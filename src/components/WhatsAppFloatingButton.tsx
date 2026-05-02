import React, { useMemo } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";

// Types for better maintainability
interface WhatsAppProps {
    phone?: string;
    message?: string;
}

const WhatsAppFloatingButton: React.FC<WhatsAppProps> = ({ 
    phone = import.meta.env.VITE_WHATSAPP_NUMBER, 
    message = import.meta.env.VITE_WHATSAPP_MESSAGE 
}) => {
    
    // Use useMemo so we don't re-calculate the URL on every render
    const whatsappUrl = useMemo(() => {
        const cleanedPhone = phone?.replace(/[^0-9]/g, "");
        if (!cleanedPhone) return "";
        
        const defaultText = message || "Hi Sappey! I'm interested in your premium dry fruits.";
        return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(defaultText)}`;
    }, [phone, message]);

    if (!whatsappUrl) return null;

    return (
        <div className="fixed bottom-10 right-7 z-50 flex items-center justify-end">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-0 overflow-hidden rounded-full bg-white p-1 shadow-2xl transition-all duration-500 ease-out hover:gap-4 hover:pr-6"
                aria-label="Chat with us on WhatsApp"
            >
                {/* The Green Icon Circle */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-300 group-hover:rotate-[360deg]">
                    <WhatsappLogo size={28} weight="fill" />
                </div>

                {/* The "Hidden" Text that slides out on hover */}
                <div className="max-w-0 whitespace-nowrap opacity-0 transition-all duration-500 ease-out group-hover:max-w-xs group-hover:opacity-100">
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold text-slate-900">Chat with us</span>
                        <span className="text-[10px] font-medium text-slate-500">Order support & queries</span>
                    </div>
                </div>

                {/* Subtle Notification Dot to draw eye movement */}
                <span className="absolute right-1 top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
            </a>
        </div>
    );
};

export default WhatsAppFloatingButton;