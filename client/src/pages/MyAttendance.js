import React, { useState, useEffect } from 'react';
import { getMyAttendanceRecords } from '../api/employeeService';
import { formatDate } from '../utils/dateUtils';

// Helper function to format time from a date string
const formatTime = (dateString) => {
    if (!dateString) return 'null';
    // Using en-IN locale for Indian time format if needed, or en-US for AM/PM
    return new Date(dateString).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
};

const MyAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await getMyAttendanceRecords();
                setRecords(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch attendance records.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            case 'half-day':
                return 'bg-yellow-100 text-yellow-800';
            case 'on-leave':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center p-4">Loading your attendance history...</div>;
    if (error) return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Attendance History</h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            {/* ⭐ 1. ADDED NEW COLUMNS */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.length > 0 ? records.map(record => (
                            <tr key={record._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(record.date)}</td>
                                {/* ⭐ 2. DISPLAYING THE NEW DATA */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.loginTime)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.logoutTime)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.notes || '-'}</td>
                            </tr>
                        )) : (
                            <tr>
                                {/*  UPDATED COLSPAN */}
                                <td colSpan="5" className="text-center py-10 text-gray-500">No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAttendance;

