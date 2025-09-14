import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, getAllSalaryRecords, createSalaryRecord } from '../api/adminService';
import { DollarSign, Search, User, Calendar, Award } from 'lucide-react';

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeInUp">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            {children}
        </div>
    </div>
);


const PayrollManagement = () => {
    const [allRecords, setAllRecords] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // --- Form State ---
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [incentives, setIncentives] = useState(0);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, recordsData] = await Promise.all([ getAllUsers(), getAllSalaryRecords() ]);
            setAllUsers(usersData);
            setAllRecords(recordsData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredRecords = useMemo(() => {
        if (!searchTerm) return allRecords;
        return allRecords.filter(record => {
            // ⭐ FIX: Use the fullName property which is sent from the backend
            const fullName = record.employeeId?.fullName || '';
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [allRecords, searchTerm]);

    const handleGenerateSalary = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);
        if (!selectedEmployee || !month || !year) {
            setFormError('Please select an employee, month, and year.');
            setIsSubmitting(false);
            return;
        }
        try {
            await createSalaryRecord({ employeeId: selectedEmployee, month, year, incentives: Number(incentives) });
            setIsModalOpen(false);
            setSelectedEmployee('');
            setIncentives(0);
            await fetchData();
        } catch (err) {
            setFormError(err.message || 'Failed to generate salary.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading payroll data...</div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Payroll Management</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:scale-105">
                    <DollarSign size={20} className="mr-2" /> Generate Salary
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search by faculty name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month/Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status (P/L/A)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRecords.length > 0 ? filteredRecords.map((rec, index) => (
                            <tr key={rec._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</td>
                                {/* ⭐ FIX: Use the fullName property */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rec.employeeId?.fullName || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.employeeId?.employeeIdString || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.month}/{rec.year}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="text-green-600 font-semibold">{rec.daysPresent}</span> / <span className="text-blue-600 font-semibold">{rec.daysOnLeave}</span> / <span className="text-red-600 font-semibold">{rec.daysAbsent}</span>
                                </td>
                                {/* ⭐ FIX: Changed to Indian Rupee format */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">₹{rec.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">₹{rec.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        )) : (
                             <tr><td colSpan="7" className="text-center py-10 text-gray-500">{searchTerm ? 'No records match your search.' : 'No salary records generated yet.'}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Generate New Salary Record</h3>
                    <form onSubmit={handleGenerateSalary} className="space-y-4">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1"><User size={16} className="mr-2" />Faculty/Staff Member</label>
                            <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md">
                                <option value="">-- Select an Employee --</option>
                                {/* ⭐ FIX: Construct the full name for the dropdown options from firstName and lastName */}
                                {allUsers.map(user => (<option key={user._id} value={user._id}>{`${user.firstName} ${user.lastName}`}</option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1"><Calendar size={16} className="mr-2" />Month</label>
                                <input type="number" value={month} onChange={e => setMonth(e.target.value)} min="1" max="12" className="w-full p-3 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1"><Calendar size={16} className="mr-2" />Year</label>
                                <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2020" className="w-full p-3 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                         <div>
                            {/* ⭐ FIX: Changed label to Indian Rupee format */}
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1"><Award size={16} className="mr-2" />Incentives (₹)</label>
                            <input type="number" value={incentives} onChange={e => setIncentives(e.target.value)} min="0" className="w-full p-3 border border-gray-300 rounded-md" />
                        </div>
                        {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{formError}</p>}
                        <div className="pt-4">
                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-300">{isSubmitting ? 'Calculating & Generating...' : 'Generate and Save Record'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default PayrollManagement;

