import { useState, useRef } from 'react';
import { X, MapPin, Building2, Loader2, Upload } from 'lucide-react';
import { apiClient } from '../../../shared/api/api-client';

export interface Branch {
    id: number | string;
    name: string;
    address: string;
    staffCount: number;
    logo?: string;
}

interface AddBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (branch: Branch) => void;
}

export function AddBranchModal({ isOpen, onClose, onAdd }: AddBranchModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
    });
    const [logo, setLogo] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            if (logoFile) {
                formDataToSend.append('logo', logoFile);
            }

            // Log all FormData entries for verification
            console.group('Add Branch - API Request Details');
            console.log('Endpoint: POST /branch');
            formDataToSend.forEach((value, key) => {
                if (value instanceof File) {
                    console.log(`Field [${key}]: File - ${value.name} (${value.size} bytes, type: ${value.type})`);
                } else {
                    console.log(`Field [${key}]:`, value);
                }
            });
            console.groupEnd();

            const response = await apiClient.post('/branch', formDataToSend, {
                // Setting Content-Type to undefined allows Axios to automatically 
                // set the correct multipart/form-data header with the boundary
                headers: {
                    'Content-Type': undefined,
                }
            });

            const newBranch = response.data.data || response.data;
            // The UI still needs the address for display, so we pass it back with the new ID
            onAdd({
                ...newBranch,
                address: formData.address // Keep address for UI persistence
            });

            setIsLoading(false);
            onClose();
            setFormData({ name: '', address: '' });
            setLogo(null);
            setLogoFile(null);
        } catch (err: unknown) {
            console.error('Failed to add branch. Full error:', err);
            let errorMessage = 'Failed to create branch. Please try again.';

            if (err && typeof err === 'object' && 'response' in err) {
                const responseData = (err as { response: { data?: { message?: string; error?: string } } }).response?.data;
                console.error('Error response data:', responseData);

                if (responseData?.message) {
                    errorMessage = responseData.message;
                } else if (responseData?.error) {
                    errorMessage = responseData.error;
                }
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
                <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-brand/10 text-brand rounded-lg">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Add New Branch</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Logo</label>
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative h-32 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden ${isDragging
                                ? 'border-brand bg-brand/5'
                                : logo
                                    ? 'border-slate-200 bg-slate-50'
                                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                className="hidden"
                                accept="image/*"
                            />

                            {logo ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white">
                                    <img src={logo} alt="Preview" className="h-full w-full object-contain" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-bold bg-slate-900/60 px-2 py-1 rounded">Change Logo</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-slate-600">Click or drag to upload</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Branch Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                                placeholder="e.g. Munich Central"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                                placeholder="Full address here..."
                            />
                        </div>
                    </div>

                    <footer className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-brand text-white font-semibold rounded-xl transition-all hover:bg-brand-dark hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Add Branch'
                            )}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
