import React, { useState, useEffect } from 'react';

// Main App component to render the SalaryStructureManagement component
function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <SalaryStructureManagement />
    </div>
  );
}

// Assume the user is an admin for this demo
const mockAuthToken = "mock-jwt-token-for-admin";
const mockDepartments = [
  { _id: '60c72b2f9b1d8e001c8e4d3a', departmentName: 'Engineering' },
  { _id: '60c72b2f9b1d8e001c8e4d3b', departmentName: 'Human Resources' },
  { _id: '60c72b2f9b1d8e001c8e4d3c', departmentName: 'Marketing' },
  { _id: '60c72b2f9b1d8e001c8e4d3d', departmentName: 'Sales' },
];

const SalaryStructureManagement = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    role: 'employee',
    position: '',
    department: '',
    basePay: 0,
    hra: 0,
    insurance: 0,
    incentives: 0,
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 1. Fetch all existing salary structures
  const fetchStructures = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/salary-structures', {
        headers: {
          'Authorization': `Bearer ${mockAuthToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStructures(data);
      } else {
        throw new Error(data.message || 'Failed to fetch structures.');
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
    fetchStructures();
  }, []);

  // 2. Handle form submission to create a new salary structure
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch('/api/salary-structures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAuthToken}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Salary structure created successfully!');
        setIsError(false);
        setForm({
          role: 'employee',
          position: '',
          department: '',
          basePay: 0,
          hra: 0,
          insurance: 0,
          incentives: 0,
        }); // Clear form
        fetchStructures(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to create structure.');
      }
    } catch (error) {
      console.error('Create error:', error);
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle deletion of a salary structure
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary structure?")) {
      return;
    }

    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`/api/salary-structures/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${mockAuthToken}`,
        },
      });

      if (response.ok) {
        setMessage('Salary structure deleted successfully!');
        setIsError(false);
        fetchStructures(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete structure.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Salary Structure Management</h1>
      
      {/* Message Box */}
      {message && (
        <div className={`p-4 mb-6 rounded-xl font-semibold text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Form to Create New Salary Structure */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Structure</h2>
        <form onSubmit={handleCreate} className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="e.g., Senior Developer"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Department</option>
              {mockDepartments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Pay</label>
            <input
              type="number"
              value={form.basePay}
              onChange={(e) => setForm({ ...form, basePay: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HRA</label>
            <input
              type="number"
              value={form.hra}
              onChange={(e) => setForm({ ...form, hra: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance</label>
            <input
              type="number"
              value={form.insurance}
              onChange={(e) => setForm({ ...form, insurance: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Structure'}
            </button>
          </div>
        </form>
      </div>

      {/* Table to Display Existing Salary Structures */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Structures</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading structures...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Pay</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HRA</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {structures.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                      No salary structures found.
                    </td>
                  </tr>
                ) : (
                  structures.map((structure) => (
                    <tr key={structure._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{structure.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{structure.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mockDepartments.find(d => d._id === structure.department)?.departmentName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${structure.basePay}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${structure.hra}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${structure.insurance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(structure._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
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
