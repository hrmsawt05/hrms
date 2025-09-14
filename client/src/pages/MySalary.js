import React, { useState, useEffect } from 'react';
import { getMySalaryRecords } from '../api/employeeService';
import { useAuth } from '../context/AuthContext';
import { DollarSign } from 'lucide-react'; 

const MySalary = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await getMySalaryRecords();
                setRecords(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch salary records.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    if (loading) return <div>Loading your salary history...</div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Payslips</h2>
            
            {records.length > 0 ? (
                <div className="space-y-8">
                    {records.map(rec => (
                        <Payslip key={rec._id} record={rec} user={user} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                    <DollarSign size={48} className="mx-auto text-gray-400" />
                    <p className="mt-4">No salary records have been generated for you yet.</p>
                </div>
            )}
        </div>
    );
};


// --- Payslip Component for a professional look ---
const Payslip = ({ record, user }) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const earnings = record.basePay + record.hra + record.incentives;
    const totalDeductions = record.insurance + record.deductions;

    // Helper to format numbers as Indian Rupees
    const formatToINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">Payslip for {monthNames[record.month - 1]} {record.year}</h3>
                <p className="text-sm text-gray-500">Generated on: {new Date(record.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Faculty Name</p>
                        
                        <p className="font-semibold">{`${user?.firstName || ''} ${user?.lastName || ''}`}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-semibold">{user?.position}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Days in Month</p>
                        <p className="font-semibold">{record.daysInMonth}</p>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-center">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">Present</p>
                        <p className="font-bold text-2xl text-green-800">{record.daysPresent}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">On Leave (Paid)</p>
                        <p className="font-bold text-2xl text-blue-800">{record.daysOnLeave}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-700">Absent (Unpaid)</p>
                        <p className="font-bold text-2xl text-red-800">{record.daysAbsent}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* --- Earnings Side --- */}
                    <div>
                        <h4 className="font-bold text-lg text-gray-700 mb-2 border-b pb-2">Earnings</h4>
                        <div className="space-y-2 text-sm">
                            
                            <div className="flex justify-between"><span>Base Pay:</span> <span>{formatToINR(record.basePay)}</span></div>
                            <div className="flex justify-between"><span>HRA:</span> <span>{formatToINR(record.hra)}</span></div>
                            <div className="flex justify-between"><span>Incentives:</span> <span>{formatToINR(record.incentives)}</span></div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Earnings:</span> <span>{formatToINR(earnings)}</span></div>
                        </div>
                    </div>
                    {/* --- Deductions Side --- */}
                    <div>
                        <h4 className="font-bold text-lg text-gray-700 mb-2 border-b pb-2">Deductions</h4>
                        <div className="space-y-2 text-sm">
                             
                            <div className="flex justify-between"><span>Insurance:</span> <span>{formatToINR(record.insurance)}</span></div>
                            <div className="flex justify-between"><span>Unpaid Absences:</span> <span className="text-red-600">-{formatToINR(record.deductions)}</span></div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Deductions:</span> <span>-{formatToINR(totalDeductions)}</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mt-6 text-center">
                    <p className="text-lg font-bold text-gray-800">Net Salary Paid</p>
                     
                    <p className="text-3xl font-extrabold text-green-600">{formatToINR(record.netSalary)}</p>
                </div>
            </div>
        </div>
    );
};

export default MySalary;

