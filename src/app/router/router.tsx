import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { Layout } from '../../shared/components/Layout';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import BranchesPage from '../../pages/branches/BranchesPage';
import StaffPage from '../../pages/staff/StaffPage';
import InvoicesPage from '../../pages/invoices/InvoicesPage';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: 'branches',
                        element: (
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <BranchesPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: 'staff',
                        element: (
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <StaffPage />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: 'invoices',
                        element: <InvoicesPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
