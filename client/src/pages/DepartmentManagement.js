import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/adminService';
import { PlusCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeInUp">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            {children}
        </div>
    </div>
);

// --- Main Department Management Component ---
const DepartmentManagement = () => {
    // --- State Management ---
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null); // Holds department data for editing
    const [departmentToDelete, setDepartmentToDelete] = useState(null); // Holds department for delete confirmation
    const [formData, setFormData] = useState({ departmentName: '', location: '' });

    // --- Data Fetching ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getDepartments();
            setDepartments(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch departments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Event Handlers ---
    const handleOpenModal = (department = null) => {
        setEditingDepartment(department);
        setFormData(department ? { departmentName: department.departmentName, location: department.location } : { departmentName: '', location: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDepartment(null);
        setFormData({ departmentName: '', location: '' });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingDepartment) {
                // Update existing department
                await updateDepartment(editingDepartment._id, formData);
            } else {
                // Create new department
                await createDepartment(formData);
            }
            handleCloseModal();
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err.message || 'Failed to save department.');
        }
    };

    const handleDelete = async () => {
        if (!departmentToDelete) return;
        try {
            await deleteDepartment(departmentToDelete._id);
            setDepartmentToDelete(null);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err.message || 'Failed to delete department.');
        }
    };

    // --- Render Logic ---
    if (loading) return <div>Loading departments...</div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Department Management</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add Department
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {departments.map((dept) => (
                            <tr key={dept._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.departmentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.location || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => handleOpenModal(dept)} className="text-indigo-600 hover:text-indigo-900" title="Edit"><Edit size={20} /></button>
                                    <button onClick={() => setDepartmentToDelete(dept)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <h3 className="text-2xl font-bold mb-6">{editingDepartment ? 'Edit Department' : 'Add New Department'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department Name</label>
                            <input
                                type="text"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleFormChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleFormChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {departmentToDelete && (
                <Modal onClose={() => setDepartmentToDelete(null)}>
                    <div className="text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <h3 className="text-2xl font-bold mt-4">Delete Department</h3>
                        <p className="text-gray-600 mt-2">Are you sure you want to delete the "{departmentToDelete.departmentName}" department? This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button onClick={() => setDepartmentToDelete(null)} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DepartmentManagement;

