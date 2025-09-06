import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, getDepartments } from '../api/adminService';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{title}</h3>
                {children}
            </div>
        </div>
    );
};


const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for the new employee form
    const [newEmployee, setNewEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        department: '',
        position: '',
        role: 'employee',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');


    const fetchEmployeesAndDepartments = async () => {
        try {
            setLoading(true);
            const [usersData, deptsData] = await Promise.all([
                getAllUsers(),
                getDepartments()
            ]);
            setEmployees(usersData);
            setDepartments(deptsData);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesAndDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            await createUser(newEmployee);
            setIsModalOpen(false); // Close modal on success
            setNewEmployee({ // Reset form
                firstName: '', lastName: '', email: '', password: '', department: '', position: '', role: 'employee'
            });
            fetchEmployeesAndDepartments(); // Refresh the employee list
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center text-gray-500">Loading employees...</div>;
        }
        if (error) {
            return <div className="text-center text-red-500 bg-red-100 p-4 rounded-xl">Error: {error}</div>;
        }
        if (employees.length === 0) {
            return <div className="text-center text-gray-500">No employees found. Add one to get started!</div>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {employees.map((employee) => (
                            <tr key={employee._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{employee.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };


    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800">Employee Management</h1>
                    <p className="text-gray-500 mt-2">View, add, and manage your company's employees.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300">
                    + Add Employee
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-xl p-8">
                {renderContent()}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    {formError && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{formError}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="firstName" placeholder="First Name" value={newEmployee.firstName} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                        <input type="text" name="lastName" placeholder="Last Name" value={newEmployee.lastName} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                    </div>
                    <input type="email" name="email" placeholder="Email Address" value={newEmployee.email} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                    <input type="password" name="password" placeholder="Password" value={newEmployee.password} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                    <input type="text" name="position" placeholder="Position (e.g., Senior Developer)" value={newEmployee.position} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required />
                    <select name="department" value={newEmployee.department} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required>
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
                        ))}
                    </select>
                     <select name="role" value={newEmployee.role} onChange={handleInputChange} className="w-full p-3 border rounded-lg" required>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="mr-4 px-6 py-2 text-gray-700">Cancel</button>
                        <button type="submit" disabled={formLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {formLoading ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;
