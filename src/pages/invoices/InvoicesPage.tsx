import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Eye,
    Receipt,
    Loader2,
    Check,
    Calendar,
    User,
    Euro,
    AlertCircle,
    MapPin,
    ChevronLeft,
    ArrowRight
} from 'lucide-react';
import { Pagination } from '../../shared/components/Pagination';
import { apiClient } from '../../shared/api/api-client';
import { useAuth } from '../../features/auth/context/AuthContext';

interface Invoice {
    id: string; // Internal record ID
    image: string;
    total: number;
    subtotal: number;
    tax: number;
    status: string; // e.g., 'Pending', 'Approved', 'Rejected'
    date: string;
    customerName: string;
    paymentMethod: string;
    branchName: string;
}

interface ApiInvoice {
    id: number | string;
    client_id: string;
    branch_id: string;
    branch_name?: string;
    tax: string | number;
    status: string;
    total: string | number;
    subtotla: string | number;
    url_link: string;
    invoice_date: string;
    payment_method: string;
}

interface Branch {
    id: string;
    name: string;
    location?: string;
}

const ITEMS_PER_PAGE = 6;

export default function InvoicesPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'branches' | 'invoices'>('branches');
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchInvoices = useCallback(async (branchId?: string) => {
        const id = branchId || selectedBranchId || user?.branch_id;
        if (!id) return;

        setIsLoading(true);
        setError(null);
        try {
            const endpoint = `/invoice/get-invoices-by-branch-id/${id}`;

            const response = await apiClient.get(endpoint);
            const data = response.data.data || response.data;

            if (Array.isArray(data)) {
                const mappedInvoices: Invoice[] = data.map((inv: ApiInvoice) => ({
                    id: inv.id.toString(),
                    image: inv.url_link || 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=2000',
                    total: parseFloat(inv.total as string) || 0,
                    subtotal: parseFloat(inv.subtotla as string) || 0,
                    tax: parseFloat(inv.tax as string) || 0,
                    status: inv.status,
                    date: inv.invoice_date || new Date().toISOString().split('T')[0],
                    customerName: inv.client_id || 'Unknown Client',
                    paymentMethod: inv.payment_method || 'N/A',
                    branchName: inv.branch_name || (user?.role === 'super_admin' ? branches.find(b => b.id === selectedBranchId)?.name : user?.branch_name) || localStorage.getItem('branch_name') || 'Main Branch'
                }));
                setInvoices(mappedInvoices);
            }
        } catch (err) {
            console.error('Failed to fetch invoices:', err);
            setError('Failed to load invoices. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    }, [user, selectedBranchId]);

    const fetchBranches = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/branch');
            const data = response.data.data || response.data;
            if (Array.isArray(data)) {
                setBranches(data);
            }
        } catch (err) {
            console.error('Failed to fetch branches:', err);
            setError('Failed to load branches.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                setViewMode('invoices');
                fetchInvoices(user.branch_id);
            } else if (user.role === 'super_admin') {
                if (selectedBranchId) {
                    setViewMode('invoices');
                    fetchInvoices(selectedBranchId);
                } else {
                    setViewMode('branches');
                    fetchBranches();
                }
            }
        }
    }, [user, selectedBranchId, fetchInvoices, fetchBranches]);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setIsUpdating(id);
        try {
            const endpoint = `/invoice/${action}/${id}`;
            await apiClient.patch(endpoint);

            setInvoices(prev => prev.map(inv =>
                inv.id === id ? { ...inv, status: action === 'approve' ? 'Approved' : 'Rejected' } : inv
            ));
        } catch (err) {
            console.error(`Failed to ${action} invoice:`, err);
        } finally {
            setIsUpdating(null);
        }
    };

    // Filter logic
    const filteredInvoices = invoices.filter(inv =>
        inv.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleBranchSelect = (branch: Branch) => {
        setSelectedBranchId(branch.id);
        setViewMode('invoices');
    };

    const handleBackToBranches = () => {
        setSelectedBranchId(null);
        setViewMode('branches');
        setInvoices([]);
        setSearchQuery('');
    };

    const selectedBranchName = branches.find(b => b.id === selectedBranchId)?.name || user?.branch_name || 'Selected Branch';

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {user?.role === 'super_admin' && viewMode === 'invoices' && (
                            <button
                                onClick={handleBackToBranches}
                                className="p-1.5 -ml-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            {viewMode === 'branches' ? 'Select Branch' : 'Invoices'}
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500">
                        {viewMode === 'branches'
                            ? 'Please choose a location to view its invoices.'
                            : `Managing invoices for ${selectedBranchName}`}
                    </p>
                </div>

                {viewMode === 'invoices' && (
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
                        <div className="text-right mr-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pending</p>
                            <p className="text-lg md:text-xl font-black text-brand leading-tight">
                                {filteredInvoices.filter(i => i.status.toLowerCase() === 'pending' || i.status.toLowerCase() === 'unverified').length}
                            </p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                        <button className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-brand text-white rounded-xl font-semibold transition-all hover:bg-brand-dark hover:shadow-lg active:scale-95 shadow-sm">
                            <Filter className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm md:text-base">Filter</span>
                        </button>
                    </div>
                )}
            </header>

            {viewMode === 'invoices' && (
                <div className="flex gap-4">
                    <div className="flex-1 relative flex items-center">
                        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by branch or customer name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all shadow-sm"
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand animate-spin" />
                    <p className="text-slate-500 font-medium">Loading {viewMode}...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={viewMode === 'branches' ? fetchBranches : () => fetchInvoices()}
                        className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : viewMode === 'branches' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {branches.map((branch) => (
                        <button
                            key={branch.id}
                            onClick={() => handleBranchSelect(branch)}
                            className="group bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 text-left hover:border-brand hover:shadow-xl hover:shadow-brand/5 transition-all active:scale-[0.98] outline-none focus:ring-4 focus:ring-brand/10"
                        >
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-brand-light/20 rounded-xl group-hover:bg-brand group-hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand group-hover:text-white" />
                                </div>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-1 group-hover:text-brand transition-colors line-clamp-1">{branch.name}</h3>
                            <p className="text-[10px] sm:text-sm text-slate-500 flex items-center gap-1.5 line-clamp-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {branch.location || 'Active Branch'}
                            </p>
                        </button>
                    ))}
                    {branches.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400">No branches found.</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedInvoices.map((invoice) => (
                            <div key={invoice.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 transition-all hover:shadow-md hover:border-slate-200 group relative">
                                <div className="flex justify-between items-start">
                                    <button
                                        onClick={() => setSelectedImage(invoice.image)}
                                        className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center relative group-hover:border-brand transition-all active:scale-95 cursor-zoom-in p-1"
                                    >
                                        <img src={invoice.image} alt="Invoice" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                        </div>
                                    </button>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${invoice.status.toLowerCase() === 'approved' || invoice.status === 'Verified'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : invoice.status.toLowerCase() === 'rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {invoice.status.toLowerCase() === 'approved' || invoice.status === 'Verified' ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : invoice.status.toLowerCase() === 'rejected' ? (
                                                <XCircle className="w-3.5 h-3.5" />
                                            ) : (
                                                <AlertCircle className="w-3.5 h-3.5" />
                                            )}
                                            {invoice.status}
                                        </span>
                                        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Branch</p>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-brand transition-colors">{invoice.branchName}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">Client: {invoice.customerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{invoice.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Receipt className="w-4 h-4 text-slate-400" />
                                            <span>Method: {invoice.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 mt-auto">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Amount</p>
                                            <div className="flex items-center text-xl font-black text-slate-900">
                                                <Euro className="w-5 h-5" />
                                                <span>{invoice.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tax</p>
                                            <p className="text-sm font-semibold text-slate-500">€{invoice.tax.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {(invoice.status.toLowerCase() === 'pending' || invoice.status.toLowerCase() === 'unverified') && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleAction(invoice.id, 'reject')}
                                                disabled={isUpdating === invoice.id}
                                                className="flex-1 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                                            >
                                                {isUpdating === invoice.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleAction(invoice.id, 'approve')}
                                                disabled={isUpdating === invoice.id}
                                                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                                            >
                                                {isUpdating === invoice.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredInvoices.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <Receipt className="w-12 h-12 text-slate-200" />
                            </div>
                            <p className="text-slate-500 font-medium">No invoices found for this location</p>
                            <button
                                onClick={handleBackToBranches}
                                className="text-brand font-bold text-sm hover:underline"
                            >
                                Back to branch selection
                            </button>
                        </div>
                    )}

                    {filteredInvoices.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 fade-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-12 right-0 md:-right-12 p-2 text-white/70 hover:text-white transition-colors active:scale-90"
                            onClick={() => setSelectedImage(null)}
                        >
                            <XCircle className="w-8 h-8" />
                        </button>

                        <div className="bg-white p-1 rounded-xl shadow-2xl overflow-hidden border border-white/20">
                            <img
                                src={selectedImage}
                                alt="Full Invoice"
                                className="w-full h-full object-contain max-h-[80vh] rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
