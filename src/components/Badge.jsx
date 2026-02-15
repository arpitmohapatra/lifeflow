export function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-surface text-text border border-border',
        primary: 'bg-primary text-white',
        success: 'bg-success text-white',
        warning: 'bg-warning text-white',
        error: 'bg-error text-white',
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
