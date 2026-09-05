import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading bakery data...',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <Loader2 className="w-8 h-8 text-brand-plum animate-spin mb-3" />
      <p className="text-sm font-medium text-brand-muted">{message}</p>
    </div>
  );
};
