import { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`w-full px-5 py-3 rounded-2xl border text-text placeholder:text-text-muted 
                focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all 
                bg-surface-elevated border-glass-border shadow-sm font-medium ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';
