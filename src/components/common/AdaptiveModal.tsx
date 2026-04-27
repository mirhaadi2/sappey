import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { useBreakpoint, useTouchDevice, RESPONSIVE_TEXT, SAFE_AREA } from "../../utils/responsive";

interface AdaptiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    showCloseButton?: boolean;
    size?: 'sm' | 'md' | 'lg';  // New prop for sizing
}

// Maximum widths for different sizes
const MODAL_WIDTHS = {
    sm: '400px',
    md: '600px',
    lg: '800px',
} as const;

/**
 * 🎯 ADAPTIVE MODAL COMPONENT
 * ✅ SSR-safe responsive behavior
 * ✅ Touch-optimized for mobile (bottom drawer)
 * ✅ Works across all viewports: 320px → 2560px
 * ✅ Proper safe area handling (notched devices)
 * 
 * Desktop: Centered modal with backdrop
 * Tablet/Mobile: Bottom drawer (sheet) with safe area support
 */
const AdaptiveModal: React.FC<AdaptiveModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    size = 'md',
}) => {
    // Detect if device is touch-enabled
    const isTouch = useTouchDevice();
    // Detect if mobile width (true if viewport < md breakpoint 1024px)
    const isMobileWidth = useBreakpoint("md");
    
    // Use bottom drawer on touch devices OR small screens
    const useBottomDrawer = isTouch || isMobileWidth;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop - tap to close */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* BOTTOM DRAWER (Mobile/Touch) */}
                    {useBottomDrawer ? (
                        <motion.div
                            key="bottom-drawer"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                                mass: 0.8,
                            }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-y-auto"
                            style={{
                                maxHeight: 'clamp(80vh, 85dvh, 95vh)',  // Dynamic viewport height (excludes iOS address bar)
                                paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
                            }}
                        >
                            {/* Drag handle for iOS (visual affordance) */}
                            <div className="flex justify-center pt-2 pb-4">
                                <div className="w-12 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
                            </div>

                            {/* Header with close button */}
                            {title && (
                                <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-lg py-md border-b border-gray-100 flex items-center justify-between">
                                    <h2 className={`${RESPONSIVE_TEXT.heading5} text-brand-brown`}>
                                        {title}
                                    </h2>
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-brand-brown min-h-11 min-w-11"
                                            aria-label="Close modal"
                                            type="button"
                                        >
                                            <X size={24} weight="bold" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content with proper safe padding */}
                            <div
                                className="px-lg py-md"
                                style={{
                                    paddingLeft: `max(1rem, env(safe-area-inset-left))`,
                                    paddingRight: `max(1rem, env(safe-area-inset-right))`,
                                }}
                            >
                                {children}
                            </div>
                        </motion.div>
                    ) : (
                        /* CENTERED MODAL (Desktop/Tablet) */
                        <motion.div
                            key="centered-modal-wrapper"
                            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-lg"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 30,
                                }}
                                className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-brand-brown/10 overflow-y-auto"
                                style={{
                                    width: `min(100%, ${MODAL_WIDTHS[size]})`,
                                    maxHeight: 'clamp(400px, 90vh, 800px)',
                                }}
                            >
                                {/* Header with close button (desktop) */}
                                {title && (
                                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-lg py-md border-b border-gray-100 flex items-center justify-between">
                                        <h2 className={`${RESPONSIVE_TEXT.heading4} text-brand-brown`}>
                                            {title}
                                        </h2>
                                        {showCloseButton && (
                                            <button
                                                onClick={onClose}
                                                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-brand-brown min-h-11 min-w-11"
                                                aria-label="Close modal"
                                                type="button"
                                            >
                                                <X size={24} weight="bold" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="px-lg py-lg">{children}</div>
                            </motion.div>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default AdaptiveModal;
