import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Icon Components ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

const EmployeeLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-6 shadow-lg">
                <div className="text-2xl font-bold text-teal-400 mb-10">Employee Portal</div>
                <nav className="flex-grow space-y-2">
                    <NavItem to="/employee/profile" icon={<UserIcon />} text="My Profile" />
                    <NavItem to="/employee/leaves" icon={<CalendarIcon />} text="My Leave" />
                    <NavItem to="/employee/salary" icon={<DollarSignIcon />} text="My Salary" />
                </nav>
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-lg font-semibold text-gray-300 hover:bg-red-600 rounded-xl transition-colors duration-200"
                    >
                        <LogOutIcon />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Welcome, {user?.firstName || 'Employee'}!
                    </h1>
                    <p className="text-gray-500 mt-2">Here's your personal dashboard.</p>
                </header>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Child routes will be rendered here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// NavItem component for the sidebar links using NavLink
const NavItem = ({ to, icon, text }) => {
    const activeClasses = "bg-teal-600 text-white shadow-lg";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700";

    return (
        <NavLink
            to={to}
            className={({ isActive }) => 
                `flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`
            }
        >
            <span className="mr-3 text-xl">{icon}</span>
            {text}
        </NavLink>
    );
};

export default EmployeeLayout;
