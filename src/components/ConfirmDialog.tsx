import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Warning, CheckCircle,  Info } from '@phosphor-icons/react';

export type ConfirmType = 'warning' | 'danger' | 'success' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const typeConfig = {
  warning: {
    icon: Warning,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    buttonColor: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
  },
  danger: {
    icon: Warning,
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    buttonColor: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    buttonColor: 'bg-green-600 hover:bg-green-700 shadow-green-200',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
  },
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-brand-brown/10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700 z-10"
            >
              <X size={20} weight="bold" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <div className={`w-16 h-16 ${config.bgColor} ${config.textColor} rounded-[24px] flex items-center justify-center mb-6 mx-auto`}>
                <Icon size={32} weight="duotone" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
                {title}
              </h3>

              {/* Description */}
              {description && (
                <p className="text-slate-600 text-center mb-8 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 ${config.buttonColor} text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
