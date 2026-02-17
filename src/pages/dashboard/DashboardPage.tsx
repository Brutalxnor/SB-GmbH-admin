import React from 'react';
import {
    Users,
    GitBranch,
    TrendingUp,
    Clock
} from 'lucide-react';

export default function DashboardPage() {
    const stats = [
        { title: 'Total Staff', value: '24', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Branches', value: '5', icon: GitBranch, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { title: 'Active Staff', value: '18', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
        { title: 'Avg Shift', value: '8.2h', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back! Here's what's happening at SB GmbH.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition-transform hover:scale-[1.02]">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                <div className="flex flex-col gap-8">
                    <div className="flex gap-4 relative">
                        <div className="w-2.5 h-2.5 bg-brand rounded-full mt-1.5 shrink-0 z-10"></div>
                        <div className="absolute left-[4.5px] top-4 bottom-[-2rem] w-[1px] bg-slate-100"></div>
                        <div>
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold">John Doe</span> signed in at <span className="font-semibold text-brand">Munich Branch</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                        </div>
                    </div>
                    <div className="flex gap-4 relative">
                        <div className="w-2.5 h-2.5 bg-brand rounded-full mt-1.5 shrink-0 z-10"></div>
                        <div>
                            <p className="text-sm text-slate-700">
                                New branch <span className="font-semibold text-brand">Berlin Central</span> was added
                            </p>
                            <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
