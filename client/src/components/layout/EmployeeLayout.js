import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Using lucide-react for consistent and clean icons
import { LayoutDashboard, User, Calendar, DollarSign, LogOut, ClipboardList, Landmark } from 'lucide-react';

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
                <div className="text-2xl font-bold text-teal-400 mb-10">Faculty Portal</div>
                <nav className="flex-grow space-y-2">
                    {/*  Dashboard link that points to the index route */}
                    <NavItem to="/employee" icon={<LayoutDashboard size={22} />} text="Dashboard" isEnd={true} />
                    <NavItem to="profile" icon={<User size={22} />} text="My Profile" />
                    <NavItem to="leaves" icon={<Calendar size={22} />} text="My Leave" />
                    {/*  My Attendance link */}
                    <NavItem to="attendance" icon={<ClipboardList size={22} />} text="My Attendance" />
                    <NavItem to="salary" icon={<Landmark size={22} />} text="My Salary" />
                </nav>
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-lg font-semibold text-gray-300 hover:bg-red-600 rounded-xl transition-colors duration-200"
                    >
                        <LogOut className="mr-3" />
                        <span className="ml-1">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-10 overflow-y-auto">
                {/* The Outlet will render the current child route's component */}
                <div className="bg-white rounded-2xl shadow-xl p-8 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// NavItem component for the sidebar links using NavLink
const NavItem = ({ to, icon, text, isEnd = false }) => {
    const activeClasses = "bg-teal-600 text-white shadow-lg";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700";

    return (
        <NavLink
            to={to}
            end={isEnd} // The `end` prop ensures the Dashboard link isn't always active
            className={({ isActive }) => 
                `flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`
            }
        >
            <span className="mr-3">{icon}</span>
            {text}
        </NavLink>
    );
};

export default EmployeeLayout;

