import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.98] focus-ring disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-text-primary-light text-bg-light hover:bg-text-secondary-light dark:bg-text-primary-dark dark:text-bg-dark dark:hover:bg-text-secondary-dark',
      secondary: 'bg-accent-terracotta text-white hover:opacity-90',
      outline: 'border-2 border-border-light dark:border-border-dark bg-transparent hover:bg-black/5 dark:hover:bg-white/5',
      ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark',
    };

    const sizes = {
      sm: 'h-8 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-16 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
