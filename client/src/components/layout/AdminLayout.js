import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Using lucide-react for consistent and clean icons
import { Home, Users, Calendar, Layers, DollarSign, LogOut, Building, ClipboardList, Landmark } from 'lucide-react';

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
                <div className="text-2xl font-bold text-blue-400 mb-10">Admin Portal</div>
                <nav className="flex-grow space-y-2">
                    <NavItem to="/admin" icon={<Home />} text="Dashboard" isEnd />
                    <NavItem to="/admin/employees" icon={<Users />} text="Faculty & Staff" />
                    <NavItem to="/admin/departments" icon={<Building />} text="Departments" />
                    <NavItem to="/admin/leaves" icon={<Calendar />} text="Leave Approvals" />
                    <NavItem to="/admin/attendance" icon={<ClipboardList />} text="Attendance Logs" />
                    <NavItem to="/admin/salary-structures" icon={<Layers />} text="Salary Structures" />
                    <NavItem to="/admin/payroll" icon={<Landmark />} text="Payroll" />
                </nav>
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-lg font-semibold text-gray-200 hover:bg-red-600 rounded-xl transition-colors duration-200"
                    >
                        <LogOut className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area - This is where the child routes will be rendered */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// NavItem component now uses NavLink for active styling based on URL
const NavItem = ({ to, icon, text, isEnd = false }) => {
    const baseClasses = "flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow-lg";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700";

    return (
        <NavLink
            to={to}
            // The `end` prop is important for the dashboard link to not stay active on child routes
            end={isEnd}
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            <span className="mr-3">{icon}</span>
            {text}
        </NavLink>
    );
};

export default AdminLayout;

