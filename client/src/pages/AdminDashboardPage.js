import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getLeaveRequests } from '../api/adminService';
import { Users, Calendar, AlertTriangle } from 'lucide-react';

// This component is now a live dashboard for the admin.
const AdminDashboardPage = () => {
    const { user } = useAuth(); // Get user info from context
    const [stats, setStats] = useState({ employeeCount: 0, pendingLeaves: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all necessary data in parallel for efficiency
                const [usersData, leavesData] = await Promise.all([
                    getAllUsers(),
                    getLeaveRequests()
                ]);

                // Calculate the statistics
                const employeeCount = usersData.length;
                const pendingLeaves = leavesData.filter(leave => leave.status === 'pending').length;

                setStats({ employeeCount, pendingLeaves });

            } catch (err) {
                setError(err.message || 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Welcome, {user?.firstName || 'Admin'}!
                </h1>
                <p className="text-gray-500 mt-2">Here's a live summary of your Campus Portal.</p>
            </header>
            
            {loading ? (
                <p>Loading dashboard...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard 
                        title="Total Faculty & Staff" 
                        value={stats.employeeCount} 
                        icon={<Users className="text-blue-500" />} 
                        color="blue"
                    />
                    <DashboardCard 
                        title="Pending Leave Requests" 
                        value={stats.pendingLeaves} 
                        icon={<Calendar className="text-orange-500" />}
                        color="orange"
                    />
                    <DashboardCard 
                        title="Issues to Address" 
                        value={0} // Placeholder for future features
                        icon={<AlertTriangle className="text-red-500" />}
                        color="red"
                    />
                </div>
            )}
        </div>
    );
};

// A reusable component for the dashboard stat cards
const DashboardCard = ({ title, value, icon, color }) => {
    const colorVariants = {
        blue: 'border-blue-500',
        orange: 'border-orange-500',
        red: 'border-red-500'
    };

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${colorVariants[color]}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-700">{title}</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
