export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            {Icon && <Icon className="w-16 h-16 mb-4 text-text-muted" />}
            <h3 className="text-xl font-semibold mb-2 text-text">{title}</h3>
            {description && (
                <p className="mb-6 max-w-sm text-text-secondary">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
