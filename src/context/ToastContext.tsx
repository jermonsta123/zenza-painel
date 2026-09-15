import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = {
        ...toast,
        id,
        duration: toast.duration ?? 4500,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => showToast({ type: 'success', title, description }),
    [showToast]
  );
  const error = useCallback(
    (title: string, description?: string) => showToast({ type: 'error', title, description }),
    [showToast]
  );
  const warning = useCallback(
    (title: string, description?: string) => showToast({ type: 'warning', title, description }),
    [showToast]
  );
  const info = useCallback(
    (title: string, description?: string) => showToast({ type: 'info', title, description }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Toast viewport */}
      <div 
        aria-live="polite" 
        id="toast-viewport"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';
            const isInfo = toast.type === 'info';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                id={`toast-${toast.id}`}
                className="pointer-events-auto bg-white border rounded-xl shadow-lg p-4 flex items-start gap-3 text-[#191c1d] relative overflow-hidden"
                style={{
                  borderColor: isSuccess ? '#a7f3d0' : isError ? '#fecaca' : isWarning ? '#fde68a' : '#bfdbfe',
                }}
              >
                {/* Left Accent Bar */}
                <div 
                  className={`w-1 absolute left-0 top-0 bottom-0 ${
                    isSuccess ? 'bg-emerald-500' : isError ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                  }`} 
                />

                {/* Status Icon */}
                <div className="shrink-0 mt-0.5 ml-1">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isError && <XCircle className="w-5 h-5 text-red-600" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {isInfo && <Info className="w-5 h-5 text-blue-600" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-semibold text-[#191c1d]">{toast.title}</p>
                  {toast.description && (
                    <p className="text-xs text-[#191c1d]/70 mt-0.5 leading-relaxed">{toast.description}</p>
                  )}
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action?.onClick();
                        removeToast(toast.id);
                      }}
                      className="mt-2 text-xs font-semibold text-[#a63500] hover:text-[#d04400] underline focus:outline-none"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Fechar notificação"
                  className="shrink-0 text-[#191c1d]/40 hover:text-[#191c1d] p-1 rounded-md hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#a63500]"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
