import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'soft' | 'elevated';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  elevation = 'soft',
  hoverEffect = false,
  children,
  ...props
}) => {
  const elevations = {
    flat: 'border border-brand-border bg-white',
    soft: 'border border-brand-border/80 bg-white shadow-soft',
    elevated: 'border border-brand-border/60 bg-white shadow-elevated',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200 overflow-hidden',
        elevations[elevation],
        hoverEffect && 'hover:shadow-elevated hover:border-brand-plum/30 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
