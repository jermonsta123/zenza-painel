import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, disabled, rows = 3, ...props }, ref) => {
    const hasError = Boolean(error);
    const baseStyles =
      'w-full bg-white text-[#191c1d] placeholder:text-[#191c1d]/40 rounded-lg p-3 text-sm border transition-all duration-150 focus:outline-none disabled:bg-[#f8f9fa] disabled:cursor-not-allowed';
    
    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-[rgba(25,28,29,0.18)] hover:border-[rgba(25,28,29,0.30)] focus:border-[#a63500] focus:ring-2 focus:ring-[#a63500]/20';

    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={hasError}
        className={`${baseStyles} ${stateStyles} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, error, id, disabled, ...props }, ref) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;

    return (
      <label
        htmlFor={inputId}
        className={`flex items-start gap-2.5 cursor-pointer select-none group ${
          disabled ? 'cursor-not-allowed opacity-55' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            className="w-4 h-4 rounded border-[rgba(25,28,29,0.25)] text-[#a63500] focus:ring-[#a63500] focus:ring-offset-0 focus:ring-2 cursor-pointer transition-colors"
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-semibold text-[#191c1d] leading-none group-hover:text-[#a63500] transition-colors">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-[#191c1d]/65 mt-1 leading-snug">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', label, description, id, checked, disabled, onChange, ...props }, ref) => {
    const fallbackId = React.useId();
    const switchId = id || fallbackId;

    return (
      <div className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-55 cursor-not-allowed' : ''} ${className}`}>
        {(label || description) && (
          <label htmlFor={switchId} className="flex flex-col cursor-pointer select-none">
            {label && <span className="text-xs font-semibold text-[#191c1d]">{label}</span>}
            {description && <span className="text-[11px] text-[#191c1d]/65 mt-0.5">{description}</span>}
          </label>
        )}
        <label htmlFor={switchId} className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-[rgba(25,28,29,0.18)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#a63500] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[rgba(25,28,29,0.1)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a63500]" />
        </label>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
