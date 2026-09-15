import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  id?: string;
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  htmlFor,
  error,
  helperText,
  hint,
  required = false,
  className = '',
  children,
}) => {
  const effectiveHelper = helperText || hint;
  const effectiveHtmlFor = htmlFor || id;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={effectiveHtmlFor}
          className="text-xs font-semibold text-[#191c1d] flex items-center gap-1 select-none"
        >
          {label}
          {required && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
        </label>
      )}
      
      {children}

      {error ? (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : effectiveHelper ? (
        <p className="text-xs text-[#191c1d]/60 mt-0.5">{effectiveHelper}</p>
      ) : null}
    </div>
  );
};
