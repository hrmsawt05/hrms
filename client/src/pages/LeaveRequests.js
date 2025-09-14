import React, { useState, useEffect } from 'react';
import { getLeaveRequests, updateLeaveRequestStatus, deleteLeaveRequest } from '../api/adminService';
import { formatDate } from '../utils/dateUtils';
import { CheckCircle, XCircle, Trash2, AlertTriangle } from 'lucide-react';

// --- Modal Component ---
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeInUp">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            {children}
        </div>
    </div>
);


const LeaveRequests = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filter, setFilter] = useState('pending'); // Default filter
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- State for Modals ---
    const [requestToProcess, setRequestToProcess] = useState(null); // For approve/reject
    const [requestToDelete, setRequestToDelete] = useState(null); // For delete confirmation
    const [rejectedReason, setRejectedReason] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getLeaveRequests();
            setAllRequests(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch leave requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // This effect runs whenever the main list or the filter changes
        const filtered = allRequests.filter(req => req.status === filter);
        setFilteredRequests(filtered);
    }, [allRequests, filter]);

    const handleUpdateStatus = async (status) => {
        if (!requestToProcess) return;

        try {
            const statusData = { status };
            if (status === 'rejected') {
                statusData.rejectedReason = rejectedReason || 'No reason provided.';
            }

            await updateLeaveRequestStatus(requestToProcess._id, statusData);
            setRequestToProcess(null);
            setRejectedReason('');
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err.message || `Failed to ${status} request.`);
        }
    };

    const handleDelete = async () => {
        if (!requestToDelete) return;
        try {
            await deleteLeaveRequest(requestToDelete._id);
            setRequestToDelete(null);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err.message || 'Failed to delete request.');
        }
    };

    const FilterButton = ({ value, label }) => (
        <button
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === value 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
            {label}
        </button>
    );

    if (loading) return <div>Loading requests...</div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Leave Approvals</h2>

            <div className="flex space-x-4 mb-6">
                <FilterButton value="pending" label="Pending" />
                <FilterButton value="approved" label="Approved" />
                <FilterButton value="rejected" label="Rejected" />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.length > 0 ? filteredRequests.map(req => (
                            <tr key={req._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.employeeId?.firstName || 'N/A'} {req.employeeId?.lastName || ''}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.leaveType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(req.fromDate)} - {formatDate(req.toDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.numberOfDays}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {filter === 'pending' && (
                                        <>
                                            <button onClick={() => setRequestToProcess(req)} className="text-green-600 hover:text-green-900"><CheckCircle size={20} /></button>
                                            <button onClick={() => setRequestToDelete(req)} className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">No {filter} requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Approve/Reject Modal */}
            {requestToProcess && (
                <Modal onClose={() => setRequestToProcess(null)}>
                    <h3 className="text-2xl font-bold mb-4">Process Leave Request</h3>
                    <p className="mb-4">Are you sure you want to approve this request? To reject, please provide a reason.</p>
                    <textarea 
                        value={rejectedReason}
                        onChange={(e) => setRejectedReason(e.target.value)}
                        placeholder="Optional: Reason for rejection..."
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <div className="flex justify-end space-x-4">
                        <button onClick={() => handleUpdateStatus('rejected')} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Reject</button>
                        <button onClick={() => handleUpdateStatus('approved')} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Approve</button>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {requestToDelete && (
                <Modal onClose={() => setRequestToDelete(null)}>
                     <div className="text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <h3 className="text-2xl font-bold mt-4">Delete Request</h3>
                        <p className="text-gray-600 mt-2">Are you sure you want to delete this leave request? This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button onClick={() => setRequestToDelete(null)} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default LeaveRequests;
