import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, footer }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <div
                className="relative bg-surface-elevated rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl border border-glass-border"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-2xl hover:bg-surface transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="mb-8 text-text">
                    {children}
                </div>
                {footer && (
                    <div className="flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
