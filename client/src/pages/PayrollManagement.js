import React, { useState, useEffect } from 'react';

// Assuming mock data for demonstration
const mockAuthToken = "mock-jwt-token-for-admin";
const mockEmployees = [
  { _id: 'emp1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
  { _id: 'emp2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
];

// Main App component for demonstration
function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <PayrollManagement />
    </div>
  );
}

const PayrollManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 1. Fetch all salary records
  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/salaries', {
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
    fetchSalaries();
  }, []);

  // 2. Handle form submission to create a new salary record
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch('/api/salaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAuthToken}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Salary record created successfully!');
        setIsError(false);
        setForm({ ...form, employeeId: '' }); // Reset employee dropdown
        fetchSalaries(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to create salary record.');
      }
    } catch (error) {
      console.error('Create error:', error);
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Payroll Management</h1>
      
      {/* Message Box */}
      {message && (
        <div className={`p-4 mb-6 rounded-xl font-semibold text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Form to Create New Salary Record */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Salary Record</h2>
        <form onSubmit={handleCreate} className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Employee</option>
              {mockEmployees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <input
              type="number"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              min="1"
              max="12"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              {loading ? 'Creating...' : 'Create Salary Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Table to Display Existing Salary Records */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Salary Records</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading records...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{salary.employeeId.firstName || 'N/A'} {salary.employeeId.lastName || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{salary.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{salary.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">${salary.netSalary}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(salary.createdAt).toLocaleDateString()}</td>
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
