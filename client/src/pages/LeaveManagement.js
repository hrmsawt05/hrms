import React, { useState, useEffect, useCallback } from 'react';
import { getLeaveRequests, updateLeaveRequestStatus } from '../api/adminService';
import { format } from 'date-fns';

// SVG Icon Components for better readability
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
);

const LeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'rejected'

    const fetchLeaveRequests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getLeaveRequests();
            // Sort by creation date, newest first
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLeaveRequests(sortedData);
        } catch (err) {
            setError(err.message || 'Failed to fetch leave requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaveRequests();
    }, [fetchLeaveRequests]);

    const handleUpdateRequest = async (id, status) => {
        // Find the specific request to update its state optimistically
        const requestToUpdate = leaveRequests.find(req => req._id === id);
        if (!requestToUpdate) return;
        
        const originalStatus = requestToUpdate.status;
        
        // Optimistic UI update
        const updatedRequests = leaveRequests.map(req => 
            req._id === id ? { ...req, status: status, processing: true } : req
        );
        setLeaveRequests(updatedRequests);

        try {
            const statusData = { status };
            // Add a rejectedReason if rejecting (could be a modal in a real app)
            if (status === 'rejected') {
                statusData.rejectedReason = 'Rejected by Admin';
            }
            await updateLeaveRequestStatus(id, statusData);
            // On success, refetch to get the latest data
            fetchLeaveRequests();
        } catch (err) {
            setError(err.message || `Failed to update status.`);
            // Revert on error
             const revertedRequests = leaveRequests.map(req => 
                req._id === id ? { ...req, status: originalStatus, processing: false } : req
            );
            setLeaveRequests(revertedRequests);
        }
    };
    
    const filteredRequests = leaveRequests.filter(req => req.status === filter);

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Management</h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            <div className="flex space-x-2 border-b mb-4">
                <TabButton text="Pending" active={filter === 'pending'} onClick={() => setFilter('pending')} />
                <TabButton text="Approved" active={filter === 'approved'} onClick={() => setFilter('approved')} />
                <TabButton text="Rejected" active={filter === 'rejected'} onClick={() => setFilter('rejected')} />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                                {filter === 'pending' && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.length > 0 ? filteredRequests.map(req => (
                                <tr key={req._id} className={req.processing ? 'opacity-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.employeeId?.fullName || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{req.employeeId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{req.leaveType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(req.fromDate), 'MMM d, yyyy')} - {format(new Date(req.toDate), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{req.totalDays}</td>
                                    {filter === 'pending' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button 
                                                onClick={() => handleUpdateRequest(req._id, 'approved')} 
                                                disabled={req.processing}
                                                className="text-green-600 hover:text-green-900 transition-colors duration-200 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Approve"
                                            >
                                                <CheckCircleIcon />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateRequest(req._id, 'rejected')} 
                                                disabled={req.processing}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Reject"
                                            >
                                                <XCircleIcon />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No {filter} leave requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ text, active, onClick }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none";
    const activeClasses = "bg-blue-500 text-white";
    const inactiveClasses = "text-gray-500 hover:bg-gray-100";

    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {text}
        </button>
    );
};

export default LeaveRequests;
