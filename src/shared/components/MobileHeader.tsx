import { LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

export function MobileHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand text-white flex items-center justify-center rounded-lg font-extrabold text-lg">
                    SB
                </div>
                <span className="text-lg font-bold text-slate-800 tracking-tight">SB GmbH</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center font-bold text-brand shadow-sm">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <button
                        onClick={logout}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
