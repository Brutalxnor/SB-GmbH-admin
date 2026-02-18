import { NavLink, useLocation } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

export function BottomNav() {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { title: 'Home', icon: Lucide.LayoutDashboard, path: '/' },
        { title: 'Branches', icon: Lucide.GitBranch, path: '/branches', roles: ['super_admin'] },
        { title: 'Staff', icon: Lucide.Users, path: '/staff', roles: ['super_admin'] },
        { title: 'Invoices', icon: Lucide.FileText, path: '/invoices' },
    ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

    if (!user) return null;

    const showAddButton = ['/branches', '/staff'].includes(location.pathname);

    const handleAddClick = () => {
        // Dispatch a custom event that pages can listen to
        window.dispatchEvent(new CustomEvent('sb-admin:add-click'));
    };

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50">
            {navItems.map((item) => (
                <div key={item.path} className="flex-1 flex justify-center">
                    {/* Add spacer for the center button if needed, but we'll use absolute positioning for the button */}
                    <NavLink
                        to={item.path}
                        className={({ isActive }: { isActive: boolean }) =>
                            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isActive
                                ? 'text-brand'
                                : 'text-slate-400 hover:text-slate-600'
                            }`
                        }
                    >
                        {({ isActive }: { isActive: boolean }) => (
                            <>
                                <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand/10' : ''}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {item.title}
                                </span>
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-brand rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                </div>
            ))}

            {showAddButton && (
                <button
                    onClick={handleAddClick}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50 active:scale-95 transition-all z-[60]"
                    aria-label="Add New"
                >
                    <Lucide.Plus className="w-8 h-8 stroke-[3]" />
                </button>
            )}
        </nav>
    );
}
