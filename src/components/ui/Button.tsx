import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles: clear focus ring with brand color, transition, typography
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98]';

    // Variants according to Zenza Shop Design System
    const variantStyles = {
      // Primary: #a63500 with hover #d04400
      primary:
        'bg-[#a63500] text-white hover:bg-[#d04400] focus:ring-[#a63500] shadow-sm',
      // Secondary: Crisp neutral surface
      secondary:
        'bg-[#f8f9fa] text-[#191c1d] border border-[rgba(25,28,29,0.12)] hover:bg-[#edf0f2] hover:border-[rgba(25,28,29,0.20)] focus:ring-[#a63500]',
      // Outline: transparent with subtle border
      outline:
        'bg-white text-[#191c1d] border border-[rgba(25,28,29,0.18)] hover:bg-[#f8f9fa] hover:border-[rgba(25,28,29,0.30)] focus:ring-[#a63500]',
      // Destructive: Red for dangerous actions
      destructive:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm',
      // Soft: Brand tinted light background
      soft:
        'bg-[#fff3ef] text-[#a63500] border border-[#ffb59c]/50 hover:bg-[#ffe6dd] focus:ring-[#a63500]',
      // Ghost: text only
      ghost:
        'bg-transparent text-[#191c1d] hover:bg-[rgba(25,28,29,0.06)] focus:ring-[#a63500]',
    };

    // Padding 2x rule: horizontal padding is 2x vertical padding
    const sizeStyles = {
      sm: 'text-xs py-1.5 px-3 gap-1.5 h-8',
      md: 'text-sm py-2 px-4 gap-2 h-10',
      lg: 'text-base py-3 px-6 gap-2.5 h-12',
      icon: 'p-2 h-10 w-10 flex items-center justify-center',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {children && <span className="opacity-90">{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span className="whitespace-nowrap">{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
