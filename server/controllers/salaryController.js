// controllers/salaryController.js
const Salary = require('../models/Salary');
const SalaryStructure = require('../models/SalaryStructure');
const User = require('../models/User'); // The ONLY model we need for employee data

// @desc    Create a new salary record for an employee
// @route   POST /api/salaries
// @access  Private/Admin
const createSalaryRecord = async (req, res) => {
    try {
        const { employeeId, month, year, incentives = 0 } = req.body;

        // 1. Find the employee's complete record from the User model
        const user = await User.findById(employeeId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Find the salary structure for this user's role, position, and department
        const salaryStructure = await SalaryStructure.findOne({
            role: user.role,
            department: user.department,
            position: user.position,
        });

        if (!salaryStructure) {
            return res.status(404).json({
                message: `Salary structure not found for a ${user.position} in this department.`
            });
        }

        // 3. Check if a salary record for this month/year already exists
        const existingRecord = await Salary.findOne({ employeeId, month, year });
        if (existingRecord) {
            return res.status(400).json({ message: `Salary record for ${month}/${year} already exists.` });
        }

        // 4. Calculate net salary
        const { basePay, hra, insurance } = salaryStructure;
        const netSalary = (basePay + hra + incentives) - insurance;

        // 5. Create and save the new salary record
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
        res.status(500).json({ message: 'Server error while creating salary record.' });
    }
};

// @desc    Get all salary records
// @route   GET /api/salaries
// @access  Private/Admin
const getAllSalaryRecords = async (req, res) => {
    try {
        const salaries = await Salary.find({})
            .populate('employeeId', 'fullName email') // Using the 'fullName' virtual
            .sort({ year: -1, month: -1 }); // Sort by most recent first
        res.status(200).json(salaries);
    } catch (err) {
        console.error('Get all salary records error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get salary records for a specific employee
// @route   GET /api/salaries/employee/:employeeId
// @access  Private/Admin or the specific Employee
const getEmployeeSalaryRecords = async (req, res) => {
    try {
        // Security check: an employee can only view their own salary
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.employeeId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const salaries = await Salary.find({ employeeId: req.params.employeeId })
            .sort({ year: -1, month: -1 }); // Sort by most recent first

        // Refined "not found" check
        if (!salaries || salaries.length === 0) {
            return res.status(404).json({ message: 'No salary records found for this employee.' });
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
