import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    getSalaryStructures, 
    createSalaryStructure, 
    updateSalaryStructure, 
    deleteSalaryStructure,
    getDepartments,
    getAllUsers // ⭐ 1. Import the function to get all users
} from '../api/adminService';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeInUp">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            {children}
        </div>
    </div>
);

// --- Main Page Component ---
const SalaryStructurePage = () => {
    const [structures, setStructures] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]); // ⭐ 2. Add state to hold the list of users
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStructure, setCurrentStructure] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // ⭐ 3. Fetch users along with structures and departments
            const [structuresData, departmentsData, usersData] = await Promise.all([
                getSalaryStructures(),
                getDepartments(),
                getAllUsers()
            ]);
            setStructures(structuresData);
            setDepartments(departmentsData);
            setUsers(usersData); // ⭐ 4. Save the users to state
        } catch (err) {
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ⭐ 5. Create a dynamic list of unique positions from the user data
    const positionOptions = useMemo(() => {
        if (!users) return [];
        const allPositions = users.map(user => user.position);
        // Use a Set to get unique values, then convert back to an array and sort
        return [...new Set(allPositions)].sort();
    }, [users]);

    const handleOpenModal = (structure = null) => {
        setCurrentStructure(structure);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentStructure(null);
    };

    const handleDelete = async (id) => {
        try {
            await deleteSalaryStructure(id);
            setItemToDelete(null);
            fetchData(); 
        } catch (err) {
            setError(err.message || 'Failed to delete structure.');
        }
    };

    if (loading) return <div className="text-center p-4">Loading salary structures...</div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Salary Structures</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" /> Add New Structure
                </button>
            </div>
            
            <SalaryStructureTable 
                structures={structures}
                onEdit={handleOpenModal}
                onDelete={(structure) => setItemToDelete(structure)}
            />

            {isModalOpen && (
                <SalaryStructureFormModal
                    structure={currentStructure}
                    departments={departments}
                    positionOptions={positionOptions} // ⭐ 6. Pass the dynamic positions to the modal
                    onClose={handleCloseModal}
                    onSave={fetchData}
                />
            )}

            {itemToDelete && (
                <Modal onClose={() => setItemToDelete(null)}>
                     <div className="text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <h3 className="text-2xl font-bold mt-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mt-2">Are you sure you want to delete the structure for <span className="font-semibold">{itemToDelete.position}</span>? This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button onClick={() => setItemToDelete(null)} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Cancel</button>
                            <button onClick={() => handleDelete(itemToDelete._id)} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};


// --- Sub-Components ---
const SalaryStructureTable = ({ structures, onEdit, onDelete }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position & Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HRA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        {/* THE FIX: Changed to Indian Rupee format */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{s.basePay.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{s.hra.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{s.insurance.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button onClick={() => onEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit"><Edit size={18} /></button>
                            <button onClick={() => onDelete(s)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 size={18} /></button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="6" className="text-center py-10 text-gray-500">No salary structures found. Add one to get started.</td></tr>
                )}
            </tbody>
        </table>
    </div>
);

// ⭐ 7. The modal now accepts 'positionOptions' as a prop
const SalaryStructureFormModal = ({ structure, departments, positionOptions, onClose, onSave }) => {
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
        <Modal onClose={onClose}>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{structure ? 'Edit' : 'Add New'} Salary Structure</h3>
            {formError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 8. The dropdown now uses the dynamic 'positionOptions' prop */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <select name="position" value={formData.position} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="">-- Select a Position --</option>
                        {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="employee">Faculty/Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="">-- Select a Department --</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        {/* THE FIX: Changed to Indian Rupee format */}
                        <label className="block text-sm font-medium text-gray-700">Base Pay (₹)</label>
                        <input type="number" name="basePay" value={formData.basePay} onChange={handleChange} placeholder="e.g., 60000" required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        {/* THE FIX: Changed to Indian Rupee format */}
                        <label className="block text-sm font-medium text-gray-700">HRA (₹)</label>
                        <input type="number" name="hra" value={formData.hra} onChange={handleChange} placeholder="e.g., 12000" required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        {/* THE FIX: Changed to Indian Rupee format */}
                        <label className="block text-sm font-medium text-gray-700">Insurance (₹)</label>
                        <input type="number" name="insurance" value={formData.insurance} onChange={handleChange} placeholder="e.g., 3000" required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'Saving...' : 'Save Structure'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SalaryStructurePage;

