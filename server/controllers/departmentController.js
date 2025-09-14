const Department = require('../models/Department');

/**
 * @desc    Create a new department
 * @route   POST /api/departments
 * @access  Private/Admin
 */
const createDepartment = async (req, res) => {
    try {
        const { departmentName, location } = req.body;

        if (!departmentName) {
            return res.status(400).json({ message: 'Department name is required.' });
        }

        const departmentExists = await Department.findOne({ departmentName });
        if (departmentExists) {
            return res.status(400).json({ message: 'A department with this name already exists.' });
        }

        const newDepartment = await Department.create({
            departmentName,
            location
        });

        res.status(201).json({ message: 'Department created successfully', department: newDepartment });
    } catch (err) {
        console.error('Create department error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).sort({ departmentName: 1 });
        res.status(200).json(departments);
    } catch (err) {
        console.error('Get all departments error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ⭐ THE FIX: Ensure both functions are exported.
module.exports = { createDepartment, getAllDepartments };

