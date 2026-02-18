import { useState, useEffect } from 'react';
import { MapPin, Plus, MoreVertical, Loader2 } from 'lucide-react';
import { AddBranchModal } from '../../features/branches/components/AddBranchModal';
import type { Branch } from '../../features/branches/components/AddBranchModal';
import { apiClient } from '../../shared/api/api-client';
import { Pagination } from '../../shared/components/Pagination';

const ITEMS_PER_PAGE = 8;

export default function BranchesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchBranches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/branch');
            const branchList = response.data.data || response.data;
            setBranches(branchList);
        } catch (err: unknown) {
            console.error('Failed to fetch branches:', err);
            setError('Failed to load branches. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
        const handleAddTrigger = () => setIsModalOpen(true);
        window.addEventListener('sb-admin:add-click', handleAddTrigger);
        return () => window.removeEventListener('sb-admin:add-click', handleAddTrigger);
    }, []);

    const handleAddBranch = () => {
        fetchBranches(); // Re-fetch to get the most up-to-date list from backend
    };

    // Pagination logic
    const totalPages = Math.ceil(branches.length / ITEMS_PER_PAGE);
    const paginatedBranches = branches.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Branches Management</h1>
                    <p className="text-sm text-slate-500 mt-1 md:mt-2">View and manage all SB GmbH locations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden sm:flex w-full sm:w-auto mt-4 sm:mt-0 items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl font-semibold transition-all hover:bg-brand-dark hover:shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Branch</span>
                </button>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand animate-spin" />
                    <p className="text-slate-500 font-medium">Loading branches...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={fetchBranches}
                        className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : branches.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 p-12 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Branches Found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">Get started by creating your first branch location to manage staff and operations.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold transition-all hover:bg-brand-dark hover:shadow-lg active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create First Branch</span>
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {paginatedBranches.map((branch) => (
                            <div key={branch.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2 sm:gap-3 transition-all hover:shadow-md hover:border-slate-200 group relative">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center transition-all group-hover:border-brand/30">
                                        {branch.logo ? (
                                            <img src={branch.logo} alt={branch.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <MapPin className="w-8 h-8 text-brand/40" />
                                        )}
                                    </div>
                                    <button className="text-slate-300 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="min-h-[50px] sm:min-h-[60px]">
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{branch.name}</h3>
                                    <p className="text-[10px] sm:text-xs text-slate-500 leading-tight sm:leading-normal line-clamp-2 mt-0.5 sm:mt-1">{branch.address}</p>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-black tracking-widest">Team</span>
                                        <span className="font-bold text-slate-900 text-[10px] sm:text-sm leading-none">{branch.staffCount || 0} Members</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <AddBranchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddBranch}
            />
        </div>
    );
}
