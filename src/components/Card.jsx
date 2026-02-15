export function Card({ children, className = '', elevated = false, onClick, ...props }) {
    return (
        <div
            className={`rounded-lg p-6 transition-all w-full ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${elevated ? 'bg-surface-elevated shadow-md' : 'bg-surface shadow-sm'
                } border border-border ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}
