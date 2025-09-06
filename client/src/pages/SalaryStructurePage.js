import React, { useState, useEffect, useCallback } from 'react';
import { 
    getSalaryStructures, 
    createSalaryStructure, 
    updateSalaryStructure, 
    deleteSalaryStructure,
    getDepartments 
} from '../api/adminService';

// --- Icon Components ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const LoadingSpinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>;

const SalaryStructurePage = () => {
    const [structures, setStructures] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStructure, setCurrentStructure] = useState(null); // For editing

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [structuresData, departmentsData] = await Promise.all([
                getSalaryStructures(),
                getDepartments()
            ]);
            setStructures(structuresData);
            setDepartments(departmentsData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (structure = null) => {
        setCurrentStructure(structure);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentStructure(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this salary structure?')) {
            try {
                await deleteSalaryStructure(id);
                fetchData(); // Refetch data after delete
            } catch (err) {
                setError(err.message || 'Failed to delete structure.');
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Salary Structures</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    + Add New Structure
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <SalaryStructureTable 
                    structures={structures}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                />
            )}

            {isModalOpen && (
                <SalaryStructureFormModal
                    structure={currentStructure}
                    departments={departments}
                    onClose={handleCloseModal}
                    onSave={fetchData} // Refetch data after saving
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const SalaryStructureTable = ({ structures, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HRA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {structures.length > 0 ? structures.map(s => (
                    <tr key={s._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{s.position}</div>
                            <div className="text-sm text-gray-500 capitalize">{s.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.department?.departmentName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${s.basePay.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${s.hra.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${s.insurance.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button onClick={() => onEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit"><EditIcon /></button>
                            <button onClick={() => onDelete(s._id)} className="text-red-600 hover:text-red-900" title="Delete"><DeleteIcon /></button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="6" className="text-center py-4 text-gray-500">No salary structures found.</td></tr>
                )}
            </tbody>
        </table>
    </div>
);

const SalaryStructureFormModal = ({ structure, departments, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        position: structure?.position || '',
        role: structure?.role || 'employee',
        department: structure?.department?._id || '',
        basePay: structure?.basePay || '',
        hra: structure?.hra || '',
        insurance: structure?.insurance || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');

        try {
            if (structure) {
                await updateSalaryStructure(structure._id, formData);
            } else {
                await createSalaryStructure(formData);
            }
            onSave();
            onClose();
        } catch (err) {
            setFormError(err.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-6">{structure ? 'Edit' : 'Add New'} Salary Structure</h3>
                {formError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Fields */}
                    <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position (e.g., Senior Developer)" required className="w-full p-2 border rounded"/>
                    <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select name="department" value={formData.department} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
                    </select>
                    <input type="number" name="basePay" value={formData.basePay} onChange={handleChange} placeholder="Base Pay" required className="w-full p-2 border rounded"/>
                    <input type="number" name="hra" value={formData.hra} onChange={handleChange} placeholder="HRA" required className="w-full p-2 border rounded"/>
                    <input type="number" name="insurance" value={formData.insurance} onChange={handleChange} placeholder="Insurance" required className="w-full p-2 border rounded"/>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
                            {isSubmitting ? 'Saving...' : 'Save Structure'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SalaryStructurePage;
