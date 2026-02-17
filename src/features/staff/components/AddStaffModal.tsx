import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Building2, Loader2 } from 'lucide-react';
import { apiClient } from '../../../shared/api/api-client';

interface Branch {
    id: string;
    name: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    branch: string;
    email: string;
    status: string;
    first_name?: string;
    last_name?: string;
    branch_name?: string;
}

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (staff: Staff) => void;
}

export function AddStaffModal({ isOpen, onClose, onAdd }: AddStaffModalProps) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        branch_id: ''
    });
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBranches, setIsFetchingBranches] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBranches();
        }
    }, [isOpen]);

    const fetchBranches = async () => {
        setIsFetchingBranches(true);
        try {
            const response = await apiClient.get('/branch');
            // Assuming response.data.data is the list of branches based on previous patterns
            const branchList = response.data.data || response.data;
            setBranches(branchList);
        } catch (err) {
            console.error('Failed to fetch branches:', err);
            setError('Failed to load branches. Please close and try again.');
        } finally {
            setIsFetchingBranches(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/auth/register', {
                ...formData,
                role: 'admin'
            });
            const newStaff: Staff = response.data.data || response.data.user || response.data;

            onAdd(newStaff);
            onClose();
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                branch_id: ''
            });
        } catch (err: unknown) {
            console.error('Registration error:', err);
            const errorMessage = (err as any).response?.data?.message || 'Failed to register staff. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
                <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-brand/10 text-brand rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Add New Staff</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">First Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                                    placeholder="Jane"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Last Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                                placeholder="jane.doe@sb-gmbh.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Assigned Branch</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                required
                                value={formData.branch_id}
                                onChange={e => setFormData({ ...formData, branch_id: e.target.value })}
                                disabled={isFetchingBranches}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                            >
                                <option value="">Select a branch</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                            {isFetchingBranches && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                            )}
                        </div>
                    </div>

                    <footer className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isFetchingBranches}
                            className="flex-1 px-4 py-2.5 bg-brand text-white font-semibold rounded-xl transition-all hover:bg-brand-dark hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                'Register Staff'
                            )}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
