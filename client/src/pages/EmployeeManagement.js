import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, createUser, getDepartments, updateUser, deleteUser } from '../api/adminService';
import { PlusCircle, Edit, Trash2, X, AlertTriangle } from 'lucide-react';

// Main Component
const EmployeeManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [usersData, departmentsData] = await Promise.all([
                getAllUsers(),
                getDepartments()
            ]);
            setUsers(usersData);
            setDepartments(departmentsData);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (editingUser) {
                await updateUser(editingUser._id, userData);
            } else {
                await createUser(userData);
            }
            fetchData(); // Re-fetch data to show changes
            handleCloseModal();
        } catch (err) {
            alert(`Error: ${err.message}`); // Simple error feedback
        }
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete._id);
            setUserToDelete(null);
            fetchData();
        } catch (err) {
            alert(`Error: ${err.message}`);
            setUserToDelete(null);
        }
    };

    if (loading) return <div className="text-center p-8">Loading faculty and staff...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Faculty & Staff Management</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add New
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.employeeIdString}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department?.departmentName || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && (
                <UserFormModal
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    departments={departments}
                    editingUser={editingUser}
                />
            )}

            {userToDelete && (
                <ConfirmationModal
                    title="Delete User"
                    message={`Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setUserToDelete(null)}
                />
            )}
        </div>
    );
};

// --- Sub-components (Modal Forms) ---

const UserFormModal = ({ onClose, onSave, departments, editingUser }) => {
    const [formData, setFormData] = useState({
        firstName: editingUser?.firstName || '',
        lastName: editingUser?.lastName || '',
        employeeIdString: editingUser?.employeeIdString || '',
        email: editingUser?.email || '',
        position: editingUser?.position || '',
        department: editingUser?.department?._id || '',
        role: editingUser?.role || 'employee',
        password: '', // Password is only for new users
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For editing, we don't want to send an empty password
        const dataToSave = { ...formData };
        if (editingUser && !dataToSave.password) {
            delete dataToSave.password;
        }
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                        <InputField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                        <InputField name="employeeIdString" label="Employee ID" value={formData.employeeIdString} onChange={handleChange} required />
                        <InputField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
                        <InputField name="position" label="Position" value={formData.position} onChange={handleChange} required />
                        <SelectField name="department" label="Department" value={formData.department} onChange={handleChange} options={departments.map(d => ({ value: d._id, label: d.departmentName }))} required />
                        <SelectField name="role" label="Role" value={formData.role} onChange={handleChange} options={[{ value: 'employee', label: 'Employee' }, { value: 'admin', label: 'Admin' }]} required />
                        {!editingUser && (
                             <InputField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
                        )}
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper components for the form fields
const InputField = ({ name, label, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);

const SelectField = ({ name, label, value, onChange, options, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
            <option value="">Select {label}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

export default EmployeeManagement;

