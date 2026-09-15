import React from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  unit?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label: string;
  };
  iconName?: string;
  variant?: 'brand' | 'emerald' | 'amber' | 'blue' | 'neutral';
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  unit,
  change,
  iconName = 'TrendingUp',
  variant = 'brand',
}) => {
  // Dynamically get Lucide icon
  const iconsRecord = LucideIcons as Record<string, React.ElementType>;
  const IconComponent = iconsRecord[iconName] || LucideIcons.BarChart3;

  const iconColors = {
    brand: 'bg-[#fff3ef] text-[#a63500] border-[#ffb59c]/60',
    emerald: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
    amber: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    blue: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
    neutral: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
  };

  return (
    <Card id={id} padding="md" hoverable className="relative overflow-hidden flex flex-col justify-between">
      {/* Top row: Label & Icon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-[#191c1d]/65 tracking-wide uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg border shrink-0 ${iconColors[variant]}`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191c1d]">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-[#191c1d]/60">{unit}</span>}
      </div>

      {/* Footer Trend & Comparative Context */}
      {change && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-[rgba(25,28,29,0.06)] text-xs">
          {change.trend === 'up' && (
            <span className="inline-flex items-center text-emerald-700 font-bold gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {change.value}
            </span>
          )}
          {change.trend === 'down' && (
            <span className="inline-flex items-center text-red-700 font-bold gap-0.5 bg-red-50 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {change.value}
            </span>
          )}
          {change.trend === 'neutral' && (
            <span className="inline-flex items-center text-neutral-600 font-semibold gap-0.5 bg-neutral-100 px-1.5 py-0.5 rounded">
              <Minus className="w-3.5 h-3.5" />
              {change.value}
            </span>
          )}
          <span className="text-[#191c1d]/60 truncate">{change.label}</span>
        </div>
      )}
    </Card>
  );
};
