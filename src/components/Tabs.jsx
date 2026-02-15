export function Tabs({ tabs, activeTab, onChange }) {
    return (
        <div className="flex gap-1 p-1 rounded-lg bg-surface">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary hover:text-text'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
