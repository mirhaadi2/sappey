import React, { useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import this
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  showCloseButton = true,
}) => {
  // Prevent scrolling on the background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        // Changed z-index to a standard Tailwind class like z-[9999]
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-brown/40 backdrop-blur-md" // Changed bg to match Sappey branding
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
            className={`relative w-full ${maxWidth} bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-brand-brown/10 overflow-hidden flex flex-col max-h-[90vh]`}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-brand-latte/20 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
              {title && <h2 className="text-2xl font-headline text-brand-brown">{title}</h2>}
              {!title && <div />}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-brand-latte/30 transition-all text-brand-brown/60 hover:text-brand-brown"
                >
                  <X size={24} weight="bold" />
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="p-4 px-6 !pt-0 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // This renders the modal at the end of <body> instead of inside your ShopPage HTML
  return createPortal(modalContent, document.body);
};

export default Modal;