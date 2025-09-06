import React from 'react';
import { useAuth } from '../context/AuthContext';

// This component is now the main "welcome" screen for the admin.
const AdminDashboardPage = () => {
    const { user } = useAuth(); // Get user info from context

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    {/* Personalize the welcome message */}
                    Welcome, {user?.firstName || 'Admin'}!
                </h1>
                <p className="text-gray-500 mt-2">Here's a summary of your HRMS.</p>
            </header>

            {/* You can add dashboard summary widgets here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700">Total Employees</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">124</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700">Pending Leave Requests</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-lg text-gray-700">Issues to Address</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">3</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
