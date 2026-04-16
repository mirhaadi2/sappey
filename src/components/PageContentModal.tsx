import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Spinner } from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { usePageBySlug } from '../api/homepage';

interface PageContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  title: string;
}

const PageContentModal: React.FC<PageContentModalProps> = ({
  isOpen,
  onClose,
  slug,
  title,
}) => {
  const { page, isLoading, error } = usePageBySlug(slug);

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
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-brand-brown/10 overflow-auto max-h-[calc(100vh-2rem)]"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Close Button & Title */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} weight="bold" className="text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Spinner size={32} className="text-brand-brown animate-spin" />
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium">Failed to load content</p>
                  <p className="text-sm text-slate-500 mt-2">{typeof error === 'string' ? error : error?.message || 'Unknown error'}</p>
                </div>
              )}

              {page && !isLoading && (
                <div className="prose prose-sm max-w-none text-slate-700">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold text-brand-brown mt-6 mb-4" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-bold text-brand-brown mt-5 mb-3" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold text-brand-brown mt-4 mb-2" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-slate-700 leading-relaxed mb-4" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-brand-brown font-medium hover:underline" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <table className="w-full border-collapse border border-slate-300 mb-4" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-slate-300 bg-slate-100 p-2 text-left font-semibold" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-slate-300 p-2" {...props} />
                      ),
                    }}
                  >
                    {page.content || page.body || ''}
                  </ReactMarkdown>
                </div>
              )}

              {!isLoading && !error && !page && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No content available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PageContentModal;
