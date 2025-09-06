import React, { useState, useEffect, useCallback } from 'react';
import { 
    getAllSalaryRecords, 
    createSalaryRecord,
    getAllUsers 
} from '../api/adminService';
import { format } from 'date-fns';

// --- Icon & UI Components ---
const LoadingSpinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;


const PayrollManagement = () => {
    const [salaryRecords, setSalaryRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [recordsData, employeesData] = await Promise.all([
                getAllSalaryRecords(),
                getAllUsers()
            ]);
            const sortedRecords = recordsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSalaryRecords(sortedRecords);
            setEmployees(employeesData);
        } catch (err) {
            setError(err.message || 'Failed to fetch payroll data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Payroll Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                >
                    + Generate Salary
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <PayrollHistoryTable records={salaryRecords} />
            )}

            {isModalOpen && (
                <GenerateSalaryModal
                    employees={employees}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchData} // Refetch data after generating
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const PayrollHistoryTable = ({ records }) => (
    <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Payroll History</h3>
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculated On</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {records.length > 0 ? records.map(rec => (
                    <tr key={rec._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{rec.employeeId?.fullName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{rec.employeeId?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{format(new Date(rec.year, rec.month - 1), 'MMMM yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">${rec.netSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(rec.calculatedDate), 'MMM d, yyyy')}</td>
                    </tr>
                )) : (
                    <tr><td colSpan="4" className="text-center py-4 text-gray-500">No salary records found.</td></tr>
                )}
            </tbody>
        </table>
    </div>
);

const GenerateSalaryModal = ({ employees, onClose, onSave }) => {
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({
        employeeId: '',
        month: new Date().getMonth() + 1, // Default to current month
        year: currentYear,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormMessage({ type: '', text: '' });
        try {
            await createSalaryRecord(formData);
            setFormMessage({ type: 'success', text: 'Salary record generated successfully!' });
            setTimeout(() => {
                onSave();
                onClose();
            }, 1500);
        } catch (err) {
            setFormMessage({ type: 'error', text: err.message || 'Failed to generate salary.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Create a list of months for the dropdown
    const months = Array.from({length: 12}, (e, i) => new Date(null, i + 1, null).toLocaleDateString("en", {month: "long"}));
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h3 className="text-xl font-bold mb-6">Generate New Salary Record</h3>
                {formMessage.text && (
                    <div className={`flex items-center p-3 rounded-lg mb-4 ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {formMessage.type === 'success' ? <CheckCircleIcon /> : <XCircleIcon />}
                        <span>{formMessage.text}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                        <select name="employeeId" value={formData.employeeId} onChange={handleChange} required className="w-full p-2 border rounded">
                            <option value="">Select an Employee</option>
                            {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.fullName} ({emp.position})</option>)}
                        </select>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select name="month" value={formData.month} onChange={handleChange} required className="w-full p-2 border rounded">
                                {months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full p-2 border rounded" min={currentYear - 5} max={currentYear + 5} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300">
                            {isSubmitting ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PayrollManagement;
