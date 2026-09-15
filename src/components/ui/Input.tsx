import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      error,
      leftElement,
      rightElement,
      inputSize = 'md',
      disabled,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'h-8 text-xs px-2.5',
      md: 'h-10 text-sm px-3.5',
      lg: 'h-12 text-base px-4',
    };

    const hasError = Boolean(error);

    const baseInputStyles =
      'w-full bg-white text-[#191c1d] placeholder:text-[#191c1d]/40 rounded-lg border transition-all duration-150 focus:outline-none disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:text-[#191c1d]/50';

    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/10'
      : 'border-[rgba(25,28,29,0.18)] hover:border-[rgba(25,28,29,0.30)] focus:border-[#a63500] focus:ring-2 focus:ring-[#a63500]/20';

    return (
      <div className="relative flex items-center w-full">
        {leftElement && (
          <div className="absolute left-3 flex items-center pointer-events-none text-[#191c1d]/50">
            {leftElement}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={hasError}
          className={`
            ${baseInputStyles}
            ${stateStyles}
            ${sizeStyles[inputSize]}
            ${leftElement ? 'pl-9' : ''}
            ${rightElement ? 'pr-9' : ''}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center text-[#191c1d]/50">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
