import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverLift = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-white dark:bg-bg-dark-alt border border-border-light dark:border-border-dark',
          'shadow-[var(--shadow-soft)] dark:shadow-[var(--shadow-soft-dark)]',
          'transition-all duration-300 ease-out',
          hoverLift && 'hover:-translate-y-1 hover:shadow-xl',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
