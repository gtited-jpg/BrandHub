'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'lg' | 'sm' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = {
      default: 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-[0_0_20px_theme(colors.violet.500)]',
      ghost: 'text-slate-300 hover:bg-slate-700 hover:text-white',
    };

    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      lg: 'h-11 rounded-md px-8 text-base',
      sm: 'h-9 rounded-md px-3',
      icon: 'h-8 w-8',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
