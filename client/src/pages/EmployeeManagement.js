import React, { useState, useEffect } from 'react';

// Assuming you have a mock auth token and departments for testing purposes
const mockAuthToken = "mock-jwt-token-for-admin";
const mockDepartments = [
  { _id: '60c72b2f9b1d8e001c8e4d3a', departmentName: 'Engineering' },
  { _id: '60c72b2f9b1d8e001c8e4d3b', departmentName: 'Human Resources' },
  { _id: '60c72b2f9b1d8e001c8e4d3c', departmentName: 'Marketing' },
  { _id: '60c72b2f9b1d8e001c8e4d3d', departmentName: 'Sales' },
];
const mockRoles = ['admin', 'employee'];

// Main App component for demonstration
function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <EmployeeManagement />
    </div>
  );
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    departmentId: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 1. Fetch all employees from the backend
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${mockAuthToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      } else {
        throw new Error(data.message || 'Failed to fetch employees.');
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
    fetchEmployees();
  }, []);

  // 2. Handle form submission to create a new employee
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAuthToken}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Employee created successfully!');
        setIsError(false);
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'employee',
          departmentId: '',
        }); // Clear form
        fetchEmployees(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to create employee.');
      }
    } catch (error) {
      console.error('Create error:', error);
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle deletion of an employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${mockAuthToken}`,
        },
      });

      if (response.ok) {
        setMessage('Employee deleted successfully!');
        setIsError(false);
        fetchEmployees(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete employee.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Employee Management</h1>
      
      {/* Message Box */}
      {message && (
        <div className={`p-4 mb-6 rounded-xl font-semibold text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Form to Create New Employee */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Employee</h2>
        <form onSubmit={handleCreate} className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              {mockRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Department</option>
              {mockDepartments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>

      {/* Table to Display Existing Employees */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Employees</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading employees...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{employee.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mockDepartments.find(d => d._id === employee.departmentId)?.departmentName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          <span className="ml-1">Delete</span>
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
