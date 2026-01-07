import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 dark:text-white',
          'ring-1 ring-inset ring-slate-200 dark:ring-slate-700',
          'placeholder:text-slate-400',
          'bg-slate-50 dark:bg-[#111a22]',
          'focus:ring-2 focus:ring-inset focus:ring-primary',
          'transition-shadow sm:text-sm sm:leading-6',
          error && 'ring-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
