import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Navigate to login page after logout
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-xl">
                <div className="text-2xl font-bold text-blue-400 mb-10">HRMS Admin</div>
                <nav className="flex-grow space-y-2">
                    <NavItem
                        to="/admin/dashboard"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                        text="Dashboard"
                    />
                    <NavItem
                        to="/admin/employees"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                        text="Employees"
                    />
                    <NavItem
                        to="/admin/leaves"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                        text="Leave Requests"
                    />
                    <NavItem
                        to="/admin/salary-structures"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-archive"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>}
                        text="Salary Structures"
                    />
                    <NavItem
                        to="/admin/payroll"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                        text="Payroll"
                    />
                </nav>
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-lg font-semibold text-gray-200 hover:bg-red-600 rounded-xl transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-xl"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area - This is where the child routes will be rendered */}
            <main className="flex-1 p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

// NavItem component now uses NavLink for active styling based on URL
const NavItem = ({ to, icon, text }) => {
    const baseClasses = "flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow-lg";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700";

    return (
        <NavLink
            to={to}
            // The `end` prop is important for the dashboard link to not stay active on child routes
            end={to === "/admin/dashboard"}
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            <span className="mr-3 text-xl">{icon}</span>
            {text}
        </NavLink>
    );
};

export default AdminLayout;
