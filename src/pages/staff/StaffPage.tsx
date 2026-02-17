import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { AddStaffModal } from '../../features/staff/components/AddStaffModal';
import type { Staff } from '../../features/staff/components/AddStaffModal';
import { apiClient } from '../../shared/api/api-client';

export default function StaffPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStaff = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/auth/get-all-admins');
            const staffList = response.data.data || response.data;

            const formattedList = staffList.map((s: any) => ({
                id: s.id,
                name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.name || 'Admin User',
                role: s.role || 'admin',
                branch: s.branch_name || 'All Branches',
                email: s.email,
                status: 'Offline' // Defaulting to offline as status isn't provided by endpoint usually
            }));

            setStaff(formattedList);
        } catch (err) {
            console.error('Failed to fetch staff:', err);
            setError('Failed to load staff members.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleAddStaff = () => {
        fetchStaff(); // Refresh list after adding
    };

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Staff Directory</h1>
                    <p className="text-sm text-slate-500 mt-1 md:mt-2">Manage team member accounts and permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl font-semibold transition-all hover:bg-brand-dark hover:shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Staff</span>
                </button>
            </header>

            <div className="flex gap-4">
                <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search staff by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand animate-spin" />
                    <p className="text-slate-500 font-medium">Loading staff members...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={fetchStaff}
                        className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Staff Member</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Branch</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-bottom border-slate-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {staff.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-lg">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 m-0">{member.name}</p>
                                                    <p className="text-xs text-slate-400 m-0">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-slate-600 font-medium capitalize">{member.role}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-brand font-semibold px-2 py-1 bg-blue-50 rounded-lg">{member.branch}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${member.status === 'Online'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'
                                                    }`}></span>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {staff.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                                            No staff members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AddStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddStaff}
            />
        </div>
    );
}
