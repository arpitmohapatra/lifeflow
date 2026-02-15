import { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`w-full px-4 py-2 rounded-md border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-surface border-border ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';
