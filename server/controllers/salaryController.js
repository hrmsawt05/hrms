const Salary = require('../models/Salary');
const User = require('../models/User');
const SalaryStructure = require('../models/SalaryStructure');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// --- Helper to get the number of days in a given month and year ---
const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};


/**
 * @desc    Admin creates a new, calculated salary record for an employee
 * @route   POST /api/salaries
 * @access  Private/Admin
 */
const createSalaryRecord = async (req, res) => {
    try {
        const { employeeId, month, year, incentives = 0 } = req.body;

        // --- Step 1: Basic Validation & Setup ---
        const user = await User.findById(employeeId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingRecord = await Salary.findOne({ employeeId, month, year });
        if (existingRecord) return res.status(400).json({ message: `Salary for ${month}/${year} already exists for this user.` });

        const salaryStructure = await SalaryStructure.findOne({
            role: user.role,
            department: user.department,
            position: user.position,
        });
        if (!salaryStructure) return res.status(404).json({ message: `Salary structure not found for this user's role and position.` });

        // --- Step 2: Fetch Attendance and Leave Data for the Month ---
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: { $gte: startDate, $lt: endDate }
        });

        const leaveRecords = await Leave.find({
            employeeId,
            status: 'approved',
            fromDate: { $lt: endDate },
            toDate: { $gte: startDate }
        });

        // --- Step 3: The Intelligent Calculation ---
        const totalDaysInMonth = getDaysInMonth(year, month);
        const perDaySalary = salaryStructure.basePay / totalDaysInMonth;

        let daysPresent = 0;
        let daysOnLeave = 0;

        // Count present days from attendance
        attendanceRecords.forEach(record => {
            if (record.status === 'present' || record.status === 'half-day') {
                daysPresent++;
            }
        });

        // Count approved leave days within the month
        leaveRecords.forEach(leave => {
            for (let d = new Date(leave.fromDate); d <= leave.toDate; d.setDate(d.getDate() + 1)) {
                if (d.getUTCMonth() === month - 1 && d.getUTCFullYear() === year) {
                    daysOnLeave++;
                }
            }
        });

        // Calculate unpaid absences
        const paidDays = daysPresent + daysOnLeave;
        const daysAbsent = Math.max(0, totalDaysInMonth - paidDays);
        const deductions = daysAbsent * perDaySalary;

        // --- Step 4: Calculate Final Net Salary ---
        const { basePay, hra, insurance } = salaryStructure;
        const netSalary = (basePay - deductions) + hra + Number(incentives) - insurance;

        // --- Step 5: Create and Save the Record ---
        const newSalaryRecord = new Salary({
            employeeId, month, year, incentives: Number(incentives),
            basePay, hra, insurance,
            daysInMonth: totalDaysInMonth,
            daysPresent, daysOnLeave, daysAbsent,
            perDaySalary, deductions, netSalary,
        });

        await newSalaryRecord.save();

        res.status(201).json({
            message: 'Salary record calculated and created successfully',
            salary: newSalaryRecord,
        });

    } catch (err) {
        console.error('Create salary record error:', err);
        res.status(500).json({ message: 'Server error while creating salary record.' });
    }
};


// --- Read-Only Functions ---
const getAllSalaryRecords = async (req, res) => {
    try {
        const salaries = await Salary.find({}).populate('employeeId', 'fullName email').sort({ year: -1, month: -1 });
        res.status(200).json(salaries);
    } catch (err) {
        console.error('Get all salary records error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
const getEmployeeSalaryRecordsForAdmin = async (req, res) => {
    try {
        const salaries = await Salary.find({ employeeId: req.params.employeeId }).populate('employeeId', 'firstName lastName email').sort({ year: -1, month: -1 });
        if (!salaries || salaries.length === 0) {
            return res.status(404).json({ message: 'No salary records found for this employee' });
        }
        res.status(200).json(salaries);
    } catch (err) {
        console.error('Get employee salary records error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
const getMySalaryRecords = async (req, res) => {
    try {
        const salaries = await Salary.find({ employeeId: req.user._id }).sort({ year: -1, month: -1 });
        res.status(200).json(salaries);
    } catch (err) {
        console.error('Get my salary records error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createSalaryRecord,
    getAllSalaryRecords,
    getEmployeeSalaryRecordsForAdmin,
    getMySalaryRecords,
};

