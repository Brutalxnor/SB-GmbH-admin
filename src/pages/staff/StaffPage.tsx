import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Loader2, Mail, Shield, MapPin } from 'lucide-react';
import { AddStaffModal } from '../../features/staff/components/AddStaffModal';
import type { Staff } from '../../features/staff/components/AddStaffModal';
import { apiClient } from '../../shared/api/api-client';
import { Pagination } from '../../shared/components/Pagination';

const ITEMS_PER_PAGE = 8;

export default function StaffPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchStaff = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/auth/get-all-admins');
            const staffList = response.data.data || response.data;

            interface ApiStaff {
                id: string;
                first_name?: string;
                last_name?: string;
                name?: string;
                role?: 'super_admin' | 'admin' | 'staff';
                branch_name?: string;
                email: string;
            }

            const formattedList = staffList.map((s: ApiStaff) => ({
                id: s.id,
                name: s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Admin User',
                role: s.role || 'admin',
                branch: s.branch_name || 'All Branches',
                email: s.email,
                status: 'Offline'
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
        const handleAddTrigger = () => setIsModalOpen(true);
        window.addEventListener('sb-admin:add-click', handleAddTrigger);
        return () => window.removeEventListener('sb-admin:add-click', handleAddTrigger);
    }, []);

    const handleAddStaff = () => {
        fetchStaff(); // Refresh list after adding
    };

    // Pagination logic
    const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE);
    const paginatedStaff = staff.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Staff Directory</h1>
                    <p className="text-sm text-slate-500 mt-1 md:mt-2">Manage team member accounts and permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden sm:flex w-full sm:w-auto mt-4 sm:mt-0 items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl font-semibold transition-all hover:bg-brand-dark hover:shadow-lg active:scale-95"
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
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
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
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedStaff.map((member) => (
                            <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 transition-all hover:shadow-md hover:border-slate-200 group">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-brand text-xl border border-slate-100 group-hover:bg-brand-light transition-colors">
                                        {member.name.charAt(0)}
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-brand transition-colors">{member.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Shield className="w-4 h-4" />
                                            <span>Role</span>
                                        </div>
                                        <span className="font-semibold text-slate-700 capitalize">{member.role}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>Branch</span>
                                        </div>
                                        <span className="font-semibold text-brand bg-brand-light px-2 py-0.5 rounded-md">{member.branch}</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${member.status === 'Online'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'
                                            }`}></span>
                                        {member.status}
                                    </span>
                                    <button className="text-xs font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-wider">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {staff.length === 0 && (
                        <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500 font-medium">No staff members found.</p>
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <AddStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddStaff}
            />
        </div>
    );
}
