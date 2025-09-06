// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import Login from './pages/Login.js';
import AdminDashboardPage from './pages/AdminDashboardPage.js';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage.js';

// This is a wrapper to protect routes that require authentication
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // If not logged in, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // If logged in but doesn't have the required role, redirect to a fallback page
        // For simplicity, we'll redirect them to their default dashboard
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
    }

    return children;
};


function AppContent() {
    const { user, isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboardPage />
                    </ProtectedRoute>
                }
            />
            {/* Add other admin routes here, e.g., /admin/manage-employees */}

            {/* Employee Routes */}
            <Route
                path="/employee/dashboard"
                element={
                    <ProtectedRoute requiredRole="employee">
                        <EmployeeDashboardPage />
                    </ProtectedRoute>
                }
            />
            {/* Add other employee routes here, e.g., /employee/my-profile */}


            {/* Redirect logic for the root path */}
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
             {/* Fallback for any other path */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

// Main App component now sets up the Provider and Router
function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
