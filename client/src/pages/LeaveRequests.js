import React, { useState, useEffect } from 'react';

// Assuming you have a mock auth token and user role for testing
const mockAuthToken = "mock-jwt-token-for-admin";

// Main App component for demonstration
function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <LeaveRequests />
    </div>
  );
}

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 1. Fetch all leave requests from the backend
  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leaves', {
        headers: {
          'Authorization': `Bearer ${mockAuthToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLeaves(data);
      } else {
        throw new Error(data.message || 'Failed to fetch leave requests.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // 2. Handle updating a leave request status (Approve/Reject)
  const handleUpdateStatus = async (id, status) => {
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAuthToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Leave request ${status} successfully!`);
        setIsError(false);
        fetchLeaveRequests(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to update leave status.');
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Leave Requests</h1>
      
      {/* Message Box */}
      {message && (
        <div className={`p-4 mb-6 rounded-xl font-semibold text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Table to Display Leave Requests */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Requests</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.employeeId.name || leave.employeeId.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{leave.leaveType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold capitalize">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                          leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {leave.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleUpdateStatus(leave._id, 'approved')}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block text-xl"><path d="M20 6 9 17l-5-5"/></svg>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block text-xl"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
