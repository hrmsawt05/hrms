import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, getAttendanceForEmployee } from '../api/adminService';
import { formatDate } from '../utils/dateUtils';

const AdminAttendanceViewer = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
            } catch (err) {
                setError('Failed to load faculty list.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = async (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);
        if (!userId) {
            setAttendanceRecords([]);
            return;
        }
        try {
            setLoadingRecords(true);
            setError('');
            const records = await getAttendanceForEmployee(userId);
            setAttendanceRecords(records);
        } catch (err) {
            setError(err.message || 'Failed to fetch attendance records.');
            setAttendanceRecords([]);
        } finally {
            setLoadingRecords(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'half-day': return 'bg-yellow-100 text-yellow-800';
            case 'on-leave': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center p-8">Loading faculty list...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">View Attendance Records</h2>
            
            <div className="mb-6 max-w-sm">
                <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Faculty or Staff Member
                </label>
                <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={handleUserChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">-- Please choose an employee --</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.fullName} ({user.employeeIdString})</option>
                    ))}
                </select>
            </div>

            {loadingRecords && <div className="text-center p-4">Loading records...</div>}
            {error && <div className="text-center p-4 text-red-500">{error}</div>}

            {selectedUserId && !loadingRecords && (
                <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendanceRecords.length > 0 ? (
                                attendanceRecords.map(record => (
                                    <tr key={record._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(record.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.notes || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No attendance records found for this user.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAttendanceViewer;
