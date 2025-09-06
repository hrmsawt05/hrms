const Department = require('../models/Department'); 

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private/Admin
const getAllDepartments = async (req, res) => {
    try {
        // Find all departments and sort them by name
        const departments = await Department.find({}).sort({ departmentName: 1 });
        res.status(200).json(departments);
    } catch (err) {
        console.error('Get all departments error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllDepartments };
