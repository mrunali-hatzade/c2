import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-brand-border/80 rounded-3xl bg-brand-cream-light/40',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum mb-4 shadow-sm">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-brand-espresso font-serif">{title}</h3>
      {description && (
        <p className="text-xs text-brand-muted max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
