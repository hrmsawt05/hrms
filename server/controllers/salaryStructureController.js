// controllers/salaryStructureController.js
const SalaryStructure = require('../models/SalaryStructure');
const Department = require('../models/Department'); // Needed for population

// @desc    Create a new salary structure
// @route   POST /api/salary-structures
// @access  Private/Admin
const createSalaryStructure = async (req, res) => {
    try {
        const { role, position, department, basePay, hra, insurance } = req.body;

        const newStructure = new SalaryStructure({
            role,
            position,
            department,
            basePay,
            hra,
            insurance,
        });

        await newStructure.save();

        res.status(201).json({
            message: 'Salary structure created successfully',
            structure: newStructure,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A salary structure for this role, position, and department already exists.' });
        }
        console.error('Create salary structure error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all salary structures
// @route   GET /api/salary-structures
// @access  Private/Admin
const getAllSalaryStructures = async (req, res) => {
    try {
        // ⭐ POPULATE added to show the department name, making it more user-friendly
        const structures = await SalaryStructure.find({}).populate('department', 'departmentName');
        res.status(200).json(structures);
    } catch (err) {
        console.error('Get all salary structures error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a salary structure
// @route   PUT /api/salary-structures/:id
// @access  Private/Admin
const updateSalaryStructure = async (req, res) => {
    try {
        const structure = await SalaryStructure.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Options: return the updated doc and run schema validators
        );

        if (!structure) {
            return res.status(404).json({ message: 'Salary structure not found' });
        }

        res.status(200).json({
            message: 'Salary structure updated successfully',
            structure,
        });
    } catch (err) {
         if (err.code === 11000) {
            return res.status(400).json({ message: 'Update failed: A structure with these details may already exist.' });
        }
        console.error('Update salary structure error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Delete a salary structure
// @route   DELETE /api/salary-structures/:id
// @access  Private/Admin
const deleteSalaryStructure = async (req, res) => {
    try {
        const structure = await SalaryStructure.findById(req.params.id);

        if (!structure) {
            return res.status(404).json({ message: 'Salary structure not found' });
        }

        await structure.deleteOne();

        res.status(200).json({ message: 'Salary structure deleted successfully' });
    } catch (err) {
        console.error('Delete salary structure error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSalaryStructure,
    getAllSalaryStructures,
    updateSalaryStructure, 
    deleteSalaryStructure,
};
