import React from 'react';
import { StatusVariant } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  withDot?: boolean;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  withDot = false,
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variantStyles = {
    emerald: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
    amber: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    red: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
    blue: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
    brand: 'bg-[#fff3ef] text-[#a63500] border-[#ffb59c]',
    neutral: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
  };

  const dotStyles = {
    emerald: 'bg-[#10b981]',
    amber: 'bg-[#f59e0b]',
    red: 'bg-[#ef4444]',
    blue: 'bg-[#3b82f6]',
    brand: 'bg-[#a63500]',
    neutral: 'bg-[#6b7280]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border whitespace-nowrap transition-colors select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};
