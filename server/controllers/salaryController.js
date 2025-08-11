// controllers/salaryController.js
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const SalaryStructure = require('../models/SalaryStructure'); // ⭐ Import the new SalaryStructure model
const User = require('../models/User'); // We need this to get user roles

// @desc    Create a new salary record for an employee based on SalaryStructure
// @route   POST /api/salaries
// @access  Private/Admin
const createSalaryRecord = async (req, res) => {
    try {
        // We only need the employeeId, month, and year from the request body
        const { employeeId, month, year } = req.body;

        // 1. Find the employee to get their role, position, and department
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // We also need the user's role from the User model
        const user = await User.findById(employeeId);
        if (!user) {
            return res.status(404).json({ message: 'User record not found' });
        }

        // 2. Find the salary structure for this employee's role and department
        const salaryStructure = await SalaryStructure.findOne({
            role: user.role,
            department: employee.departmentId,
            position: employee.position, // Assuming we've added a position field to the employee model
        });

        if (!salaryStructure) {
            return res.status(404).json({ message: 'Salary structure not found for this employee.' });
        }
        
        // 3. Calculate net salary based on the structure (and attendance, if implemented)
        // For now, we'll use the structure directly. You can add attendance logic here later.
        const { basePay, hra, insurance, incentives } = salaryStructure;
        const netSalary = (basePay + hra + incentives) - insurance;

        // 4. Create the new salary record
        const newSalaryRecord = new Salary({
            employeeId,
            basePay,
            hra,
            insurance,
            incentives,
            netSalary,
            month,
            year,
        });

        await newSalaryRecord.save();

        res.status(201).json({
            message: 'Salary record created successfully',
            salary: newSalaryRecord,
        });
    } catch (err) {
        console.error('Create salary record error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ... (other functions like getAllSalaryRecords remain the same)

// @desc    Get all salary records (Admin only)
// @route   GET /api/salaries
// @access  Private/Admin
const getAllSalaryRecords = async (req, res) => {
    try {
        // Find all salary records and populate employee details
        const salaries = await Salary.find({}).populate('employeeId', 'firstName lastName email');
        res.status(200).json(salaries);
    } catch (err) {
        console.error('Get all salary records error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get salary records for a specific employee
// @route   GET /api/salaries/employee/:employeeId
// @access  Private/Admin & Employee
const getEmployeeSalaryRecords = async (req, res) => {
    try {
        const salaries = await Salary.find({ employeeId: req.params.employeeId });

        if (!salaries) {
            return res.status(404).json({ message: 'Salary records not found for this employee' });
        }
        
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.employeeId) {
             return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(salaries);
    } catch (err) {
        console.error('Get employee salary records error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSalaryRecord,
    getAllSalaryRecords,
    getEmployeeSalaryRecords,
};
