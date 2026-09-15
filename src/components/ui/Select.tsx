import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean | string;
  selectSize?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      options,
      error,
      selectSize = 'md',
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'h-8 text-xs pl-2.5 pr-8',
      md: 'h-10 text-sm pl-3.5 pr-9',
      lg: 'h-12 text-base pl-4 pr-10',
    };

    const hasError = Boolean(error);

    const baseSelectStyles =
      'w-full bg-white text-[#191c1d] rounded-lg border appearance-none transition-all duration-150 focus:outline-none disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:text-[#191c1d]/50 cursor-pointer';

    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-[rgba(25,28,29,0.18)] hover:border-[rgba(25,28,29,0.30)] focus:border-[#a63500] focus:ring-2 focus:ring-[#a63500]/20';

    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          className={`
            ${baseSelectStyles}
            ${stateStyles}
            ${sizeStyles[selectSize]}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-[#191c1d]/50">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
