export function Card({ children, className = '', elevated = false, onClick, ...props }) {
    return (
        <div
            className={`rounded-3xl p-6 transition-all duration-300 w-full 
                ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} 
                ${elevated ? 'bg-surface-elevated shadow-xl shadow-black/5' : 'bg-surface/50 backdrop-blur-md'} 
                border border-glass-border ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}
