// routes/salaryStructureRoutes.js
const express = require('express');
const router = express.Router();
const {
    createSalaryStructure,
    getAllSalaryStructures,
    deleteSalaryStructure,
} = require('../controllers/salaryStructureController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ⭐ Create a new salary structure (Admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createSalaryStructure);

// ⭐ Get all salary structures (Admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllSalaryStructures);

// ⭐ Delete a salary structure by ID (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteSalaryStructure);

module.exports = router;
