import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';

export function Layout() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
            <MobileHeader />

            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
                <div className="flex-1 p-4 md:p-6 lg:p-10">
                    <Outlet />
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
