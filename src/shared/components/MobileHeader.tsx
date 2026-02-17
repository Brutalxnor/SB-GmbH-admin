import { Menu, X } from 'lucide-react';

interface MobileHeaderProps {
    onMenuClick: () => void;
    isOpen: boolean;
}

export function MobileHeader({ onMenuClick, isOpen }: MobileHeaderProps) {
    return (
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand text-white flex items-center justify-center rounded-lg font-extrabold text-lg">
                    SB
                </div>
                <span className="text-lg font-bold text-slate-800">SB GmbH</span>
            </div>

            <button
                onClick={onMenuClick}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </header>
    );
}
