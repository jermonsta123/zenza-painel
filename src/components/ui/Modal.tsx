import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'motion/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  // Lock body scroll & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-white rounded-2xl shadow-xl border border-[rgba(25,28,29,0.12)] w-full ${sizeStyles[size]} max-h-[90vh] flex flex-col z-10`}
          >
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[rgba(25,28,29,0.08)]">
                <div>
                  {title && (
                    <h2 className="text-lg font-bold text-[#191c1d] tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-[#191c1d]/65 mt-1 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Fechar modal"
                    className="text-[#191c1d]/50 hover:text-[#191c1d] p-1.5 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#a63500]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'warning' | 'primary' | 'danger' | 'default';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  variant = 'destructive',
  isLoading = false,
}) => {
  const effectiveMessage = message || description || '';
  const effectiveConfirmText = confirmText || confirmLabel || 'Confirmar Ação';
  const effectiveCancelText = cancelText || cancelLabel || 'Cancelar';
  const isDestructive = variant === 'destructive' || variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          isDestructive ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <h3 className="text-base font-bold text-[#191c1d] mb-1.5">{title}</h3>
        <p className="text-xs text-[#191c1d]/70 leading-relaxed mb-6">
          {effectiveMessage}
        </p>

        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {effectiveCancelText}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {effectiveConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
