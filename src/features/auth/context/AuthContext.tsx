import React, { createContext, useContext, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'staff' | 'user';
    branch_id?: string;
    branch_name?: string;
    branch_details?: Record<string, unknown>;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                // Basic normalization for existing sessions
                if (user && user.role) {
                    const role = user.role.toLowerCase();
                    if (role === 'superadmin') user.role = 'super_admin';
                    if (role === 'administrator') user.role = 'admin';
                    if (!['super_admin', 'admin', 'staff', 'user'].includes(user.role)) {
                        user.role = 'user';
                    }
                }

                // Ensure branch data from separate keys is merged if missing in user object
                if (!user.branch_id) {
                    user.branch_id = localStorage.getItem('branch_id') || undefined;
                }
                if (!user.branch_name) {
                    user.branch_name = localStorage.getItem('branch_name') || undefined;
                }

                return user;
            } catch (e) {
                console.error('Failed to parse saved user', e);
                localStorage.removeItem('user');
            }
        }
        return null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('branch_id');
        localStorage.removeItem('branch_name');
        localStorage.removeItem('branch_details');
        setToken(null);
        setUser(null);
    };


    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        if (newUser.branch_id) {
            localStorage.setItem('branch_id', newUser.branch_id);
        }
        if (newUser.branch_name) {
            localStorage.setItem('branch_name', newUser.branch_name);
        }

        setToken(newToken);
        setUser(newUser);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
