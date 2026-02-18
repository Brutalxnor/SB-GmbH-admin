import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../../../shared/api/api-client';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            console.log('Login response:', response.data);

            // Extract data from response.data.data according to provided structure
            const responseData = response.data.data;

            // Extract token: check nested session structure or top level
            const token = responseData?.session?.session?.access_token ||
                responseData?.token ||
                responseData?.accessToken ||
                response.data?.token;

            // Extract user and normalize name
            const rawUser = responseData?.user || response.data?.user;
            let user = null;

            if (rawUser) {
                // Normalize role
                let normalizedRole: string = (rawUser.role || rawUser.user_type || rawUser.user_level || 'user').toString();
                normalizedRole = normalizedRole.toLowerCase();
                if (normalizedRole === 'superadmin') normalizedRole = 'super_admin';
                if (normalizedRole === 'administrator') normalizedRole = 'admin';

                user = {
                    ...rawUser,
                    name: rawUser.name || `${rawUser.first_name || ''} ${rawUser.last_name || ''}`.trim() || 'User',
                    role: normalizedRole,
                    branch_id: rawUser.branch_id?.toString() || rawUser.branchId?.toString(),
                    branch_name: rawUser.branch_name || rawUser.branchName || rawUser.branch?.name
                };
            }

            if (token && user) {
                login(token, user);

                // Fetch full branch details if user has a branch_id
                if (user.branch_id) {
                    try {
                        const branchResponse = await apiClient.get(`/branch/${user.branch_id}`);
                        const branchData = branchResponse.data.data || branchResponse.data;
                        if (branchData) {
                            localStorage.setItem('branch_details', JSON.stringify(branchData));
                            localStorage.setItem('branch_name', branchData.name || user.branch_name || '');
                            localStorage.setItem('branch_id', branchData.id?.toString() || user.branch_id || '');
                        }
                    } catch (branchErr) {
                        console.error('Failed to fetch full branch details:', branchErr);
                        // We still proceed with login even if branch details fetch fails
                    }
                }

                navigate('/');
            } else {
                console.warn('Login successful but token or user data missing. Extracted:', { token, user });
                setError('Received incomplete user data from server (missing token or user info).');
            }
        } catch (err: unknown) {
            console.error('Login error:', err);
            const axiosError = err as any;
            setError(axiosError.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
            <div className="w-full max-w-[440px] p-10 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 mb-4 bg-brand-light rounded-full">
                        <Lock className="w-8 h-8 text-brand" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">SB-GmbH Admin</h1>
                    <p className="text-slate-500 mt-2 text-center">Sign in to manage your business</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-base outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10"
                                placeholder="admin@sb-gmbh.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-base outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center w-full p-3 bg-brand text-white font-semibold rounded-lg cursor-pointer transition-colors hover:bg-brand-dark disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Reserved for SB-GmbH Authorized Staff
                </p>
            </div>
        </div>
    );
}
