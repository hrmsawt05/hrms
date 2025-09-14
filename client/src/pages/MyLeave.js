import React, { useState, useEffect } from 'react';
import { getMyLeaveRequests, createLeaveRequest } from '../api/employeeService';
import { formatDate } from '../utils/dateUtils';
import { Plus } from 'lucide-react';

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeInUp">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            {children}
        </div>
    </div>
);

// --- Main "My Leave" Component ---
const MyLeave = () => {
    // --- State Management ---
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for the new leave application form
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Data Fetching ---
    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const data = await getMyLeaveRequests();
            setLeaveRequests(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch leave requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    // --- Event Handlers ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        // Simple form validation
        if (!fromDate || !toDate || !reason.trim()) {
            setFormError('All fields are required.');
            setIsSubmitting(false);
            return;
        }
        if (new Date(fromDate) > new Date(toDate)) {
            setFormError('The "from" date cannot be after the "to" date.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Call the API to create the new leave request
            await createLeaveRequest({ leaveType, fromDate, toDate, reason });
            
            // Close modal and reset the form
            setIsModalOpen(false);
            setLeaveType('Casual Leave');
            setFromDate('');
            setToDate('');
            setReason('');
            
            // Refresh the list to show the new request
            await fetchLeaveRequests();

        } catch (err) {
            setFormError(err.message || 'Failed to submit leave request.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Render Logic ---
    if (loading) return <div className="text-center p-4">Loading your leave history...</div>;
    if (error) return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">My Leave Applications</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" /> Apply for Leave
                </button>
            </div>
            
            {/* Leave History Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                         <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                         </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                         {leaveRequests.length > 0 ? leaveRequests.map(req => (
                             <tr key={req._id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.leaveType}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(req.fromDate)}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(req.toDate)}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                         req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                         req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                         'bg-yellow-100 text-yellow-800'
                                     }`}>
                                         {req.status}
                                     </span>
                                 </td>
                             </tr>
                         )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-500">You have not submitted any leave requests yet.</td>
                            </tr>
                         )}
                     </tbody>
                 </table>
             </div>

            {/* Modal for new leave request */}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">New Leave Application</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                            <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>Casual Leave</option>
                                <option>Sick Leave</option>
                                <option>Earned Leave</option>
                                <option>Conference</option>
                                <option>Exam Duty</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">From Date</label>
                                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">To Date</label>
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reason for Leave</label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Please provide a brief reason for your leave..."
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        
                        {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{formError}</p>}
                        
                        <div className="pt-4">
                             <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-300"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default MyLeave;

