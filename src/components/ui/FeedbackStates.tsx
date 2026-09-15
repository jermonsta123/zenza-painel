import React from 'react';
import { Button } from './Button';
import { PackageOpen, Inbox, SearchX, RefreshCw } from 'lucide-react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-xl h-32',
  };

  const inlineStyles: React.CSSProperties = {
    ...style,
    width: width,
    height: height,
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[rgba(25,28,29,0.08)] ${variantStyles[variant]} ${className}`}
      style={inlineStyles}
      {...props}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="w-full space-y-3 p-4">
      {/* Table Header skeleton */}
      <div className="flex gap-4 pb-3 border-b border-[rgba(25,28,29,0.08)]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`th-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`tr-${rowIndex}`} className="flex gap-4 py-2.5 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`td-${rowIndex}-${colIndex}`}
              className={`h-4 flex-1 ${colIndex === 0 ? 'h-5' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center rounded-xl bg-white border border-dashed border-[rgba(25,28,29,0.15)] ${
      compact ? 'p-6' : 'p-10 sm:p-14'
    }`}>
      <div className="w-12 h-12 rounded-2xl bg-[#fff3ef] text-[#a63500] border border-[#ffb59c]/50 flex items-center justify-center mb-3.5 shadow-xs">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      
      <h3 className="text-base font-bold text-[#191c1d] tracking-tight mb-1">
        {title}
      </h3>
      
      {description && (
        <p className="text-xs text-[#191c1d]/65 max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {secondaryAction && (
            <Button variant="secondary" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export interface BreadcrumbProps {
  items: { label: string; href?: string; onClick?: () => void }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#191c1d]/60 font-medium">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-[#191c1d]/30 font-normal">/</span>}
              {isLast ? (
                <span className="font-semibold text-[#191c1d]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#a63500] transition-colors focus:outline-none"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
