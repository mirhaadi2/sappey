import React, { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';

interface LazySectionProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
    delay?: number; // Additional delay before rendering
    onVisible?: () => void; // Callback when section becomes visible
}

/**
 * Professional lazy loading wrapper that:
 * - Only renders content when visible on screen
 * - Maintains layout height to prevent CLS (Cumulative Layout Shift)
 * - Includes smooth fade-in animations
 * - Supports custom fallback and threshold
 * - Fires callback when section becomes visible (useful for analytics)
 */
const LazySection: React.FC<LazySectionProps> = ({
    children,
    fallback,
    threshold = 0.1,
    rootMargin = '250px 0px', // Trigger 250px before entering viewport
    delay = 0,
    onVisible,
}) => {
    const { ref, inView } = useInView({
        threshold,
        rootMargin,
        triggerOnce: true, // Only fetch once for performance
    });

    React.useEffect(() => {
        if (inView && onVisible) {
            const timer = setTimeout(onVisible, delay);
            return () => clearTimeout(timer);
        }
    }, [inView, onVisible, delay]);

    return (
        <div ref={ref} className="w-full">
            <AnimatePresence mode="wait">
                {inView ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        key="content"
                    >
                        <Suspense fallback={fallback || <div className="h-20" />}>
                            {children}
                        </Suspense>
                    </motion.div>
                ) : (
                    <div key="fallback" className="min-h-[100px]">
                        {fallback || <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LazySection;
