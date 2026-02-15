export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95',
        secondary: 'bg-surface/80 backdrop-blur-sm text-text border border-glass-border hover:bg-surface-elevated active:scale-95',
        ghost: 'text-text hover:bg-surface active:scale-95',
        danger: 'bg-error text-white hover:bg-error/90 active:scale-95',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-xl font-bold',
        md: 'px-6 py-3 text-base rounded-2xl font-bold',
        lg: 'px-8 py-4 text-lg rounded-3xl font-black',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
}
