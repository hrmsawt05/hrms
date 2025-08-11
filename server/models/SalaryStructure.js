// models/SalaryStructure.js
const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['admin', 'employee'], // Corresponds to the roles in your User model
    },
    position: { // This could be something like 'Senior Developer', 'Team Lead', etc.
        type: String,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    basePay: {
        type: Number,
        required: true,
    },
    hra: {
        type: Number,
        default: 0,
    },
    insurance: {
        type: Number,
        default: 0,
    },
    // We could add other components like 'incentives', 'bonus', etc.
}, { timestamps: true });

// Create a compound unique index to prevent duplicate salary structures
salaryStructureSchema.index({ role: 1, position: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
