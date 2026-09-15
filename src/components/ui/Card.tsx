import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  bordered = true,
  hoverable = false,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const borderStyle = bordered ? 'border border-[rgba(25,28,29,0.10)]' : '';
  const hoverStyle = hoverable ? 'transition-all duration-150 hover:shadow-md hover:border-[rgba(25,28,29,0.20)]' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-xs text-[#191c1d] ${borderStyle} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & { action?: React.ReactNode }> = ({
  children,
  className = '',
  action,
  ...props
}) => (
  <div className={`flex items-center justify-between pb-4 border-b border-[rgba(25,28,29,0.08)] mb-5 ${className}`} {...props}>
    <div>{children}</div>
    {action && <div className="shrink-0 ml-4">{action}</div>}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-bold text-[#191c1d] tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-[#191c1d]/70 mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);
