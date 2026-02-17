import { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Eye,
    Receipt,
    Loader2,
    Check
} from 'lucide-react';

interface Invoice {
    id: string;
    image: string;
    total: number;
    subtotal: number;
    tax: number;
    status: 'Verified' | 'Unverified';
    date: string;
    customerName: string;
}

export default function InvoicesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: 'INV-001',
            image: 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=2000',
            total: 1250.00,
            subtotal: 1050.42,
            tax: 199.58,
            status: 'Unverified',
            date: '2024-02-15',
            customerName: 'TechSolutions GmbH'
        },
        {
            id: 'INV-002',
            image: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&q=80&w=2000',
            total: 3420.50,
            subtotal: 2874.37,
            tax: 546.13,
            status: 'Verified',
            date: '2024-02-14',
            customerName: 'Global Trade Corp'
        },
        {
            id: 'INV-003',
            image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=2000',
            total: 890.00,
            subtotal: 747.90,
            tax: 142.10,
            status: 'Unverified',
            date: '2024-02-13',
            customerName: 'Creative Labs'
        }
    ]);

    const handleVerify = async (id: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));

        setInvoices(prev => prev.map(inv =>
            inv.id === id ? { ...inv, status: 'Verified' } : inv
        ));
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Invoice Verification</h1>
                    <p className="text-sm text-slate-500 mt-1 md:mt-2">Review business invoices for processing.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
                    <div className="text-right mr-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pending</p>
                        <p className="text-lg md:text-xl font-black text-brand leading-tight">
                            {invoices.filter(i => i.status === 'Unverified').length}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                    <button className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-brand text-white rounded-xl font-semibold transition-all hover:bg-brand-dark hover:shadow-lg active:scale-95 shadow-sm">
                        <Filter className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">Filter</span>
                    </button>
                </div>
            </header>

            <div className="flex gap-4">
                <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by invoice ID or customer name..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Invoice Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Subtotal</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Tax (19%)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Total Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setSelectedImage(invoice.image)}
                                                className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center relative group-hover:border-brand transition-all active:scale-95 cursor-zoom-in"
                                            >
                                                <img src={invoice.image} alt="Invoice" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                                                    <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                                </div>
                                            </button>
                                            <div>
                                                <p className="font-bold text-slate-900 m-0">{invoice.id}</p>
                                                <p className="text-xs text-slate-500 m-0 mb-1">{invoice.customerName}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                    {invoice.date}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-medium text-slate-600">
                                        €{invoice.subtotal.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-5 text-right text-slate-400 text-sm">
                                        €{invoice.tax.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-lg font-black text-slate-900">€{invoice.total.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${invoice.status === 'Verified'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {invoice.status === 'Verified' ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <XCircle className="w-3.5 h-3.5" />
                                            )}
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {invoice.status === 'Unverified' && (
                                                <button
                                                    onClick={() => handleVerify(invoice.id)}
                                                    disabled={isLoading}
                                                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Check className="w-3.5 h-3.5" />
                                                    )}
                                                    Verify
                                                </button>
                                            )}
                                            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {invoices.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <Receipt className="w-12 h-12 text-slate-200" />
                        </div>
                        <p className="text-slate-500 font-medium">No invoices found</p>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-90"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <XCircle className="w-8 h-8" />
                    </button>

                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 fade-in duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Full Invoice"
                            className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
