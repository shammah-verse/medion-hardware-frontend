import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted focus-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-accent-terracotta focus-visible:ring-accent-terracotta',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-accent-terracotta">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
