import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Layouts
import AdminLayout from './components/layout/AdminLayout';
import EmployeeLayout from './components/layout/EmployeeLayout';

// Import Pages
import Login from './pages/Login.js';
// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage.js';
import EmployeeManagement from './pages/EmployeeManagement.js';
import LeaveRequests from './pages/LeaveRequests.js'; 
import SalaryStructurePage from './pages/SalaryStructurePage.js';
import PayrollManagement from './pages/PayrollManagement.js';
import DepartmentManagement from './pages/DepartmentManagement';
import AdminAttendanceViewer from './pages/AdminAttendanceViewer';

// Employee Pages
import EmployeeDashboardPage from './pages/EmployeeDashboardPage.js';
import MyProfile from './pages/MyProfile.js';
import MyLeave from './pages/MyLeave.js';
import MySalary from './pages/MySalary.js';
import MyAttendance from './pages/MyAttendance';

// This component protects routes
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (requiredRole && user.role !== requiredRole) {
        const fallbackPath = user.role === 'admin' ? '/admin' : '/employee';
        return <Navigate to={fallbackPath} replace />;
    }
    return children;
};

// This component contains the main routing logic
function AppContent() {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Loading application...</div>;

    return (
        <Routes>
            {/* ⭐ THE FIX: Wrapped the Login component in a centering container */}
            <Route 
                path="/login" 
                element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                        <Login />
                    </div>
                } 
            />

            {/* ADMIN ROUTES (Nested inside AdminLayout) */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="leaves" element={<LeaveRequests />} />
                <Route path="attendance" element={<AdminAttendanceViewer />} />
                <Route path="salary-structures" element={<SalaryStructurePage />} />
                <Route path="payroll" element={<PayrollManagement />} />
            </Route>

            {/* EMPLOYEE ROUTES (Nested inside EmployeeLayout) */}
            <Route path="/employee" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout /></ProtectedRoute>}>
                <Route index element={<EmployeeDashboardPage />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="leaves" element={<MyLeave />} />
                <Route path="attendance" element={<MyAttendance />} />
                <Route path="salary" element={<MySalary />} />
            </Route>

            {/* ROOT PATH REDIRECT LOGIC */}
            <Route path="/" element={isAuthenticated ? (<Navigate to={user.role === 'admin' ? '/admin' : '/employee'} replace />) : (<Navigate to="/login" replace />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

// The main App component that provides the AuthContext and Router
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

