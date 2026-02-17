import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    GitBranch,
    Users,
    LogOut,
    ChevronRight,
    FileText
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { title: 'Branches', icon: GitBranch, path: '/branches' },
        { title: 'Staff', icon: Users, path: '/staff' },
        { title: 'Invoices', icon: FileText, path: '/invoices' },
    ];

    return (
        <aside className={`
            fixed lg:sticky top-0 left-0 z-50
            w-[260px] h-screen bg-white border-r border-slate-200 
            flex flex-col justify-between p-6 box-border shrink-0
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-brand text-white flex items-center justify-center rounded-xl font-extrabold text-xl">
                        SB
                    </div>
                    <span className="text-xl font-bold text-slate-800">SB GmbH</span>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 no-underline rounded-xl transition-all duration-200 font-medium group ${isActive
                                    ? 'bg-blue-50 text-brand'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-brand'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1">{item.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 transition-opacity duration-200 group-[.active]:opacity-100" />
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-semibold text-slate-600">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate m-0">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-slate-400 m-0">{user?.role || 'Administrator'}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-red-500 font-medium cursor-pointer rounded-xl transition-colors hover:bg-red-50"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
