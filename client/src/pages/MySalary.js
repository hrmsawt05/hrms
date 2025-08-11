import React, { useState, useEffect } from 'react';

// Assuming mock data for demonstration purposes
const mockAuthToken = "mock-jwt-token-for-employee";
const mockUserId = "emp1"; // This would come from the logged-in user object

// Main App component for demonstration
function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <MySalary />
    </div>
  );
}

const MySalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 1. Fetch the logged-in employee's salary history
  const fetchMySalaries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/salaries/employee/${mockUserId}`, {
        headers: {
          'Authorization': `Bearer ${mockAuthToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSalaries(data);
      } else {
        throw new Error(data.message || 'Failed to fetch salary records.');
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
    fetchMySalaries();
  }, []);

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">My Salary</h1>
      
      {/* Message Box */}
      {message && (
        <div className={`p-4 mb-6 rounded-xl font-semibold text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Table to Display Salary History */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary History</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading salary records...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Pay</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                      No salary records found.
                    </td>
                  </tr>
                ) : (
                  salaries.map((salary) => (
                    <tr key={salary._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{salary.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{salary.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${salary.basePay}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${salary.netSalary}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(salary.createdAt).toLocaleDateString()}
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
