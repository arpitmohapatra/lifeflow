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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-surface-elevated rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-surface transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mb-6 text-text">
                    {children}
                </div>
                {footer && (
                    <div className="flex gap-2 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
